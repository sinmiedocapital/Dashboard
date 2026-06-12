"""
Tradovate Trade Copier — Replit Edition (No API Keys Needed)
------------------------------------------------------------
Works on EVAL prop firm accounts by logging in via browser automation
instead of the Tradovate REST API (which requires API keys).

Accounts:
  PRIMARY  → Lucid Pro $50,400  (you trade on TradingView here)
  FOLLOWER → Tradeify $25,000   (mirrors every fill automatically)

Setup on Replit:
  1. Add credentials in the Secrets tab (lock icon)
  2. Run in Shell: pip install playwright && playwright install chromium
  3. Hit Run
  4. Keep this tab open while you trade
"""

import os
import json
import time
import logging
import threading
import requests
import websocket
from http.server import HTTPServer, BaseHTTPRequestHandler
from playwright.sync_api import sync_playwright

# Load secrets from Replit environment (or .env locally)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s",
    datefmt="%H:%M:%S",
)

# ── Environment ───────────────────────────────────────────────────────────────
ENV       = os.getenv("TRADOVATE_ENV", "demo")
REST_BASE = "https://demo.tradovateapi.com/v1" if ENV == "demo" else "https://live.tradovateapi.com/v1"
WS_URL    = "wss://demo.tradovateapi.com/v1/websocket" if ENV == "demo" else "wss://live.tradovateapi.com/v1/websocket"

# ── Account definitions ───────────────────────────────────────────────────────
ACCOUNTS = {
    "primary": {
        "label":    "Lucid Pro $50K (Primary)",
        "username": os.getenv("PRIMARY_USERNAME"),
        "password": os.getenv("PRIMARY_PASSWORD"),
    },
    "follower": {
        "label":    "Tradeify $25K",
        "username": os.getenv("FOLLOWER_USERNAME"),
        "password": os.getenv("FOLLOWER_PASSWORD"),
    },
}

sessions        = {}
_seen_fills     = set()
_contract_cache = {}
_ws_req_id      = 1
_start_time     = time.time()


# ── Browser-based authentication (no API keys needed) ─────────────────────────
def get_token_via_browser(username: str, password: str, label: str) -> str:
    """Log into Tradovate web interface and capture the access token."""
    captured = {}

    def handle_response(response):
        if "accesstokenrequest" in response.url and response.status == 200:
            try:
                data = response.json()
                if "accessToken" in data:
                    captured["token"] = data["accessToken"]
            except Exception:
                pass

    logging.info(f"  Opening browser for [{label}]…")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page    = browser.new_page()
        page.on("response", handle_response)

        page.goto("https://trader.tradovate.com", wait_until="networkidle")
        page.wait_for_selector('input[name="name"]', timeout=15000)

        page.fill('input[name="name"]', username)
        page.fill('input[name="password"]', password)
        page.click('button[type="submit"]')

        # Wait for auth response to come back
        page.wait_for_timeout(7000)
        browser.close()

    if "token" not in captured:
        raise RuntimeError(
            f"Could not capture token for [{label}]. "
            "Check username/password or try again."
        )
    return captured["token"]


def authenticate(key: str):
    acc   = ACCOUNTS[key]
    token = get_token_via_browser(acc["username"], acc["password"], acc["label"])

    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{REST_BASE}/account/list", headers=headers, timeout=10)
    r.raise_for_status()
    accts = r.json()
    if not accts:
        raise RuntimeError(f"No accounts found for {acc['label']}")

    acct          = accts[0]
    sessions[key] = {
        "token":        token,
        "account_id":   acct["id"],
        "account_spec": acct["name"],
        "expiry":       time.time() + 82800,
        "label":        acc["label"],
    }
    logging.info(f"  ✓  [{acc['label']}]  →  account: {acct['name']}")


def ensure_auth(key: str):
    s = sessions.get(key)
    if not s or time.time() > s["expiry"] - 120:
        authenticate(key)


# ── Health check server ───────────────────────────────────────────────────────
class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        uptime = int(time.time() - _start_time)
        accts  = ", ".join(s["label"] for s in sessions.values() if s.get("label"))
        self.wfile.write(f"OK | uptime={uptime}s | env={ENV} | {accts}".encode())

    def log_message(self, *args):
        pass


def start_health_server():
    port   = int(os.getenv("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    logging.info(f"Health check on :{port}")


# ── Order placement ───────────────────────────────────────────────────────────
def place_order(key: str, symbol: str, action: str, qty: int):
    ensure_auth(key)
    s       = sessions[key]
    payload = {
        "accountSpec": s["account_spec"],
        "accountId":   s["account_id"],
        "action":      action,
        "symbol":      symbol,
        "orderQty":    qty,
        "orderType":   "Market",
        "isAutomated": True,
    }
    headers = {
        "Authorization": f"Bearer {s['token']}",
        "Content-Type":  "application/json",
    }
    r      = requests.post(f"{REST_BASE}/order/placeorder", json=payload, headers=headers, timeout=10)
    r.raise_for_status()
    result = r.json()
    logging.info(f"       [{s['label']}]  {action} {qty} {symbol}  →  orderId={result.get('orderId', '?')}")
    return result


def mirror_to_follower(symbol: str, action: str, qty: int):
    logging.info(f"⚡  Mirroring  {action} {qty} {symbol}  →  Tradeify…")
    try:
        place_order("follower", symbol, action, qty)
    except Exception as e:
        logging.error(f"  ✗  [Tradeify]  Failed: {e}")


# ── Symbol resolution ─────────────────────────────────────────────────────────
def resolve_symbol(contract_id) -> str:
    if not contract_id:
        return None
    if contract_id in _contract_cache:
        return _contract_cache[contract_id]
    try:
        ensure_auth("primary")
        headers = {"Authorization": f"Bearer {sessions['primary']['token']}"}
        r       = requests.get(
            f"{REST_BASE}/contract/item?id={contract_id}",
            headers=headers,
            timeout=5,
        )
        r.raise_for_status()
        name = r.json().get("name")
        if name:
            _contract_cache[contract_id] = name
        return name
    except Exception as e:
        logging.warning(f"Could not resolve contractId {contract_id}: {e}")
        return None


# ── Fill processing ───────────────────────────────────────────────────────────
def process_fill(fill: dict):
    fill_id = fill.get("id")
    if not fill_id or fill_id in _seen_fills:
        return
    _seen_fills.add(fill_id)

    action      = fill.get("action")
    qty         = fill.get("qty", 0)
    contract_id = fill.get("contractId")
    symbol      = resolve_symbol(contract_id)

    if not symbol or not action or qty == 0:
        return

    logging.info(f"★  Fill on PRIMARY: {action} {qty} {symbol}  (fillId={fill_id})")
    mirror_to_follower(symbol, action, qty)


# ── WebSocket handlers ────────────────────────────────────────────────────────
def ws_send(ws, endpoint: str, body: dict = None):
    global _ws_req_id
    body_str  = json.dumps(body) if body else ""
    msg       = f"{endpoint}\n{_ws_req_id}\n\n{body_str}"
    ws.send(msg)
    _ws_req_id += 1


def on_open(ws):
    logging.info("WebSocket open — authorising…")
    ensure_auth("primary")
    ws_send(ws, "authorize", {"token": sessions["primary"]["token"]})


def on_message(ws, raw):
    if not raw:
        return
    if raw[0] == "h":
        ws.send("[]")
        return
    if raw[0] != "a":
        return
    try:
        frames = json.loads(raw[1:])
    except json.JSONDecodeError:
        return
    for frame in frames:
        handle_frame(ws, frame)


def handle_frame(ws, frame: dict):
    event = frame.get("e")
    data  = frame.get("d", {})

    if event == "authorized":
        logging.info("WebSocket authorised ✓  — watching for fills…")
        ws_send(ws, "user/syncrequest", {
            "accounts": [sessions["primary"]["account_id"]]
        })
    elif event == "fill":
        process_fill(data)
    elif event == "props":
        for fill in data.get("fill", []):
            process_fill(fill)
    elif event == "error":
        logging.error(f"Server error: {data}")


def on_error(ws, error):
    logging.error(f"WebSocket error: {error}")


def on_close(ws, code, msg):
    logging.warning(f"WebSocket closed ({code}) — reconnecting in 5s…")
    time.sleep(5)
    start_websocket()


def start_websocket():
    ws = websocket.WebSocketApp(
        WS_URL,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )
    ws.run_forever(ping_interval=20, ping_timeout=10)


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print()
    print("=" * 55)
    print("   Tradovate Trade Copier — Eval Edition")
    print("   Lucid Pro $50,400  →  Tradeify $25,000")
    print("=" * 55)
    print(f"   Mode : {ENV.upper()}")
    print()
    print("Logging in via browser (this takes ~15 seconds)…")
    print()

    for key in ("primary", "follower"):
        try:
            authenticate(key)
        except Exception as e:
            logging.error(f"FATAL — {e}")
            time.sleep(60)
            raise SystemExit(1)

    print()
    print("Both accounts connected.")
    print()
    print("► Connect TradingView to LUCID PRO (LTTZ9ZU99Z7)")
    print("► Trade normally — Tradeify mirrors every fill automatically.")
    print("► Keep this tab open while you trade.")
    print()

    start_health_server()
    start_websocket()

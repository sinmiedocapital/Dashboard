"""
Tradovate Trade Copier
----------------------
Run this script in the background (or deploy to Fly.io) while you trade on TradingView.
It watches your PRIMARY (Lucid Pro #1) account for fills and instantly
mirrors every trade to your follower accounts (Lucid Pro #2 + Tradeify).

Usage:
    python copier.py
"""

import os
import json
import time
import logging
import threading
import requests
import websocket
from http.server import HTTPServer, BaseHTTPRequestHandler
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s",
    datefmt="%H:%M:%S",
)

# ── Environment ───────────────────────────────────────────────────────────────
ENV       = os.getenv("TRADOVATE_ENV", "demo")
REST_BASE = "https://demo.tradovateapi.com/v1" if ENV == "demo" else "https://live.tradovateapi.com/v1"
WS_URL    = "wss://demo.tradovateapi.com/v1/websocket" if ENV == "demo" else "wss://live.tradovateapi.com/v1/websocket"

CID         = os.getenv("CID")
SEC         = os.getenv("SEC")
APP_ID      = os.getenv("APP_ID", "Sample App")
APP_VERSION = os.getenv("APP_VERSION", "1.0")

# ── Account definitions ───────────────────────────────────────────────────────
# PRIMARY  = the account you connect to TradingView and trade on
# FOLLOWER = accounts that automatically mirror every fill
ACCOUNTS = {
    "primary": {
        "label":     "Lucid Pro #1 (Primary)",
        "username":  os.getenv("PRIMARY_USERNAME"),
        "password":  os.getenv("PRIMARY_PASSWORD"),
        "device_id": os.getenv("PRIMARY_DEVICE_ID", "primary-001"),
    },
    "follower1": {
        "label":     "Lucid Pro #2",
        "username":  os.getenv("FOLLOWER1_USERNAME"),
        "password":  os.getenv("FOLLOWER1_PASSWORD"),
        "device_id": os.getenv("FOLLOWER1_DEVICE_ID", "follower1-001"),
    },
    "follower2": {
        "label":     "Tradeify",
        "username":  os.getenv("FOLLOWER2_USERNAME"),
        "password":  os.getenv("FOLLOWER2_PASSWORD"),
        "device_id": os.getenv("FOLLOWER2_DEVICE_ID", "follower2-001"),
    },
}

sessions        = {}
_seen_fills     = set()
_contract_cache = {}
_ws_req_id      = 1
_start_time     = time.time()


# ── Health check server (for Fly.io / monitoring) ─────────────────────────────
class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        uptime  = int(time.time() - _start_time)
        accts   = ", ".join(s["label"] for s in sessions.values() if s.get("label"))
        self.wfile.write(f"OK | uptime={uptime}s | env={ENV} | accounts={accts}".encode())

    def log_message(self, *args):
        pass  # silence noisy access logs


def start_health_server():
    port   = int(os.getenv("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    logging.info(f"Health check listening on :{port}")


# ── Authentication ────────────────────────────────────────────────────────────
def authenticate(key: str):
    acc     = ACCOUNTS[key]
    payload = {
        "name":       acc["username"],
        "password":   acc["password"],
        "appId":      APP_ID,
        "appVersion": APP_VERSION,
        "deviceId":   acc["device_id"],
        "cid":        int(CID),
        "sec":        SEC,
    }
    r = requests.post(f"{REST_BASE}/auth/accesstokenrequest", json=payload, timeout=10)
    r.raise_for_status()
    data = r.json()

    if "errorText" in data:
        raise RuntimeError(f"Auth failed [{acc['label']}]: {data['errorText']}")

    token   = data["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}

    r2    = requests.get(f"{REST_BASE}/account/list", headers=headers, timeout=10)
    r2.raise_for_status()
    accts = r2.json()
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


def mirror_to_followers(symbol: str, action: str, qty: int):
    logging.info(f"⚡  Mirroring  {action} {qty} {symbol}  to followers…")
    threads = []
    for key in ("follower1", "follower2"):
        t = threading.Thread(
            target=_safe_place_order,
            args=(key, symbol, action, qty),
            daemon=True,
        )
        t.start()
        threads.append(t)
    for t in threads:
        t.join(timeout=15)


def _safe_place_order(key, symbol, action, qty):
    try:
        place_order(key, symbol, action, qty)
    except Exception as e:
        label = sessions.get(key, {}).get("label", key)
        logging.error(f"  ✗  [{label}]  Failed to place order: {e}")


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
            logging.info(f"  Resolved contractId {contract_id} → {name}")
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
        logging.warning(f"  Fill {fill_id} skipped — missing data: {fill}")
        return

    logging.info(f"★  Fill on PRIMARY: {action} {qty} {symbol}  (fillId={fill_id})")
    mirror_to_followers(symbol, action, qty)


# ── WebSocket handlers ────────────────────────────────────────────────────────
def ws_send(ws, endpoint: str, body: dict = None):
    global _ws_req_id
    body_str  = json.dumps(body) if body else ""
    msg       = f"{endpoint}\n{_ws_req_id}\n\n{body_str}"
    ws.send(msg)
    _ws_req_id += 1


def on_open(ws):
    logging.info("WebSocket open — authenticating…")
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
        logging.info("WebSocket authorised ✓")
        logging.info("Subscribing to account events…")
        ws_send(ws, "user/syncrequest", {
            "accounts": [sessions["primary"]["account_id"]]
        })
    elif event == "fill":
        process_fill(data)
    elif event == "props":
        for fill in data.get("fill", []):
            process_fill(fill)
    elif event == "error":
        logging.error(f"Server error frame: {data}")


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
    print("=" * 50)
    print("   Tradovate Trade Copier")
    print("=" * 50)
    print(f"   Mode : {ENV.upper()}")
    print()

    if not CID or CID == "PASTE_YOUR_CID_HERE":
        print("ERROR: CID and SEC not set in .env / environment variables.")
        print("Get them at: demo.tradovate.com → Menu → API Access")
        raise SystemExit(1)

    print("Authenticating accounts…")
    for key in ("primary", "follower1", "follower2"):
        try:
            authenticate(key)
        except Exception as e:
            logging.error(f"FATAL — could not authenticate: {e}")
            logging.error("Waiting 60s before exit to prevent restart loop…")
            time.sleep(60)
            raise SystemExit(1)

    print()
    print("All 3 accounts connected.")
    print()
    print("► Trade on TradingView using your LUCID PRO #1 account.")
    print("► Every fill copies automatically to Lucid Pro #2 + Tradeify.")
    print("► Press Ctrl+C to stop.")
    print()

    start_health_server()
    start_websocket()

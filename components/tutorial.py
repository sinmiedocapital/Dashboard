"""Tutorial tab — explains futures trading and how to use the dashboard."""

import streamlit as st


def _card(title: str, body: str, icon: str = "", accent: str = "#1a3060"):
    st.markdown(
        f'<div style="background:#eef3ff;border-left:4px solid {accent};'
        f'border-radius:6px;padding:14px 18px;margin-bottom:14px;">'
        f'<div style="font-weight:700;font-size:1.0em;color:{accent};margin-bottom:6px;">'
        f'{icon + "  " if icon else ""}{title}</div>'
        f'<div style="font-size:0.88em;color:#0a1428;line-height:1.6;">{body}</div>'
        f'</div>',
        unsafe_allow_html=True,
    )


def _section_header(text: str):
    st.markdown(
        f'<div style="font-size:1.15em;font-weight:700;color:#1a3060;'
        f'border-bottom:2px solid #1a3060;padding-bottom:6px;margin:24px 0 14px 0;">'
        f'{text}</div>',
        unsafe_allow_html=True,
    )


def _pill(label: str, color: str = "#1a3060"):
    return (
        f'<span style="background:{color};color:#fff;border-radius:12px;'
        f'padding:2px 10px;font-size:0.82em;font-weight:600;">{label}</span>'
    )


def render_tutorial():
    st.markdown(
        '<div style="font-size:0.85em;color:#5577aa;margin-bottom:18px;">'
        'New to futures or this dashboard? Read this first — no prior experience needed.'
        '</div>',
        unsafe_allow_html=True,
    )

    # ── Quick navigation ────────────────────────────────────────────────────
    nav_cols = st.columns(6)
    sections = [
        ("📖", "Futures 101"),
        ("📜", "MCL & MES"),
        ("🗺️", "Dashboard Guide"),
        ("🔑", "Key Terms"),
        ("🛡️", "Risk Rules"),
        ("🧠", "Psychology"),
    ]
    for col, (icon, label) in zip(nav_cols, sections):
        with col:
            st.markdown(
                f'<div style="background:#1a3060;border-radius:8px;padding:10px 6px;'
                f'text-align:center;color:#fff;font-size:0.82em;font-weight:600;">'
                f'{icon}<br>{label}</div>',
                unsafe_allow_html=True,
            )

    st.markdown("<br>", unsafe_allow_html=True)

    # ── SECTION 1: What is Futures Trading? ─────────────────────────────────
    _section_header("📖 Futures 101 — What Is Futures Trading?")

    col1, col2 = st.columns(2)
    with col1:
        _card(
            "The Basic Idea",
            "A <b>futures contract</b> is an agreement to buy or sell something "
            "(like oil or an index) at a <b>set price</b> on a <b>future date</b>. "
            "As a trader, you rarely want the actual oil — you just want to profit "
            "from the <b>price moving up or down</b> before the contract expires.",
            "📄",
        )
        _card(
            "Going Long vs. Short",
            "<b>Long</b> = you buy a contract because you think the price will go <b>up</b>. "
            "You profit if it rises above your entry. <br><br>"
            "<b>Short</b> = you sell a contract because you think the price will go <b>down</b>. "
            "You profit if it falls below your entry. <br><br>"
            "Unlike stocks, you can profit in either direction — this is one of futures' "
            "key advantages.",
            "↕️",
            accent="#2d5090",
        )
        _card(
            "Leverage",
            "Futures use <b>margin</b> — you only need to put up a small deposit "
            "(e.g. $500–$2,000) to control a contract worth much more. This "
            "amplifies both gains <i>and</i> losses. A 1% move in the market can "
            "mean a 10%+ move in your account. This is why position sizing and "
            "stop-losses are critical.",
            "⚡",
            accent="#e67e22",
        )

    with col2:
        _card(
            "Ticks & Points — How You Make Money",
            "Price moves in <b>ticks</b> (the smallest step). Each tick has a dollar value:<br><br>"
            "• <b>MCL (Micro Crude Oil):</b> 1 tick = $0.01 = <b>$1.00</b><br>"
            "• <b>MES (Micro E-mini S&P):</b> 1 tick = 0.25 pts = <b>$1.25</b><br><br>"
            "If you're long 1 MCL contract and crude oil rises $1.00, "
            "you made <b>$100</b> (100 ticks × $1.00).",
            "💵",
        )
        _card(
            "Contract Expiration",
            "Futures contracts expire on a specific date (usually quarterly — "
            "March, June, September, December). As expiration approaches, most "
            "traders <b>roll</b> to the next contract month. "
            "The Micro contracts on this dashboard are short-term intraday "
            "vehicles — positions are typically closed before the end of the "
            "session to avoid overnight risk.",
            "📅",
            accent="#2d5090",
        )
        _card(
            "Why Micro Contracts?",
            "Standard futures can require <b>$5,000–$50,000+</b> in margin. "
            "<b>Micro contracts</b> are 1/10th the size of their standard "
            "counterparts, making them ideal for:<br>"
            "• Learning without huge capital at risk<br>"
            "• Precise position sizing<br>"
            "• Building a track record before scaling up",
            "🔬",
            accent="#27ae60",
        )

    # ── SECTION 2: MCL & MES ────────────────────────────────────────────────
    _section_header("📜 The Two Contracts — MCL & MES")

    c1, c2 = st.columns(2)
    with c1:
        st.markdown(
            '<div style="background:#fff8f0;border:1px solid #e67e22;border-radius:8px;'
            'padding:16px 20px;margin-bottom:12px;">'
            '<div style="font-size:1.1em;font-weight:700;color:#e67e22;">MCL — Micro Crude Oil</div>'
            '<div style="font-size:0.82em;color:#5577aa;margin-bottom:10px;">NYMEX WTI Light Sweet Crude</div>'
            '<table style="font-size:0.85em;width:100%;border-collapse:collapse;">'
            '<tr><td style="color:#5577aa;padding:3px 0;">Contract size</td><td style="font-weight:600;">100 barrels (1/10 of CL)</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Tick size</td><td style="font-weight:600;">$0.01 per barrel</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Tick value</td><td style="font-weight:600;">$1.00 per tick</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Price quoted</td><td style="font-weight:600;">USD per barrel</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Margin (approx)</td><td style="font-weight:600;">~$500–$800</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Moves with</td><td style="font-weight:600;">EIA reports, OPEC, geopolitics, USD</td></tr>'
            '</table>'
            '<div style="font-size:0.82em;color:#636e72;margin-top:10px;">'
            'Typical daily range: 80–200 ticks ($80–$200 per contract)'
            '</div>'
            '</div>',
            unsafe_allow_html=True,
        )
    with c2:
        st.markdown(
            '<div style="background:#f0f5ff;border:1px solid #1a3060;border-radius:8px;'
            'padding:16px 20px;margin-bottom:12px;">'
            '<div style="font-size:1.1em;font-weight:700;color:#1a3060;">MES — Micro E-mini S&P 500</div>'
            '<div style="font-size:0.82em;color:#5577aa;margin-bottom:10px;">CME S&P 500 Index Futures</div>'
            '<table style="font-size:0.85em;width:100%;border-collapse:collapse;">'
            '<tr><td style="color:#5577aa;padding:3px 0;">Contract size</td><td style="font-weight:600;">$5 × S&P 500 Index (1/10 of ES)</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Tick size</td><td style="font-weight:600;">0.25 index points</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Tick value</td><td style="font-weight:600;">$1.25 per tick</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Price quoted</td><td style="font-weight:600;">S&P 500 Index points</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Margin (approx)</td><td style="font-weight:600;">~$1,200–$1,600</td></tr>'
            '<tr><td style="color:#5577aa;padding:3px 0;">Moves with</td><td style="font-weight:600;">Fed policy, earnings, macro data, VIX</td></tr>'
            '</table>'
            '<div style="font-size:0.82em;color:#636e72;margin-top:10px;">'
            'Typical daily range: 40–120 points = 160–480 ticks ($200–$600 per contract)'
            '</div>'
            '</div>',
            unsafe_allow_html=True,
        )

    # ── SECTION 3: Dashboard Guide ──────────────────────────────────────────
    _section_header("🗺️ Dashboard Guide — Tab by Tab")

    tabs_info = [
        (
            "📊 Overview",
            "#1a3060",
            "Your daily <b>at-a-glance snapshot</b> for both contracts. Shows:<br>"
            "• Current price, daily change, and direction<br>"
            "• VWAP position (are we above or below?)<br>"
            "• Key support &amp; resistance levels identified by the system<br>"
            "• ATR (volatility) and volume context<br>"
            "• Sentiment and bias signals<br><br>"
            "<b>Use it to:</b> Quickly orient yourself before the open. "
            "If price is above VWAP with strong volume — lean long. "
            "Below VWAP with weak volume — lean short or stay flat.",
        ),
        (
            "📈 Charts",
            "#2d5090",
            "Live <b>TradingView charts</b> embedded directly in the dashboard. "
            "Both MCL and MES side by side on 5-minute bars with VWAP and RSI.<br><br>"
            "• <b>Toolbar</b> (top of chart): change timeframe, zoom, draw lines<br>"
            "• <b>Draw levels</b> directly on the chart — support, resistance, entries<br>"
            "• <b>Symbol</b> can be changed via the search box on the chart<br><br>"
            "<b>Use it to:</b> Confirm your thesis visually. "
            "Look for price action near key levels identified in the Overview tab.",
        ),
        (
            "📋 Thesis & Plan",
            "#16a085",
            "Where you <b>write and review your trade plan</b> before acting. Shows:<br>"
            "• AI-generated market thesis for both contracts (based on current data)<br>"
            "• Bullish and bearish scenarios<br>"
            "• Key price levels to watch<br>"
            "• Suggested bias direction<br><br>"
            "<b>Use it to:</b> Compare your own thesis with the dashboard's thesis. "
            "If they disagree, don't trade — or at minimum size down until there's alignment. "
            "Never trade without a written plan.",
        ),
        (
            "🧮 Risk Tools",
            "#8e44ad",
            "Three tools in one tab:<br>"
            "1. <b>R:R Calculator</b> — enter your entry, stop, and target to see your "
            "risk:reward ratio and exact dollar risk before placing the trade<br>"
            "2. <b>Trade Notes</b> — a scratchpad for your real-time thesis<br>"
            "3. <b>Pre-Session Checklist</b> — 20+ items to complete before trading. "
            "Don't trade until it's at least 90% green.<br><br>"
            "<b>Use it to:</b> Never enter a trade without running the R:R calculator first. "
            "If the ratio is below 2:1, skip the trade.",
        ),
        (
            "📰 News & Macro",
            "#c0392b",
            "The <b>macro environment</b> and <b>live news feed</b>:<br>"
            "• 10-Year Treasury Yield — rising yields often pressure equities (MES)<br>"
            "• VIX (Volatility Index) — above 20 = elevated fear, trade smaller<br>"
            "• DXY (US Dollar Index) — strong dollar often pressures crude (MCL)<br>"
            "• Crude oil inventory data, Fed speak, economic calendar<br>"
            "• Latest news headlines for both contracts<br><br>"
            "<b>Use it to:</b> Avoid trading into a high-impact news event. "
            "Check this tab first thing every morning.",
        ),
    ]

    for tab_name, color, description in tabs_info:
        with st.expander(tab_name, expanded=False):
            st.markdown(
                f'<div style="font-size:0.88em;color:#0a1428;line-height:1.7;'
                f'border-left:3px solid {color};padding-left:14px;">'
                f'{description}</div>',
                unsafe_allow_html=True,
            )

    # ── SECTION 4: Key Terms ────────────────────────────────────────────────
    _section_header("🔑 Key Terms — Plain English Glossary")

    terms = [
        ("VWAP", "Volume-Weighted Average Price",
         "The average price <i>weighted by volume</i> throughout the day. "
         "Think of it as the 'fair price' the market has agreed on so far. "
         "Price above VWAP = buyers in control. Below = sellers in control. "
         "Many traders use VWAP as a dynamic support/resistance level."),
        ("RSI", "Relative Strength Index",
         "A 0–100 oscillator that measures momentum. "
         "Above 70 = overbought (price may be due for a pullback). "
         "Below 30 = oversold (price may bounce). "
         "Most useful for spotting <i>divergence</i> — when price makes a new high but RSI doesn't, "
         "momentum is fading."),
        ("ATR", "Average True Range",
         "Measures how much a contract moves on average per bar. "
         "A 5-min ATR of 0.15 on MCL means each 5-min candle moves ~15 ticks on average. "
         "Use it to set realistic stop distances — your stop should be at least 1× ATR "
         "away from entry so normal noise doesn't stop you out."),
        ("R:R Ratio", "Risk:Reward Ratio",
         "How much you can win vs. how much you risk on one trade. "
         "A 1:2 R:R means you risk $100 to make $200. "
         "Only take trades with at least 2:1 R:R — this way you can be "
         "wrong 40% of the time and still be profitable overall."),
        ("Tick", "Smallest Price Increment",
         "The minimum price movement for a contract. "
         "MCL moves in $0.01 ticks ($1 each). MES moves in 0.25-point ticks ($1.25 each). "
         "Knowing tick value lets you calculate P&L instantly: "
         "15 ticks profit on 2 MES contracts = 15 × $1.25 × 2 = $37.50."),
        ("Margin", "Good-Faith Deposit",
         "The money held by your broker as collateral while you hold a futures position. "
         "It is NOT the cost of the contract — it's a deposit. "
         "<i>Initial margin</i> = required to open. "
         "<i>Maintenance margin</i> = minimum to keep open. "
         "If your account drops below maintenance, you get a margin call."),
        ("Mark-to-Market", "Daily Settlement",
         "Futures accounts are settled every day. "
         "If you hold a position overnight, your account is credited or debited "
         "the exact P&L of that day's move — even before you close the trade. "
         "This is different from stocks, where you only realize gains/losses when you sell."),
        ("Roll", "Switching Contract Months",
         "Before a futures contract expires, traders <i>roll</i> to the next active month — "
         "closing the expiring contract and opening the same position in the new month. "
         "This is why you'll sometimes see a sudden price gap between two sessions: "
         "the 'front month' changed."),
        ("EIA Report", "Energy Information Administration",
         "A weekly U.S. government report released every Wednesday at 10:30 AM ET. "
         "It shows crude oil inventory levels (how much oil is in storage). "
         "A surprise <b>draw</b> (less oil than expected) is bullish for MCL. "
         "A surprise <b>build</b> (more oil) is bearish. "
         "Expect sharp, fast moves in MCL around this release."),
        ("VIX", "Volatility Index / Fear Gauge",
         "Measures the market's expectation of S&P 500 volatility over the next 30 days. "
         "VIX < 15 = calm market, trend-following works well. "
         "VIX 15–25 = normal. VIX > 25 = elevated fear, size down. "
         "VIX > 35 = high fear / potential capitulation — be very careful with MES."),
    ]

    term_cols = st.columns(2)
    for i, (term, full_name, definition) in enumerate(terms):
        with term_cols[i % 2]:
            st.markdown(
                f'<div style="background:#ffffff;border:1px solid #c5d5ee;border-radius:6px;'
                f'padding:12px 16px;margin-bottom:10px;">'
                f'<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px;">'
                f'<span style="font-weight:700;color:#1a3060;font-size:0.95em;">{term}</span>'
                f'<span style="font-size:0.78em;color:#5577aa;">{full_name}</span>'
                f'</div>'
                f'<div style="font-size:0.84em;color:#0a1428;line-height:1.55;">{definition}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # ── SECTION 5: Risk Rules ───────────────────────────────────────────────
    _section_header("🛡️ Risk Management — The Non-Negotiable Rules")

    st.markdown(
        '<div style="background:#faeaea;border:1px solid #e74c3c;border-radius:8px;'
        'padding:14px 18px;margin-bottom:16px;font-size:0.88em;color:#0a1428;">'
        '⚠️ <b>Futures trading involves substantial risk of loss.</b> '
        'These rules exist to protect your capital. Ignoring them is the most common reason '
        'traders blow up accounts. Read them, internalize them, follow them every session.'
        '</div>',
        unsafe_allow_html=True,
    )

    rules = [
        ("1", "Define max daily loss before the first trade",
         "Decide — before you open the platform — the maximum dollar amount you will lose today. "
         "Common rule: 2–3% of account. Once hit, stop trading. No exceptions.",
         "#e74c3c"),
        ("2", "Never risk more than 1–2% per trade — hard cap at 5%",
         "Use the R:R Calculator (Risk Tools tab) every single time. "
         "Target 1–2% risk per trade as your standard. "
         "<b>5% is the absolute maximum</b> — a single trade should never put more than 5% "
         "of your account at risk under any circumstances, even on a high-conviction setup. "
         "At 5% risk, just 5 consecutive losers costs you 25% of your account. Stay conservative.",
         "#e67e22"),
        ("3", "Only take trades with R:R ≥ 2:1",
         "If your target is less than 2× your risk, skip the trade. "
         "A 2:1 ratio means you only need to be right 34% of the time to break even. "
         "This is your edge over time.",
         "#f39c12"),
        ("4", "Set your stop before you enter — and never move it against you",
         "Decide your stop level before clicking buy/sell. "
         "Once in the trade, you may move a stop to lock in profits (trailing stop), "
         "but never widen a losing stop to 'give it more room.'",
         "#27ae60"),
        ("5", "Avoid trading 30 min before and after major news events",
         "Check the economic calendar (News & Macro tab) each morning. "
         "Spreads widen, stops get hunted, and moves are unpredictable around "
         "EIA reports, CPI, FOMC, NFP, and ISM releases.",
         "#2980b9"),
        ("6", "Complete the Pre-Session Checklist before every session",
         "It takes 5 minutes and will save you from emotional, unplanned trades. "
         "Get to 90%+ green before touching a contract.",
         "#8e44ad"),
        ("7", "Trade the market in front of you, not the one in your head",
         "Your thesis is a hypothesis, not a guarantee. "
         "If price action contradicts your thesis, respect the market. "
         "The thesis guides your bias — price action is the final word.",
         "#16a085"),
    ]

    for num, title, body, color in rules:
        st.markdown(
            f'<div style="display:flex;gap:14px;background:#ffffff;border:1px solid #c5d5ee;'
            f'border-radius:8px;padding:14px 16px;margin-bottom:10px;">'
            f'<div style="min-width:32px;height:32px;background:{color};border-radius:50%;'
            f'display:flex;align-items:center;justify-content:center;'
            f'font-weight:700;color:#fff;font-size:0.9em;flex-shrink:0;">{num}</div>'
            f'<div>'
            f'<div style="font-weight:700;color:#0a1428;font-size:0.9em;margin-bottom:4px;">{title}</div>'
            f'<div style="font-size:0.84em;color:#3d5a80;line-height:1.55;">{body}</div>'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True,
        )

    # ── SECTION 6: Trading Psychology & Emotions ────────────────────────────
    _section_header("🧠 Trading Psychology & Emotions")

    st.markdown(
        '<div style="font-size:0.85em;color:#5577aa;margin-bottom:14px;">'
        'The market doesn\'t blow up accounts — emotions do. '
        'Understanding your own psychology is just as important as any technical skill.'
        '</div>',
        unsafe_allow_html=True,
    )

    # ── A: Revenge Trading ──────────────────────────────────────────────────
    with st.expander("🔴  Revenge Trading — What It Is & How to Stop It", expanded=False):
        st.markdown(
            '<div style="font-size:0.88em;color:#0a1428;line-height:1.7;'
            'border-left:3px solid #e74c3c;padding-left:14px;">',
            unsafe_allow_html=True,
        )
        _card(
            "What Is Revenge Trading?",
            "Revenge trading is entering a trade <b>to recover a loss</b> rather than because "
            "a valid setup exists. After a losing trade, the brain triggers a stress response — "
            "cortisol and adrenaline push you toward impulsive action. "
            "You overtrade, increase size, or abandon your rules entirely. "
            "The result is almost always a second, larger loss.",
            "⚠️",
            accent="#e74c3c",
        )
        _card(
            "Warning Signs — Am I Revenge Trading?",
            "• You just took a loss and feel a strong urge to trade immediately<br>"
            "• You're thinking about 'making back' the money you lost<br>"
            "• You're increasing position size after a losing trade<br>"
            "• You skipped the Pre-Session Checklist for this trade<br>"
            "• You feel angry, frustrated, or anxious<br>"
            "• You can't clearly articulate your setup in one sentence<br><br>"
            "If <b>any</b> of these apply, you are not in a tradeable state.",
            "🚨",
            accent="#c0392b",
        )
        _card(
            "The 5-Rule Revenge Trading Circuit Breaker",
            "<b>1. Two consecutive losses = mandatory break.</b> Close the platform. "
            "A 15-minute walk is not optional.<br><br>"
            "<b>2. Write before you re-enter.</b> Open your journal and describe the next "
            "setup in full — entry, stop, target, rationale. If you can't write it clearly, "
            "you're not ready to trade it.<br><br>"
            "<b>3. Reset to minimum size.</b> After a losing stretch, trade your smallest "
            "allowed size until you have 3 winning trades. Rebuild confidence, not P&L.<br><br>"
            "<b>4. Never trade to 'make back' money.</b> Each trade is independent. "
            "Yesterday's loss is irrelevant to today's setup. The market doesn't owe you anything.<br><br>"
            "<b>5. Honor your daily loss limit.</b> Once you hit it, the session is over — "
            "no matter how good the next setup looks.",
            "🛑",
            accent="#e67e22",
        )
        st.markdown('</div>', unsafe_allow_html=True)

    # ── B: Market Psychology ────────────────────────────────────────────────
    with st.expander("🟣  Market Psychology — Fear, Greed & Cognitive Biases", expanded=False):
        st.markdown(
            '<div style="font-size:0.88em;color:#0a1428;line-height:1.7;'
            'border-left:3px solid #8e44ad;padding-left:14px;">',
            unsafe_allow_html=True,
        )
        _card(
            "The Market Emotion Cycle",
            "Markets move in an emotional cycle that repeats across all timeframes. "
            "Recognizing where you — and the crowd — are in this cycle is an edge:<br><br>"
            "<b>Bull phase:</b> Optimism → Excitement → Thrill → <span style='color:#e74c3c;font-weight:600;'>Euphoria ← market tops form here</span><br>"
            "<b>Bear phase:</b> Anxiety → Denial → Fear → Panic → Capitulation → "
            "<span style='color:#27ae60;font-weight:600;'>Despondency ← market bottoms form here</span><br>"
            "<b>Recovery:</b> Hope → Relief → Optimism (cycle restarts)<br><br>"
            "The crowd is most bullish at tops and most bearish at bottoms — "
            "exactly backwards from optimal positioning. "
            "Your job is to fade the crowd at extremes, not join it.",
            "🔄",
            accent="#8e44ad",
        )

        biases = [
            ("FOMO", "Fear of Missing Out",
             "Chasing a move that has already happened because you're afraid of missing profit. "
             "<b>Antidote:</b> There is always another trade. Missing a move costs you nothing. "
             "Chasing it can cost you real money. If you missed it, mark it in your journal and wait for the next setup."),
            ("Anchoring", "Fixating on a Past Price",
             "Believing a price is 'cheap' or 'expensive' based on where it used to be, not where it is now. "
             "<b>Antidote:</b> Trade the current price structure, not your memory of an old one. "
             "The market has no obligation to return to any level."),
            ("Confirmation Bias", "Seeing What You Want to See",
             "Seeking out information that supports your existing thesis while ignoring evidence against it. "
             "<b>Antidote:</b> Actively argue the other side before entering every trade. "
             "Use the Thesis tab's bearish scenario section even when you're bullish."),
            ("Loss Aversion", "Holding Losers, Cutting Winners Early",
             "Psychologically, losses hurt roughly twice as much as equivalent gains feel good. "
             "This causes traders to hold losing trades hoping for a recovery, and exit winners too early. "
             "<b>Antidote:</b> Pre-define your stop and target before entering. Let the plan run — "
             "don't override it mid-trade based on feelings."),
            ("Recency Bias", "Extrapolating the Last Trade",
             "Assuming the next trade will go the same way as the last one. "
             "After a winner, overconfidence leads to oversizing. After a loser, fear causes undersizing or skipping valid setups. "
             "<b>Antidote:</b> Each trade is a statistically independent event. "
             "Your edge plays out over hundreds of trades, not one."),
        ]

        bias_cols = st.columns(2)
        for i, (name, full, desc) in enumerate(biases):
            with bias_cols[i % 2]:
                st.markdown(
                    f'<div style="background:#f8f0ff;border:1px solid #8e44ad;border-radius:6px;'
                    f'padding:12px 14px;margin-bottom:10px;">'
                    f'<div style="font-weight:700;color:#8e44ad;font-size:0.9em;margin-bottom:2px;">{name}</div>'
                    f'<div style="font-size:0.78em;color:#5577aa;margin-bottom:6px;">{full}</div>'
                    f'<div style="font-size:0.83em;color:#0a1428;line-height:1.55;">{desc}</div>'
                    f'</div>',
                    unsafe_allow_html=True,
                )
        st.markdown('</div>', unsafe_allow_html=True)

    # ── C: Trade Journaling ─────────────────────────────────────────────────
    with st.expander("🟢  Trade Journaling — Your Most Important Tool", expanded=False):
        st.markdown(
            '<div style="font-size:0.88em;color:#0a1428;line-height:1.7;'
            'border-left:3px solid #16a085;padding-left:14px;">',
            unsafe_allow_html=True,
        )
        _card(
            "Why Journal?",
            "Your memory is biased — it protects your ego by softening bad trades and inflating good ones. "
            "A journal is the only objective record of your actual trading behavior. "
            "Traders who journal consistently improve measurably faster than those who don't. "
            "It turns emotional experiences into data you can act on.<br><br>"
            "The goal isn't to feel good or bad about trades — it's to find patterns: "
            "<i>What setups work? When do I overtrade? What emotional state precedes my best trades?</i>",
            "📓",
            accent="#16a085",
        )
        _card(
            "What to Log — Per Trade Template",
            "<table style='width:100%;border-collapse:collapse;font-size:0.85em;'>"
            "<tr style='background:#e8f5f1;'><th style='padding:5px 8px;text-align:left;color:#16a085;'>Field</th><th style='padding:5px 8px;text-align:left;color:#16a085;'>What to Write</th></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Date &amp; Time</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Session date, entry time</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Contract</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>MCL or MES, # of contracts</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Direction</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Long or Short</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Entry / Stop / Target</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Planned prices before entry</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Actual Exit</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Where you actually closed</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>P&amp;L ($)</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Dollar gain or loss</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>P&amp;L (R)</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Result as multiples of risk (e.g. +2R, −1R)</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Setup Rationale</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>1–2 sentences: why did you take this trade?</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>Emotional State</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Before / during / after (calm, anxious, FOMO, etc.)</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;border-bottom:1px solid #c5d5ee;'>What I Did Well</td><td style='padding:4px 8px;border-bottom:1px solid #c5d5ee;'>Even on a losing trade, something went right</td></tr>"
            "<tr><td style='padding:4px 8px;color:#5577aa;'>What to Improve</td><td style='padding:4px 8px;'>One specific, actionable thing to change</td></tr>"
            "</table>",
            "📋",
            accent="#16a085",
        )
        _card(
            "Weekly Review — 15 Minutes Every Sunday",
            "Once a week, open your journal and calculate:<br>"
            "• <b>Win rate</b> — what % of trades were profitable?<br>"
            "• <b>Average R earned</b> — total R gained ÷ number of trades<br>"
            "• <b>Best setup</b> — which entry pattern produced the most R?<br>"
            "• <b>Worst habit</b> — what single behavior cost you the most?<br><br>"
            "A 45% win rate with 2.5R average winners is highly profitable. "
            "A 70% win rate with 0.8R average winners breaks even at best. "
            "The numbers tell the truth — trust them over your feelings.",
            "📅",
            accent="#1abc9c",
        )
        _card(
            "Recommended Journaling Tools",
            "• <b>Spreadsheet (Google Sheets / Excel)</b> — free, fully customizable, "
            "easy to add charts and formulas. Best starting point.<br>"
            "• <b>Notion</b> — free, great for combining trade logs with daily notes and screenshots<br>"
            "• <b>Edgewonk</b> — paid (~$169/yr), purpose-built trading journal with analytics, "
            "R-multiple tracking, and psychological tagging. Worth it once you're trading consistently.<br><br>"
            "Start simple. A Google Sheet you actually fill in beats a sophisticated tool you ignore.",
            "🛠️",
            accent="#27ae60",
        )
        st.markdown('</div>', unsafe_allow_html=True)

    # ── Footer ───────────────────────────────────────────────────────────────
    st.markdown(
        '<div style="background:#eef3ff;border-radius:6px;padding:12px 16px;'
        'margin-top:20px;font-size:0.8em;color:#5577aa;text-align:center;">'
        'Sin Miedo Capital — Tutorial Tab &nbsp;|&nbsp; '
        'For educational and internal use only. Not financial advice. '
        'Past performance does not guarantee future results.'
        '</div>',
        unsafe_allow_html=True,
    )

import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

const results = [
  { date: 'June 5, 2026',  pnl: '+$852',    detail: '86.67% win rate · 198 contracts · MES',   color: '#00c076' },
  { date: 'June 1, 2026',  pnl: '+$693',    detail: '6 trades · Select 25k · Tradeify',         color: '#00c076' },
  { date: 'June 2, 2026',  pnl: '+$523',    detail: '7 trades · Select 25k · Tradeify',         color: '#00c076' },
  { date: 'May 28, 2026',  pnl: '+$1,454',  detail: '35 trades · LucidTrading',                 color: '#00c076' },
  { date: 'May 29, 2026',  pnl: '+$794',    detail: '25 trades · LucidTrading',                 color: '#00c076' },
  { date: 'v5 Record',     pnl: '33-1',     detail: '$1,400 P&L · single session · MES',        color: '#ffd700' },
]

const tables = [
  {
    name: 'Info Panel',
    position: 'Top Right',
    color: '#6c5ce7',
    rows: [
      { label: 'HTF Bias',  desc: 'Is the 1-hour trend bullish or bearish? Only trade in this direction.' },
      { label: 'Filters',   desc: 'VWAP✓ Sess✓ RSI✓ Vol✓ — all four must be green before taking a trade.' },
      { label: 'Structure', desc: 'Is price in a bullish or bearish BOS/CHoCH sequence right now?' },
      { label: 'In Zone',   desc: 'Is price inside a Demand zone (longs) or Supply zone (shorts)?' },
      { label: 'Signal',    desc: '"LONG READY" or "SHORT READY" — all conditions met. "Waiting…" means stand down.' },
      { label: 'Score',     desc: 'HTF✓ VWAP✓ STR✓ │ X/6. A score of 5–6 = A+ setup. Size up.' },
      { label: 'News',      desc: '"⚠ NEWS WINDOW" = CPI, NFP, FOMC or EIA active. Trade with caution.' },
    ],
  },
  {
    name: 'Correlations',
    position: 'Bottom Left',
    color: '#fdcb6e',
    rows: [
      { label: 'NQ1!', desc: 'Nasdaq — moves tightly with MES. Both should agree before you enter.' },
      { label: 'CL1!', desc: 'Crude Oil — direct MCL confirmation. Watch this before every MCL trade.' },
      { label: 'GC1!', desc: 'Gold — risk-off barometer. Rising gold + falling equities = defensive market.' },
      { label: 'DX1!', desc: 'Dollar Index — dollar strength moves inversely to commodities and often equities.' },
    ],
    note: '3 or more aligned with your HTF bias = high confluence. Split markets = reduce size or skip.',
  },
  {
    name: 'Trade Log',
    position: 'Bottom Right',
    color: '#00c076',
    rows: [
      { label: 'Dir',    desc: 'LONG or SHORT' },
      { label: 'Entry',  desc: 'Price at which the signal fired' },
      { label: 'Result', desc: '"Open" = active · "Win TP1" = first target hit · "Loss SL" = stopped out' },
    ],
    note: 'Bottom row shows today\'s win rate — resets each session.',
  },
]

const flow = [
  'HTF Bias ▲',
  'Structure Bullish',
  'Price in Demand Zone',
  'VWAP✓  Sess✓  RSI✓  Vol✓',
  'Signal: LONG READY',
  'Corr 3+ ▲ aligned',
  'Candle confirms',
  'ENTER',
]

const pricing = [
  {
    label: 'Monthly',
    price: '$97',
    per: '/month',
    desc: 'Full access. Cancel anytime.',
    highlight: false,
  },
  {
    label: 'Annual',
    price: '$797',
    per: '/year',
    desc: 'Save 32% vs monthly. Best value.',
    highlight: true,
  },
  {
    label: 'Lifetime',
    price: '$1,497',
    per: ' one-time',
    desc: 'Pay once. Trade forever.',
    highlight: false,
  },
]

export default function HomePage() {
  return (
    <main style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1a1a2e' }}>
        <div>
          <span className="font-bold text-white">Sin Miedo Capital</span>
          <span className="text-slate-500 text-sm ml-2">· Trading Without Fear</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signals"
            className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#00c076' }}
          >
            Live Signals →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6" style={{ backgroundColor: '#00c07622', color: '#00c076' }}>
          SMC Venice [Scalper] v9
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Institutional SMC Confluence<br />for MES &amp; MCL Futures
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Nine confluences. One signal. No noise, no guessing — only high-conviction
          setups aligned to institutional market structure, built for funded prop accounts.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signals"
            className="inline-block text-sm px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#00c076' }}
          >
            Access Signal Dashboard
          </Link>
          <a
            href="#pricing"
            className="inline-block text-sm px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1a1a2e', color: '#94a3b8', border: '1px solid #2a2a3e' }}
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Live Results */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Live Documented Results</h2>
          <p className="text-slate-500 text-sm">Verified P&amp;L from active funded accounts. No backtests.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map(r => (
            <div
              key={r.date}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: r.color }}>{r.pnl}</div>
              <div className="text-xs text-slate-500 mb-1">{r.date}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{r.detail}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">
          Multiple funded accounts running simultaneously · Tradeify · LucidTrading
        </p>
      </section>

      {/* The Story */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div
          className="rounded-xl p-8"
          style={{ backgroundColor: '#13131f', border: '1px solid #2a2a3e', borderLeft: '4px solid #00c076' }}
        >
          <div className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: '#00c076' }}>
            Why We Trust the System
          </div>
          <blockquote className="text-white text-lg font-medium leading-relaxed mb-4">
            &ldquo;This morning I was $200 from my drawdown limit. The system said SHORT.
            I trusted it. Closed the day +$300.&rdquo;
          </blockquote>
          <p className="text-slate-400 text-sm">
            — Sin Miedo Capital founder · June 5, 2026 · LucidTrading funded account
          </p>
          <p className="text-slate-500 text-sm mt-4 leading-relaxed">
            That&apos;s what this indicator is built for. Not just finding setups — giving you
            the conviction to execute when it&apos;s hardest. Nine confluences aligned means
            you&apos;re not guessing. You&apos;re trading without fear.
          </p>
        </div>
      </section>

      {/* Tables guide */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">What&apos;s On Your Chart</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Three panels. Every piece of information you need. Nothing you don&apos;t.</p>
        <div className="space-y-4">
          {tables.map(t => (
            <div key={t.name} className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a3e' }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: '#1a1a2e' }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-semibold text-white">{t.name}</span>
                </div>
                <span className="text-xs text-slate-500">{t.position}</span>
              </div>
              <div style={{ backgroundColor: '#13131f' }}>
                {t.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-4 px-5 py-3 text-sm"
                    style={{ borderTop: i > 0 ? '1px solid #1a1a2e' : undefined }}
                  >
                    <span className="font-mono text-xs w-20 shrink-0 mt-0.5" style={{ color: t.color }}>
                      {row.label}
                    </span>
                    <span className="text-slate-400">{row.desc}</span>
                  </div>
                ))}
                {t.note && (
                  <div className="px-5 py-3 text-xs text-slate-500 italic" style={{ borderTop: '1px solid #1a1a2e' }}>
                    {t.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Flow */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">The Decision Flow</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Every signal passes through all nine gates. If any is red — the system waits.</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {flow.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{
                  backgroundColor: i === flow.length - 1 ? '#00c076' : '#1a1a2e',
                  color: i === flow.length - 1 ? '#fff' : '#94a3b8',
                  border: '1px solid #2a2a3e',
                }}
              >
                {step}
              </span>
              {i < flow.length - 1 && <span className="text-slate-600 text-xs">→</span>}
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Patience is the edge. The system does the waiting so you don&apos;t have to guess.
        </p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Pricing</h2>
          <p className="text-slate-500 text-sm">
            Paid access opens after 90 days of documented live results.
            <br />Join the waitlist — founding member spots are closed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {pricing.map(p => (
            <div
              key={p.label}
              className="rounded-xl p-6 text-center relative"
              style={{
                backgroundColor: p.highlight ? '#0d1f17' : '#1a1a2e',
                border: p.highlight ? '1px solid #00c076' : '1px solid #2a2a3e',
              }}
            >
              {p.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#00c076', color: '#fff' }}
                >
                  Best Value
                </div>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: p.highlight ? '#00c076' : '#64748b' }}>
                {p.label}
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-white">{p.price}</span>
                <span className="text-slate-500 text-sm">{p.per}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Waitlist CTA */}
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}>
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#ff3b5c22', color: '#ff3b5c' }}>
            Founding Spots Full
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Join the Waitlist</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Be first in line when paid access opens. No spam — one email when the doors open.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="border-t text-center py-8 text-xs text-slate-600" style={{ borderColor: '#1a1a2e' }}>
        Sin Miedo Capital · Trading Without Fear · SMC Venice v9
        <span className="mx-3">·</span>
        Results shown are from live funded accounts. Past performance does not guarantee future results.
      </footer>

    </main>
  )
}

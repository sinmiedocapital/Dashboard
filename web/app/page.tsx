import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

const tables = [
  {
    name: 'Info Panel',
    position: 'Top Right',
    color: '#6c5ce7',
    rows: [
      { label: 'HTF Bias',   desc: 'Is the 1-hour trend bullish or bearish? Only trade in this direction.' },
      { label: 'Filters',    desc: 'VWAP✓ Sess✓ RSI✓ Vol✓ — all four must be green before taking a trade.' },
      { label: 'Structure',  desc: 'Is price in a bullish or bearish BOS/CHoCH sequence right now?' },
      { label: 'In Zone',    desc: 'Is price inside a Demand zone (longs) or Supply zone (shorts)?' },
      { label: 'Signal',     desc: '"LONG READY" or "SHORT READY" — all conditions met. "Waiting…" means stand down.' },
      { label: 'Score',      desc: 'HTF✓ VWAP✓ STR✓ │ X/6. A score of 5–6 = A+ setup. Size up.' },
      { label: 'News',       desc: '"⚠ NEWS WINDOW" = CPI, NFP, FOMC or EIA active. Trade with caution.' },
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
    note: 'Bottom row shows running win rate. Green ≥60% · Gold 40–60% · Red <40%.',
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
            href="/tutorial"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Dev Guide
          </Link>
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
          The same system that generated $1,800 P&amp;L and a 33-1 win rate — now available to the Sin Miedo Capital community.
        </p>
        <Link
          href="/signals"
          className="inline-block text-sm px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#00c076' }}
        >
          Access Signal Dashboard
        </Link>
      </section>

      {/* Waitlist */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}>
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#ff3b5c22', color: '#ff3b5c' }}>
            Founding Spots Full
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Join the Waitlist</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Paid access opens once our founding members document 90 days of live results. Be first in line.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Tables guide */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">What&apos;s On Your Chart</h2>
        <div className="space-y-8">
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

      {/* Signal flow */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">The Decision Flow</h2>
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
          If any step is red — wait. Patience is the edge.
        </p>
      </section>

      <footer className="border-t text-center py-8 text-xs text-slate-600" style={{ borderColor: '#1a1a2e' }}>
        Sin Miedo Capital · Trading Without Fear · SMC Venice v9
      </footer>
    </main>
  )
}

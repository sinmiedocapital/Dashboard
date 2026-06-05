'use client'
import type { Signal } from '@/lib/types'

function fmt(n: number) {
  return n?.toFixed(2) ?? '—'
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function SignalCard({ signal }: { signal: Signal }) {
  const isLong = signal.action === 'buy'
  const accent = isLong ? '#00c076' : '#ff3b5c'
  const dirLabel = isLong ? '▲ LONG' : '▼ SHORT'

  const resultColor =
    signal.result === 'Win TP1' ? '#00c076' :
    signal.result === 'Loss SL' ? '#ff3b5c' :
    '#94a3b8'
  const resultLabel = signal.result ?? 'Open'

  return (
    <div
      className="rounded-lg p-4 mb-3 border-l-4"
      style={{
        backgroundColor: '#1a1a2e',
        borderLeftColor: accent,
        borderTop: '1px solid #2a2a3e',
        borderRight: '1px solid #2a2a3e',
        borderBottom: '1px solid #2a2a3e',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: accent + '22', color: accent }}
          >
            {dirLabel}
          </span>
          <span className="text-white font-semibold">{signal.symbol}</span>
          <span className="text-xs text-slate-400">{signal.tf}m</span>
          {signal.zone && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#0d1117', color: '#94a3b8' }}>
              {signal.zone}
            </span>
          )}
          {signal.candle && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#0d1117', color: '#94a3b8' }}>
              {signal.candle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: resultColor }}>
            {resultLabel}
          </span>
          <span className="text-xs text-slate-500">{timeAgo(signal.created_at)}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 text-sm">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">Entry</div>
          <div className="text-white font-mono">{fmt(signal.entry)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-0.5">Stop Loss</div>
          <div className="font-mono" style={{ color: '#ff3b5c' }}>{fmt(signal.sl)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-0.5">TP1</div>
          <div className="font-mono" style={{ color: '#00c076' }}>{fmt(signal.tp1)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-0.5">TP2</div>
          <div className="font-mono" style={{ color: '#00c076' }}>{fmt(signal.tp2)}</div>
        </div>
      </div>
    </div>
  )
}

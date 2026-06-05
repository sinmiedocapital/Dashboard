'use client'
import type { Signal } from '@/lib/types'
import Tooltip from './Tooltip'

const zoneGlossary: Record<string, string> = {
  'OB':         'Order Block — a price area where a large institution placed a big buy or sell order. Price often returns to these zones.',
  'FVG':        'Fair Value Gap — a price gap (imbalance) left behind by fast moves. Price tends to come back to "fill" these gaps.',
  'OB+FVG':     'Order Block + Fair Value Gap — double confirmation. Both signals overlap in the same zone. This is the strongest setup.',
  'Demand':     'Demand Zone — an area where buyers stepped in strongly before. Price bounced up from here. Good for long entries.',
  'Supply':     'Supply Zone — an area where sellers stepped in strongly before. Price dropped from here. Good for short entries.',
  'OB+Demand':  'Order Block inside a Demand Zone — institutional buying area confirmed by a demand zone. Strong long setup.',
  'OB+Supply':  'Order Block inside a Supply Zone — institutional selling area confirmed by a supply zone. Strong short setup.',
  'Breaker':    'Breaker Block — a failed Order Block that flipped. Was support, now resistance (or vice versa).',
  'Mitigation': 'Mitigation Block — an area where a previous order was partially filled. Price often returns to finish the job.',
}

const candleGlossary: Record<string, string> = {
  'Hammer':     'A candle with a long lower wick and small body. Shows buyers rejected lower prices — bullish signal.',
  'Pin Bar':    'A candle with a long wick in one direction. The tail shows a strong rejection of that price level.',
  'Engulfing':  'A large candle that completely covers the previous candle. Shows a strong reversal in momentum.',
  'BullEngulf': 'Bullish Engulfing — a large green candle that completely swallows the prior red candle. Shows buyers seized control — bullish reversal.',
  'BearEngulf': 'Bearish Engulfing — a large red candle that completely swallows the prior green candle. Shows sellers seized control — bearish reversal.',
  'ShootStar':  'Shooting Star — long upper wick, small body near the bottom. Price reached up but got rejected hard — bearish signal.',
  'Doji':       'A candle where open and close are nearly the same. Shows indecision — wait for the next candle to confirm.',
  'MSS':        'Market Structure Shift — price broke a key level, signaling that the trend may be changing direction.',
  'BOS':        'Break of Structure — price pushed through a recent high or low, confirming the current trend is continuing.',
  'Inside Bar': 'A candle contained entirely within the previous candle. Shows consolidation before a potential breakout.',
}

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

  const zoneTooltip = signal.zone ? zoneGlossary[signal.zone] : null
  const candleTooltip = signal.candle ? candleGlossary[signal.candle] : null

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
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: accent + '22', color: accent }}
          >
            {dirLabel}
          </span>
          <span className="text-white font-semibold">{signal.symbol}</span>
          <span className="text-xs text-slate-400">{signal.tf}m</span>
          {signal.zone && (
            zoneTooltip
              ? <Tooltip label={signal.zone} text={zoneTooltip} />
              : <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#0d1117', color: '#94a3b8' }}>{signal.zone}</span>
          )}
          {signal.candle && (
            candleTooltip
              ? <Tooltip label={signal.candle} text={candleTooltip} />
              : <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#0d1117', color: '#94a3b8' }}>{signal.candle}</span>
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

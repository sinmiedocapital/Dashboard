'use client'
import type { Signal } from '@/lib/types'

export default function WinRateBar({ signals }: { signals: Signal[] }) {
  const closed = signals.filter(s => s.result !== null)
  const wins   = closed.filter(s => s.result === 'Win TP1').length
  const losses = closed.filter(s => s.result === 'Loss SL').length
  const open   = signals.filter(s => s.result === null).length
  const rate   = closed.length > 0 ? (wins / closed.length) * 100 : null

  const rateColor =
    rate === null ? '#94a3b8' :
    rate >= 60    ? '#00c076' :
    rate >= 40    ? '#ffd700' :
                    '#ff3b5c'

  return (
    <div
      className="rounded-lg p-4 mb-6 flex items-center justify-between"
      style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}
    >
      <div className="flex items-center gap-6">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">Win Rate</div>
          <div className="text-2xl font-bold" style={{ color: rateColor }}>
            {rate !== null ? `${rate.toFixed(1)}%` : '—'}
          </div>
        </div>
        <div className="text-slate-600">|</div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Wins</div>
            <div className="font-bold" style={{ color: '#00c076' }}>{wins}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Losses</div>
            <div className="font-bold" style={{ color: '#ff3b5c' }}>{losses}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Open</div>
            <div className="font-bold text-white">{open}</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-500">
        {signals.length} total signals
      </div>
    </div>
  )
}

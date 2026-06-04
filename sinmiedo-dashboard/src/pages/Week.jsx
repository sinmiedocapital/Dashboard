import React from 'react'
import {
  getWeekEntries, monthlyTotal, avgDailyPL, overallWinRate,
  combinedPL, winRate, fmt, plColor, DAILY_TARGET, formatDate,
} from '../utils'
import MetricCard from '../components/MetricCard'
import PLChart from '../components/PLChart'

export default function Week({ entries }) {
  const week    = getWeekEntries(entries)
  const sorted  = [...week].sort((a, b) => a.date.localeCompare(b.date))
  const total   = monthlyTotal(week)
  const avg     = avgDailyPL(week)
  const wr      = overallWinRate(week)
  const daysHit = week.filter(e => combinedPL(e) >= DAILY_TARGET).length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-txt">This Week</h1>
        <p className="text-xs text-muted mt-0.5">Rolling 7 days · {week.length} session{week.length !== 1 ? 's' : ''} logged</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="7-Day P/L"      value={fmt(total)}   color={plColor(total)} />
        <MetricCard label="Avg Daily"       value={fmt(avg)}     color={plColor(avg)} />
        <MetricCard label="Win Rate"
          value={wr !== null ? `${wr.toFixed(1)}%` : '—'}
          color={wr !== null ? (wr >= 50 ? '#00e5a0' : '#ff3d6e') : '#4a5a7a'} />
        <MetricCard label="Days Hit Target"
          value={`${daysHit}/${week.length}`}
          color={daysHit >= week.length / 2 ? '#00e5a0' : '#ff3d6e'}
          sub={`${DAILY_TARGET.toLocaleString()}/day target`} />
      </div>

      <PLChart entries={sorted} />

      {sorted.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Day Breakdown</p>
          {sorted.map(e => {
            const pl  = combinedPL(e)
            const wr2 = winRate(e)
            const hit = pl >= DAILY_TARGET
            return (
              <div key={e.date} className="card card-hover p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-txt">{formatDate(e.date)}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {e.totalTrades || 0} trades
                    {wr2 !== null ? ` · ${wr2.toFixed(0)}% WR` : ''}
                    {e.mindset ? ` · ${['','😰','😟','😐','😊','🔥'][e.mindset]}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="num font-bold text-sm" style={{ color: plColor(pl) }}>{fmt(pl)}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: hit ? '#00e5a0' : '#ff3d6e' }}>
                    {hit ? '✓ Target hit' : 'Below target'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {week.length === 0 && (
        <div className="card p-10 text-center text-muted text-sm">
          No entries in the past 7 days.<br />
          <span className="text-[11px] opacity-60">Head to Today and log your first session.</span>
        </div>
      )}
    </div>
  )
}

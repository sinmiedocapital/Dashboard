import React from 'react'
import {
  currentYM, getMonthEntries, monthlyTotal, avgDailyPL, overallWinRate,
  combinedPL, bestDay, worstDay, projectedMonthly, currentStreak,
  daysUntilMonthEnd, MONTHLY_TARGET, DAILY_TARGET, monthName,
  fmt, fmtSign, plColor, formatShortDate,
} from '../utils'
import MetricCard from '../components/MetricCard'
import ProgressRing from '../components/ProgressRing'
import PLChart from '../components/PLChart'
import HeatMap from '../components/HeatMap'

export default function Month({ entries }) {
  const ym        = currentYM()
  const month     = getMonthEntries(entries, ym)
  const sorted    = [...month].sort((a, b) => a.date.localeCompare(b.date))
  const total     = monthlyTotal(month)
  const avg       = avgDailyPL(month)
  const wr        = overallWinRate(month)
  const best      = bestDay(month)
  const worst     = worstDay(month)
  const projected = projectedMonthly(month)
  const streak    = currentStreak(entries)
  const daysHit   = month.filter(e => combinedPL(e) >= DAILY_TARGET).length
  const daysLeft  = daysUntilMonthEnd()
  const pct       = Math.min(100, Math.max(0, (total / MONTHLY_TARGET) * 100))

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">{monthName(ym)}</h1>
          <p className="text-xs text-muted mt-0.5">
            {month.length} session{month.length !== 1 ? 's' : ''} · {daysLeft} days remaining
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-amber/10 border border-amber/20 px-3 py-1.5 rounded-full">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-amber">{streak}-day streak</span>
          </div>
        )}
      </div>

      {/* Progress ring + key stats */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing current={total} target={MONTHLY_TARGET} size={160} stroke={10} />
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          <MetricCard label="Avg Daily"    value={fmt(avg)}     color={plColor(avg)} />
          <MetricCard label="Win Rate"
            value={wr !== null ? `${wr.toFixed(1)}%` : '—'}
            color={wr !== null ? (wr >= 50 ? '#00e5a0' : '#ff3d6e') : '#4a5a7a'} />
          <MetricCard label="Days Hit Target"
            value={`${daysHit}/${month.length}`}
            color={daysHit > 0 ? '#00e5a0' : '#4a5a7a'} />
          <MetricCard label="Days Left"    value={daysLeft}     color="#ccd6f6" />
        </div>
      </div>

      {/* Projected + best/worst */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card card-hover p-4 sm:col-span-1">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Projected Month End</p>
          {projected !== null ? (
            <>
              <p className="num text-2xl font-bold" style={{ color: plColor(projected) }}>
                {fmt(projected)}
              </p>
              <p className="text-xs text-muted mt-1.5">
                {projected >= MONTHLY_TARGET
                  ? '🎯 On pace to hit goal'
                  : `${fmt(MONTHLY_TARGET - projected)} short at current pace`}
              </p>
            </>
          ) : (
            <p className="text-muted text-sm">Log sessions to project</p>
          )}
        </div>
        {best && (
          <MetricCard
            label="Best Day"
            value={fmt(combinedPL(best))}
            sub={formatShortDate(best.date)}
            color="#00e5a0"
          />
        )}
        {worst && (
          <MetricCard
            label="Worst Day"
            value={fmt(combinedPL(worst))}
            sub={formatShortDate(worst.date)}
            color="#ff3d6e"
          />
        )}
      </div>

      <PLChart entries={sorted} />
      <HeatMap entries={month} yearMonth={ym} />

      {month.length === 0 && (
        <div className="card p-10 text-center text-muted text-sm">
          No entries this month yet.
        </div>
      )}
    </div>
  )
}

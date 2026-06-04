import React from 'react'
import { combinedPL, fmt, plColor, formatShortDate } from '../utils'
import MetricCard from '../components/MetricCard'

function BetaCard({ user }) {
  const color = plColor(user.totalPL)
  return (
    <div className="card card-hover p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-txt text-sm">{user.name}</p>
              <p className="text-[10px] text-muted">
                {user.dayCount} {user.dayCount === 1 ? 'day' : 'days'} logged
              </p>
            </div>
          </div>
          {user.latestFeedback && (
            <p className="text-xs text-muted italic mt-2 ml-10">"{user.latestFeedback}"</p>
          )}
        </div>
        <div className="text-right">
          <p className="num font-bold text-sm" style={{ color }}>{fmt(user.totalPL)}</p>
          <p className="text-[10px] text-muted mt-0.5">avg {fmt(user.avgPL)}/day</p>
          <p
            className="text-[10px] font-semibold mt-1"
            style={{ color: user.profitablePct >= 50 ? '#00e5a0' : '#ff3d6e' }}
          >
            {user.profitablePct}% profitable
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BetaUsers({ entries }) {
  const userMap = {}
  entries.forEach(entry => {
    ;(entry.betaUsers || []).forEach(u => {
      if (!u.name) return
      if (!userMap[u.name]) userMap[u.name] = { totalPL: 0, dayCount: 0, profitable: 0, feedback: '' }
      userMap[u.name].totalPL   += Number(u.pl) || 0
      userMap[u.name].dayCount  += 1
      userMap[u.name].profitable += (Number(u.pl) || 0) > 0 ? 1 : 0
      if (u.feedback) userMap[u.name].feedback = u.feedback
    })
  })

  const users = Object.entries(userMap)
    .map(([name, s]) => ({
      name,
      totalPL:       s.totalPL,
      dayCount:      s.dayCount,
      avgPL:         s.dayCount ? Math.round(s.totalPL / s.dayCount) : 0,
      profitablePct: s.dayCount ? Math.round(s.profitable / s.dayCount * 100) : 0,
      latestFeedback: s.feedback,
    }))
    .sort((a, b) => b.totalPL - a.totalPL)

  const activeCount     = users.length
  const profitableCount = users.filter(u => u.totalPL > 0).length
  const profitabilityPct = activeCount ? Math.round(profitableCount / activeCount * 100) : 0
  const totalBetaPL     = users.reduce((s, u) => s + u.totalPL, 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-txt">Beta Users</h1>
        <p className="text-xs text-muted mt-0.5">Logged via the Today tab on each session</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Active Users"   value={activeCount} />
        <MetricCard label="Profitable"     value={profitableCount} color="#00e5a0" />
        <MetricCard label="Profitability"  value={`${profitabilityPct}%`}
          color={profitabilityPct >= 50 ? '#00e5a0' : '#ff3d6e'} />
        <MetricCard label="Total Beta P/L" value={fmt(totalBetaPL)} color={plColor(totalBetaPL)} />
      </div>

      {users.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
            User Performance (all time)
          </p>
          {users.map(u => <BetaCard key={u.name} user={u} />)}
        </div>
      ) : (
        <div className="card p-10 text-center text-muted text-sm">
          No beta users logged yet.<br />
          <span className="text-[11px] opacity-60">Add them in the Today tab when saving a session.</span>
        </div>
      )}
    </div>
  )
}

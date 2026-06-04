import React from 'react'
import { formatDate } from '../utils'
import MetricCard from '../components/MetricCard'

export default function Community({ entries }) {
  const sessions = [...entries]
    .filter(e => (Number(e.communityAttendance) || 0) > 0 || e.communityNotes)
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalAttendees = sessions.reduce((s, e) => s + (Number(e.communityAttendance) || 0), 0)
  const avgAttendance  = sessions.length ? (totalAttendees / sessions.length).toFixed(1) : '—'
  const maxSession     = sessions.length
    ? sessions.reduce((m, e) => (Number(e.communityAttendance) > Number(m.communityAttendance) ? e : m))
    : null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-txt">Community</h1>
        <p className="text-xs text-muted mt-0.5">Sunday brainstorm session tracking</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Sessions"        value={sessions.length} />
        <MetricCard label="Total Attended"  value={totalAttendees}  color="#00e5a0" />
        <MetricCard label="Avg per Session" value={avgAttendance} />
      </div>

      {maxSession && (
        <div className="card p-4 border-green/20" style={{ borderColor: 'rgba(0,229,160,0.15)' }}>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Best Turnout</p>
          <p className="text-sm font-semibold text-txt">{formatDate(maxSession.date)}</p>
          <p className="text-xs text-green font-bold">{maxSession.communityAttendance} people</p>
          {maxSession.communityNotes && (
            <p className="text-xs text-muted mt-1.5 italic">"{maxSession.communityNotes}"</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {sessions.map(e => (
          <div key={e.date} className="card card-hover p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-txt">{formatDate(e.date)}</p>
                {e.communityNotes && (
                  <p className="text-xs text-muted mt-1.5 italic max-w-xs">{e.communityNotes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <div className="bg-green/10 border border-green/20 rounded-lg px-3 py-1.5 text-center">
                  <p className="num font-bold text-green text-sm">{e.communityAttendance || 0}</p>
                  <p className="text-[9px] text-muted">attended</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="card p-10 text-center text-muted text-sm">
          No community sessions logged yet.<br />
          <span className="text-[11px] opacity-60">Fill in Sunday attendance when saving a day.</span>
        </div>
      )}
    </div>
  )
}

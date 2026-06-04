import React from 'react'
import { daysUntil, formatDateShort, formatDate, CATEGORIES } from '../utils'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'

export default function Overview({ projects, pipeline, growth, setPage }) {
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const active    = projects.filter(p => p.status === 'active')
  const overdue   = projects.filter(p => p.deadline && daysUntil(p.deadline) < 0 && p.status !== 'done')
  const thisWeek  = projects.filter(p => {
    const d = daysUntil(p.deadline)
    return d !== null && d >= 0 && d <= 7 && p.status !== 'done'
  })
  const donePct   = projects.length ? Math.round((projects.filter(p => p.status === 'done').length / projects.length) * 100) : 0

  const latestGrowth = [...growth].sort((a, b) => b.date.localeCompare(a.date))[0] || null
  const prevGrowth   = [...growth].sort((a, b) => b.date.localeCompare(a.date))[1] || null

  function delta(field) {
    if (!latestGrowth || !prevGrowth) return null
    return latestGrowth[field] - prevGrowth[field]
  }

  const inProgress = pipeline.filter(p => ['scripted','recording','editing'].includes(p.status))

  // Upcoming deadlines
  const upcoming = [...projects]
    .filter(p => p.deadline && p.status !== 'done')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-xs text-muted">{dayName}</p>
        <h1 className="text-xl font-bold text-txt">{dateStr}</h1>
        <p className="text-xs text-muted mt-0.5">Sin Miedo Capital · Operations</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Active Projects"
          value={active.length}
          color="#3d8ef0"
          sub={`${projects.length} total`}
          onClick={() => setPage('projects')}
        />
        <MetricCard
          label="Due This Week"
          value={thisWeek.length}
          color={thisWeek.length > 0 ? '#ffb020' : '#4a5a7a'}
          sub={thisWeek.length > 0 ? thisWeek[0].title : 'Nothing due'}
        />
        <MetricCard
          label="Overdue"
          value={overdue.length}
          color={overdue.length > 0 ? '#ff3d6e' : '#00e5a0'}
          sub={overdue.length === 0 ? 'All on track' : 'Needs attention'}
        />
        <MetricCard
          label="Completed"
          value={`${donePct}%`}
          color="#00e5a0"
          sub={`${projects.filter(p => p.status === 'done').length} done`}
        />
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="card border-red/20 bg-red/5 p-4 flex items-start gap-3">
          <span className="text-red text-lg leading-none">⚠</span>
          <div>
            <p className="text-sm font-semibold text-red">
              {overdue.length} overdue project{overdue.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {overdue.map(p => p.title).join(', ')}
            </p>
          </div>
          <button onClick={() => setPage('projects')} className="ml-auto text-xs text-red hover:underline">View →</button>
        </div>
      )}

      {/* Upcoming deadlines */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Upcoming Deadlines</p>
          <div className="card divide-y divide-border overflow-hidden">
            {upcoming.map(p => {
              const days = daysUntil(p.deadline)
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-txt truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge category={p.category} />
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold" style={{ color: days <= 0 ? '#ff3d6e' : days <= 3 ? '#ffb020' : '#4a5a7a' }}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`}
                    </p>
                    <p className="text-[10px] text-muted">{formatDateShort(p.deadline)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content in progress */}
      {inProgress.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Content in Progress</p>
            <button onClick={() => setPage('pipeline')} className="text-[10px] text-blue hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {inProgress.slice(0, 3).map(item => (
              <div key={item.id} className="card p-3 flex items-center gap-3">
                <ContentTypeIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-txt truncate">{item.title}</p>
                  <p className="text-[10px] text-muted">{item.type}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth snapshot */}
      {latestGrowth && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Latest Growth ({formatDateShort(latestGrowth.date)})</p>
            <button onClick={() => setPage('growth')} className="text-[10px] text-blue hover:underline">Track →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GrowthMini label="Community" value={latestGrowth.communityMembers} delta={delta('communityMembers')} />
            <GrowthMini label="Discord" value={latestGrowth.discordMembers} delta={delta('discordMembers')} />
            <GrowthMini label="YouTube" value={latestGrowth.youtubeSubscribers} delta={delta('youtubeSubscribers')} />
            <GrowthMini label="Revenue" value={`$${latestGrowth.monthlyRevenue.toLocaleString()}`} delta={delta('monthlyRevenue')} isMoney />
          </div>
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="card p-10 text-center text-muted text-sm">
          Welcome to SMC Ops!<br />
          <button onClick={() => setPage('projects')} className="text-blue hover:underline mt-2 block mx-auto">
            Create your first project →
          </button>
        </div>
      )}
    </div>
  )
}

function GrowthMini({ label, value, delta, isMoney = false }) {
  const pos = delta === null ? null : delta >= 0
  return (
    <div className="card p-3">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      <p className="num text-xl font-bold text-txt mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {delta !== null && delta !== 0 && (
        <p className="text-[10px] mt-0.5" style={{ color: pos ? '#00e5a0' : '#ff3d6e' }}>
          {pos ? '+' : ''}{isMoney ? '$' : ''}{delta.toLocaleString()}
        </p>
      )}
    </div>
  )
}

function ContentTypeIcon({ type }) {
  const icons = {
    YouTube: '▶', Short: '⚡', Instagram: '◈', Twitter: '✦',
    Blog: '✍', Course: '🎓', Other: '◦',
  }
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-surf2 text-sm flex-shrink-0">
      {icons[type] || '◦'}
    </div>
  )
}

import React from 'react'
import { fmt, plColor } from '../utils'

const NAV = [
  { id: 'today',     label: 'Today',      icon: TodayIcon },
  { id: 'week',      label: 'This Week',  icon: WeekIcon },
  { id: 'month',     label: 'This Month', icon: MonthIcon },
  { id: 'beta',      label: 'Beta Users', icon: BetaIcon },
  { id: 'community', label: 'Community',  icon: CommIcon },
  { id: 'export',    label: 'Export',     icon: ExportIcon },
]

function TodayIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="3" width="12" height="12" rx="2" />
      <path d="M5 1v3M11 1v3M2 7h12" />
      <circle cx="8" cy="11" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WeekIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 12 L5 8 L8 10 L11 5 L14 7" />
      <path d="M2 14h12" />
    </svg>
  )
}

function MonthIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 8 L8 3" />
      <path d="M8 8 L11.5 10" />
    </svg>
  )
}

function BetaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 14c0-3 2.2-5 5-5" />
      <circle cx="12" cy="6" r="2" />
      <path d="M10 14c0-2.5 1.5-4 4-4" />
    </svg>
  )
}

function CommIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 9a2 2 0 0 1-2 2H5l-3 3V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ExportIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 2v8M5 7l3 3 3-3" />
      <path d="M3 11v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" />
    </svg>
  )
}

export default function Sidebar({ activePage, onNavigate, monthTotal, pct }) {
  const color = plColor(monthTotal)

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden sm:flex flex-col w-[220px] flex-shrink-0 border-r border-border bg-[#080c14]">
        {/* Brand + month summary */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2L12 11H2L7 2Z" fill="#00e5a0" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-txt tracking-tight leading-none">Sin Miedo Capital</p>
              <p className="text-[10px] text-muted mt-0.5">P/L Tracker</p>
            </div>
          </div>

          <div className="bg-surf rounded-xl p-3 border border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Month Total</p>
            <p className="num text-lg font-bold leading-none" style={{ color }}>
              {fmt(monthTotal)}
            </p>
            <div className="mt-2.5 h-1.5 bg-surf2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: monthTotal >= 0 ? '#00e5a0' : '#ff3d6e',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
            <p className="text-[10px] text-muted mt-1.5">{pct.toFixed(1)}% of $50k goal</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => {
            const Icon    = n.icon
            const isActive = activePage === n.id
            return (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-green/10 text-green border border-green/20'
                    : 'text-muted hover:text-txt hover:bg-surf'
                }`}
              >
                <Icon size={15} />
                {n.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-[10px] text-[#1e2d45]">All data stored locally</p>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-[#080c14] border-t border-border flex z-50 safe-area-pb">
        {NAV.map(n => {
          const Icon    = n.icon
          const isActive = activePage === n.id
          return (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                isActive ? 'text-green' : 'text-muted'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-semibold tracking-wide">
                {n.label.split(' ')[0].toUpperCase()}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

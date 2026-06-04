import React from 'react'

const NAV = [
  { id: 'overview',  label: 'Overview',  icon: IconOverview  },
  { id: 'projects',  label: 'Projects',  icon: IconProjects  },
  { id: 'pipeline',  label: 'Pipeline',  icon: IconPipeline  },
  { id: 'growth',    label: 'Growth',    icon: IconGrowth    },
]

export default function Sidebar({ page, setPage }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col fixed left-0 top-0 h-full w-56 bg-surf border-r border-border z-40 py-6 px-3">
        <div className="px-3 mb-8">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Sin Miedo Capital</p>
          <p className="text-xs font-bold text-txt mt-0.5">Operations</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                page === id
                  ? 'bg-blue/10 text-blue border border-blue/20'
                  : 'text-muted hover:text-txt hover:bg-surf2'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 mt-4">
          <p className="text-[10px] text-muted/50">© {new Date().getFullYear()} SMC</p>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-surf border-t border-border z-40 flex">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium transition-colors ${
              page === id ? 'text-blue' : 'text-muted'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}

function IconOverview({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  )
}

function IconProjects({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M5 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M5 8h6M5 11h4" strokeLinecap="round" />
    </svg>
  )
}

function IconPipeline({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h3v8H2zM6.5 4h3v8h-3zM11 4h3v8h-3z" rx="1" />
    </svg>
  )
}

function IconGrowth({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="2,12 6,7 9,9 14,3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="11,3 14,3 14,6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

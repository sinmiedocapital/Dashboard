import React from 'react'
import { combinedPL, daysInMonth, fmt } from '../utils'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function cellStyle(entry, maxAbs) {
  if (!entry) return { bg: '#162032', text: '#2a3a55', glow: false }
  const pl  = combinedPL(entry)
  const pct = Math.min(1, Math.abs(pl) / (maxAbs || 1))
  if (pl > 0) {
    const alpha = 0.2 + pct * 0.8
    return { bg: `rgba(0,229,160,${alpha})`, text: pct > 0.5 ? '#080c14' : '#ccd6f6', glow: pct > 0.7 }
  }
  const alpha = 0.2 + pct * 0.8
  return { bg: `rgba(255,61,110,${alpha})`, text: pct > 0.5 ? '#080c14' : '#ccd6f6', glow: false }
}

export default function HeatMap({ entries, yearMonth }) {
  const [y, m]  = yearMonth.split('-').map(Number)
  const days     = daysInMonth(yearMonth)
  const today    = new Date().toISOString().slice(0, 10)
  const entryMap = {}
  entries.forEach(e => { entryMap[e.date] = e })

  const maxAbs = Math.max(1, ...entries.map(e => Math.abs(combinedPL(e))))

  // Day-of-week offset for month start (Mon = 0)
  const startDow = (new Date(y, m - 1, 1).getDay() + 6) % 7

  return (
    <div className="card p-4">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">P/L Heatmap</p>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW.map((d, i) => (
          <div key={i} className="text-center text-[9px] text-muted font-semibold">{d}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}

        {Array.from({ length: days }, (_, i) => i + 1).map(d => {
          const dateStr = `${yearMonth}-${String(d).padStart(2, '0')}`
          const entry   = entryMap[dateStr]
          const style   = cellStyle(entry, maxAbs)
          const isToday = dateStr === today
          const pl      = entry ? combinedPL(entry) : null

          return (
            <div
              key={d}
              title={pl !== null ? `${dateStr}: ${fmt(pl)}` : dateStr}
              className="aspect-square rounded-md flex items-center justify-center transition-transform hover:scale-110 cursor-default"
              style={{
                backgroundColor: style.bg,
                boxShadow: style.glow ? '0 0 8px rgba(0,229,160,0.4)' : undefined,
                outline: isToday ? '2px solid #00e5a0' : undefined,
                outlineOffset: '1px',
              }}
            >
              <span className="text-[9px] font-bold" style={{ color: style.text }}>{d}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#ff3d6e]/50" />
          <span className="text-[9px] text-muted">Loss</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#162032' }} />
          <span className="text-[9px] text-muted">No data</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#00e5a0]/50" />
          <span className="text-[9px] text-muted">Gain</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm ring-1 ring-green" />
          <span className="text-[9px] text-muted">Today</span>
        </div>
      </div>
    </div>
  )
}

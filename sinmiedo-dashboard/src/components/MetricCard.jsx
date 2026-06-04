import React from 'react'

export default function MetricCard({ label, value, sub, color, mono = true, onClick }) {
  return (
    <div
      className={`card card-hover p-4 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">{label}</p>
      <p
        className={`font-bold text-2xl leading-none ${mono ? 'num' : ''}`}
        style={{ color: color || '#ccd6f6' }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted mt-1.5">{sub}</p>}
    </div>
  )
}

import React from 'react'

export default function MetricCard({ label, value, sub, color = '#ccd6f6', onClick }) {
  return (
    <div
      className={`card p-4 flex flex-col gap-1 ${onClick ? 'card-hover' : ''}`}
      onClick={onClick}
    >
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      <p className="num text-2xl font-bold leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

import React from 'react'
import { fmt } from '../utils'

export default function ProgressRing({ current, target, size = 160, stroke = 10 }) {
  const radius = (size - stroke) / 2
  const circ   = 2 * Math.PI * radius
  const pct    = Math.min(100, Math.max(0, (current / target) * 100))
  const offset = circ - (pct / 100) * circ
  const color  = current >= 0 ? '#00e5a0' : '#ff3d6e'
  const remaining = target - current

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e2d45"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease',
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="num text-2xl font-bold leading-none" style={{ color }}>
            {fmt(current)}
          </p>
          <p className="text-[10px] text-muted mt-1.5">of {fmt(target)}</p>
          <p className="num text-sm font-semibold mt-0.5" style={{ color: '#ffb020' }}>
            {pct.toFixed(0)}%
          </p>
        </div>
      </div>

      {remaining > 0 && (
        <p className="text-xs text-muted text-center">
          <span className="num text-amber font-semibold">{fmt(remaining)}</span> remaining
        </p>
      )}
      {remaining <= 0 && (
        <p className="text-sm text-green font-bold text-center">🎯 Goal Reached!</p>
      )}
    </div>
  )
}

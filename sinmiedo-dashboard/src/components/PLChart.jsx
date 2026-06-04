import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { combinedPL, DAILY_TARGET, fmt } from '../utils'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const pl = payload[0]?.value ?? 0
  const color = pl >= 0 ? '#00e5a0' : '#ff3d6e'
  return (
    <div className="bg-surf2 border border-border rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-[10px] text-muted mb-1">{label}</p>
      <p className="num font-bold text-sm" style={{ color }}>{fmt(pl)}</p>
    </div>
  )
}

export default function PLChart({ entries }) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const data   = sorted.map(e => ({ date: e.date.slice(5), pl: combinedPL(e) }))

  if (!data.length) {
    return (
      <div className="card flex items-center justify-center h-48 text-muted text-sm">
        Save entries to see your chart
      </div>
    )
  }

  const max    = Math.max(...data.map(d => d.pl), 0)
  const min    = Math.min(...data.map(d => d.pl), 0)
  const range  = max - min || 1
  const zeroAt = max / range

  return (
    <div className="card p-4">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-4">Daily P/L</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset={zeroAt} stopColor="#00e5a0" stopOpacity={0.18} />
              <stop offset={zeroAt} stopColor="#ff3d6e" stopOpacity={0.18} />
            </linearGradient>
            <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={zeroAt} stopColor="#00e5a0" />
              <stop offset={zeroAt} stopColor="#ff3d6e" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#4a5a7a', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#4a5a7a', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v >= 1000 || v <= -1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a3d5a', strokeWidth: 1 }} />
          <ReferenceLine y={0} stroke="#2a3d5a" strokeWidth={1} />
          <ReferenceLine
            y={DAILY_TARGET}
            stroke="#ffb020"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{ value: 'Target', position: 'right', fill: '#ffb020', fontSize: 9, fontFamily: 'monospace' }}
          />
          <Area
            type="monotone"
            dataKey="pl"
            stroke="url(#lineColor)"
            strokeWidth={2}
            fill="url(#areaFill)"
            dot={{ fill: '#00e5a0', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#00e5a0', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

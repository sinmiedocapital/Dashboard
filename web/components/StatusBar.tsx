'use client'
import type { Signal } from '@/lib/types'

type Status = {
  label: string
  sublabel: string
  color: string
  bg: string
  dot: string
}

function getStatus(signals: Signal[]): Status {
  const recent = signals.find(s => s.action === 'buy' || s.action === 'sell')

  if (!recent) {
    return {
      label: 'WAITING FOR SIGNAL',
      sublabel: 'No signals yet. Stand by — the system will fire when conditions align.',
      color: '#ffd700',
      bg: '#ffd70011',
      dot: '#ffd700',
    }
  }

  const ageMs = Date.now() - new Date(recent.created_at).getTime()
  const ageHours = ageMs / (1000 * 60 * 60)

  if (ageHours > 4) {
    return {
      label: 'WAITING FOR SIGNAL',
      sublabel: 'No recent activity. The system is watching — wait for the next alert.',
      color: '#ffd700',
      bg: '#ffd70011',
      dot: '#ffd700',
    }
  }

  if (recent.action === 'buy') {
    return {
      label: 'LONG BIAS',
      sublabel: 'The system is bullish. Only look for buying opportunities right now.',
      color: '#00c076',
      bg: '#00c07611',
      dot: '#00c076',
    }
  }

  return {
    label: 'SHORT BIAS',
    sublabel: 'The system is bearish. Only look for selling opportunities right now.',
    color: '#ff3b5c',
    bg: '#ff3b5c11',
    dot: '#ff3b5c',
  }
}

export default function StatusBar({ signals }: { signals: Signal[] }) {
  const status = getStatus(signals)

  return (
    <div
      className="rounded-lg p-4 mb-4 flex items-center gap-4"
      style={{ backgroundColor: status.bg, border: `1px solid ${status.color}33` }}
    >
      {/* Pulsing dot */}
      <div className="relative shrink-0">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: status.dot }}
        />
        <div
          className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: status.dot }}
        />
      </div>

      {/* Text */}
      <div>
        <div className="font-bold text-base" style={{ color: status.color }}>
          {status.label}
        </div>
        <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
          {status.sublabel}
        </div>
      </div>
    </div>
  )
}

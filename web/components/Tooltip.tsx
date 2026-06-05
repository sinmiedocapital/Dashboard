'use client'
import { useState, useRef, useEffect } from 'react'

export default function Tooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <span ref={ref} className="relative inline-flex items-center gap-1">
      <span
        className="text-xs px-1.5 py-0.5 rounded cursor-pointer"
        style={{ backgroundColor: '#0d1117', color: '#94a3b8' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
      >
        {label}
      </span>
      <button
        type="button"
        className="text-xs w-4 h-4 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
        style={{ backgroundColor: '#2a2a3e', color: '#64748b' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        aria-label={`Explain ${label}`}
      >
        ?
      </button>
      {open && (
        <span
          className="absolute z-50 bottom-full left-0 mb-2 w-64 rounded-lg p-3 text-xs leading-relaxed shadow-xl"
          style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #2a2a3e',
            color: '#cbd5e1',
          }}
        >
          <span className="font-semibold text-white block mb-1">{label}</span>
          {text}
        </span>
      )}
    </span>
  )
}

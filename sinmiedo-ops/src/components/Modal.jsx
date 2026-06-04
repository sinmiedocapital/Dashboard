import React, { useEffect } from 'react'

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`card w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-txt">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-txt hover:bg-surf2 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

export function Input({ ...props }) {
  return (
    <input
      className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt placeholder-muted focus:outline-none focus:border-blue/40 transition-colors"
      {...props}
    />
  )
}

export function Textarea({ ...props }) {
  return (
    <textarea
      rows={3}
      className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt placeholder-muted focus:outline-none focus:border-blue/40 transition-colors resize-none"
      {...props}
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt focus:outline-none focus:border-blue/40 transition-colors"
      {...props}
    >
      {children}
    </select>
  )
}

export function Btn({ variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150'
  const variants = {
    primary:  'bg-blue text-white hover:bg-blue/90',
    ghost:    'border border-border text-muted hover:border-blue/30 hover:text-txt',
    danger:   'border border-red/30 text-red hover:bg-red/10',
    green:    'bg-green text-bg hover:bg-green/90',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

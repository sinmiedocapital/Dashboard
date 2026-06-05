import React, { useState, useRef, useEffect } from 'react'
import { saveProfile } from '../utils'

export default function Welcome({ onJoin }) {
  const [name, setName]     = useState('')
  const [ready, setReady]   = useState(false)
  const inputRef            = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    const profile = { name: trimmed, joinedAt: new Date().toISOString() }
    saveProfile(profile)
    setReady(true)
    setTimeout(() => onJoin(profile), 400)
  }

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center px-6 z-50">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 70%)' }}
      />

      <div className={`w-full max-w-sm relative transition-all duration-400 ${ready ? 'opacity-0 translate-y-2' : 'opacity-100'}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4L26 22H2L14 4Z" fill="#00e5a0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-txt tracking-tight">Sin Miedo Capital</h1>
          <p className="text-sm text-muted mt-1">Trading Dashboard</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted/60">
            <span className="w-8 h-px bg-border" />
            Track. Analyze. Grow.
            <span className="w-8 h-px bg-border" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              What should we call you?
            </label>
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name…"
              maxLength={40}
              className="w-full bg-surf border border-border rounded-2xl px-4 py-3.5 text-base text-txt placeholder-muted/40 focus:outline-none focus:border-green/40 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 bg-green text-bg hover:bg-green/90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {ready ? 'Welcome…' : 'Enter the Dashboard →'}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-[11px] text-muted/40 mt-6">
          Your data stays on this device · Bookmark to save your spot
        </p>
      </div>
    </div>
  )
}

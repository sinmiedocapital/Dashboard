'use client'
import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="text-sm font-semibold mb-1" style={{ color: '#00c076' }}>
          You're on the list.
        </div>
        <div className="text-xs text-slate-500">
          We'll reach out when paid access opens.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2a2a3e',
          // @ts-expect-error css var
          '--tw-ring-color': '#00c076',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-3 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-80 shrink-0"
        style={{ backgroundColor: '#00c076', opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? 'Joining…' : 'Join Waitlist'}
      </button>
      {status === 'error' && (
        <p className="text-xs w-full text-center mt-1" style={{ color: '#ff3b5c' }}>
          Something went wrong — try again.
        </p>
      )}
    </form>
  )
}

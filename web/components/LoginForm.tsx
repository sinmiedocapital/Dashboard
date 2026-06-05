'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setError('Incorrect password. Check with your community admin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d1117' }}>
      <div className="w-full max-w-sm p-8 rounded-xl" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}>
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-white mb-1">SMC Venice v9</div>
          <div className="text-sm text-slate-400">Sin Miedo Capital · Members Only</div>
        </div>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Enter access code"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-white text-sm mb-3 outline-none focus:ring-2"
            style={{
              backgroundColor: '#0d1117',
              border: '1px solid #2a2a3e',
              // @ts-expect-error css var
              '--tw-ring-color': '#00c076',
            }}
          />
          {error && <div className="text-sm mb-3" style={{ color: '#ff3b5c' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-opacity"
            style={{ backgroundColor: '#00c076', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Checking…' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

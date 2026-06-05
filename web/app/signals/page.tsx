import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import SignalCard from '@/components/SignalCard'
import WinRateBar from '@/components/WinRateBar'
import StatusBar from '@/components/StatusBar'
import LoginForm from '@/components/LoginForm'
import type { Signal } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SignalsPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('smc_auth')

  if (!auth) return <LoginForm />

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .in('action', ['buy', 'sell'])
    .order('created_at', { ascending: false })
    .limit(50)

  const list = (signals ?? []) as Signal[]

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#0d1117' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Signal Dashboard</h1>
            <p className="text-sm text-slate-400">SMC Venice v9 · Sin Miedo Capital</p>
          </div>
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to home
          </a>
        </div>

        {/* Traffic light */}
        <StatusBar signals={list} />

        {/* Win rate */}
        <WinRateBar signals={list} />

        {/* Signals */}
        {list.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">📡</div>
            <div className="text-sm">Waiting for signals…</div>
            <div className="text-xs mt-1 text-slate-600">
              Signals appear here the moment TradingView fires an alert.
            </div>
          </div>
        ) : (
          list.map(s => <SignalCard key={s.id} signal={s} />)
        )}
      </div>
    </div>
  )
}

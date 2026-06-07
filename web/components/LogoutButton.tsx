'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
    >
      Sign out
    </button>
  )
}

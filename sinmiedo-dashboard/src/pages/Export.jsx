import React from 'react'
import { combinedPL, winRate, todayISO } from '../utils'

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function Export({ entries }) {
  const [flash, setFlash] = React.useState('')

  function flash2(id) {
    setFlash(id)
    setTimeout(() => setFlash(''), 2000)
  }

  function exportJSON() {
    download(JSON.stringify(entries, null, 2), `smc-pl-${todayISO()}.json`, 'application/json')
    flash2('json')
  }

  function exportCSV() {
    const headers = [
      'date','lucidPL','tradeifyPL','combinedPL',
      'totalTrades','winningTrades','winRate',
      'mindset','notes','communityAttendance','communityNotes',
      'betaUserCount','betaUserNames','betaUserPLs',
    ]
    const esc = s => `"${String(s || '').replace(/"/g, '""')}"`
    const rows = [...entries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => [
        e.date,
        e.lucidPL,
        e.tradeifyPL,
        combinedPL(e),
        e.totalTrades,
        e.winningTrades,
        (winRate(e) ?? 0).toFixed(1),
        e.mindset || '',
        esc(e.notes),
        e.communityAttendance,
        esc(e.communityNotes),
        (e.betaUsers || []).length,
        esc((e.betaUsers || []).map(u => u.name).join('; ')),
        esc((e.betaUsers || []).map(u => u.pl).join('; ')),
      ].join(','))

    download([headers.join(','), ...rows].join('\n'), `smc-pl-${todayISO()}.csv`, 'text/csv')
    flash2('csv')
  }

  function clearAll() {
    if (!window.confirm('Delete ALL saved data? This cannot be undone.')) return
    try { localStorage.clear() } catch {}
    window.location.reload()
  }

  const sorted  = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const totalPL = entries.reduce((s, e) => s + combinedPL(e), 0)

  const btnBase = "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150"

  return (
    <div className="space-y-5 max-w-sm">
      <div>
        <h1 className="text-xl font-bold text-txt">Export</h1>
        <p className="text-xs text-muted mt-0.5">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in local storage
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={exportJSON}
          className={`${btnBase} card border-border hover:border-green/30 hover:bg-green/5`}
        >
          <span className="text-txt">Download JSON</span>
          <span className="num text-xs text-muted">{flash === 'json' ? '✓ Downloaded' : '.json'}</span>
        </button>

        <button
          onClick={exportCSV}
          className={`${btnBase} card border-border hover:border-green/30 hover:bg-green/5`}
        >
          <span className="text-txt">Download CSV</span>
          <span className="num text-xs text-muted">{flash === 'csv' ? '✓ Downloaded' : '.csv'}</span>
        </button>
      </div>

      {/* Recent entries preview */}
      {sorted.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">
            Recent Entries Preview
          </p>
          <div className="card divide-y divide-border overflow-hidden">
            {sorted.map(e => {
              const pl  = combinedPL(e)
              const pos = pl >= 0
              return (
                <div key={e.date} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted">{e.date}</span>
                  <span
                    className="num text-xs font-bold"
                    style={{ color: pos ? '#00e5a0' : '#ff3d6e' }}
                  >
                    {pos ? '+' : ''}{pl.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="pt-4 border-t border-border space-y-2">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Danger Zone</p>
        <button
          onClick={clearAll}
          className={`${btnBase} border border-red/20 hover:border-red/50 hover:bg-red/5 text-red`}
        >
          <span>Clear All Data</span>
          <span className="text-[10px] opacity-60">Permanent</span>
        </button>
      </div>
    </div>
  )
}

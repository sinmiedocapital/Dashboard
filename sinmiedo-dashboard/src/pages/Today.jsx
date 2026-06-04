import React from 'react'
import {
  todayISO, makeEmpty, combinedPL, winRate,
  fmt, fmtSign, plColor, DAILY_TARGET, formatDate,
} from '../utils'

const MINDSET = ['', '😰', '😟', '😐', '😊', '🔥']

function LiveStrip({ lucid, tradeify, totalT, winT }) {
  const total   = (Number(lucid) || 0) + (Number(tradeify) || 0)
  const wr      = Number(totalT) > 0 ? ((Number(winT) || 0) / Number(totalT) * 100) : null
  const toGoal  = DAILY_TARGET - total
  const hit     = total >= DAILY_TARGET

  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'Combined P/L', val: fmt(total),    color: plColor(total) },
        { label: 'Win Rate',     val: wr !== null ? `${wr.toFixed(0)}%` : '—',
          color: wr !== null ? (wr >= 50 ? '#00e5a0' : '#ff3d6e') : '#4a5a7a' },
        { label: 'vs Target',
          val: hit ? 'HIT ✓' : toGoal > 0 ? fmtSign(-toGoal) : '—',
          color: hit ? '#00e5a0' : total > 0 ? '#ffb020' : '#ff3d6e' },
      ].map(item => (
        <div key={item.label} className="card p-3 text-center">
          <p className="text-[9px] text-muted uppercase tracking-wider mb-1">{item.label}</p>
          <p className="num text-lg font-bold" style={{ color: item.color }}>{item.val}</p>
        </div>
      ))}
    </div>
  )
}

export default function Today({ entries, onSave }) {
  const today    = todayISO()
  const existing = entries.find(e => e.date === today) || makeEmpty(today)

  const [form,  setForm]  = React.useState(existing)
  const [saved, setSaved] = React.useState(!!existing.savedAt)

  React.useEffect(() => {
    const e = entries.find(e => e.date === today) || makeEmpty(today)
    setForm(e)
    setSaved(!!e.savedAt)
  }, [today, entries.length])

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  function setBeta(idx, field, value) {
    setForm(p => ({
      ...p,
      betaUsers: p.betaUsers.map((u, i) => i === idx ? { ...u, [field]: value } : u),
    }))
    setSaved(false)
  }

  function addBeta()      { set('betaUsers', [...form.betaUsers, { name: '', pl: '', feedback: '' }]) }
  function removeBeta(i)  { set('betaUsers', form.betaUsers.filter((_, j) => j !== i)) }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      lucidPL:             Number(form.lucidPL)             || 0,
      tradeifyPL:          Number(form.tradeifyPL)          || 0,
      totalTrades:         Number(form.totalTrades)         || 0,
      winningTrades:       Number(form.winningTrades)       || 0,
      communityAttendance: Number(form.communityAttendance) || 0,
      betaUsers:           form.betaUsers.map(u => ({ ...u, pl: Number(u.pl) || 0 })),
    })
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">Today</h1>
          <p className="text-xs text-muted mt-0.5">{formatDate(today)} · Daily target {fmt(DAILY_TARGET)}</p>
        </div>
        {saved && (
          <span className="text-[11px] bg-green/10 text-green border border-green/20 px-3 py-1.5 rounded-full font-semibold">
            ✓ Saved
          </span>
        )}
      </div>

      {/* Live preview */}
      <LiveStrip
        lucid={form.lucidPL}
        tradeify={form.tradeifyPL}
        totalT={form.totalTrades}
        winT={form.winningTrades}
      />

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* P/L */}
        <div className="card p-4 space-y-3">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Account P/L</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Lucid ($)</label>
              <input type="number" className="input" placeholder="0"
                value={form.lucidPL} onChange={e => set('lucidPL', e.target.value)} />
            </div>
            <div>
              <label className="label">Tradeify ($)</label>
              <input type="number" className="input" placeholder="0"
                value={form.tradeifyPL} onChange={e => set('tradeifyPL', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Trade stats */}
        <div className="card p-4 space-y-3">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Trade Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Total Trades</label>
              <input type="number" min="0" className="input" placeholder="0"
                value={form.totalTrades} onChange={e => set('totalTrades', e.target.value)} />
            </div>
            <div>
              <label className="label">Winning Trades</label>
              <input type="number" min="0" className="input" placeholder="0"
                value={form.winningTrades} onChange={e => set('winningTrades', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Mindset */}
        <div className="card p-4">
          <label className="label">Mindset Today</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => set('mindset', n)}
                className="flex-1 py-2.5 rounded-xl text-xl transition-all duration-150"
                style={{
                  backgroundColor: form.mindset === n ? 'rgba(0,229,160,0.12)' : '#080c14',
                  border:          form.mindset === n ? '1px solid rgba(0,229,160,0.35)' : '1px solid #1e2d45',
                  transform:       form.mindset === n ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {MINDSET[n]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="card p-4">
          <label className="label">Session Notes</label>
          <textarea
            className="input mt-1.5 resize-none"
            rows={3}
            placeholder="What worked? Key setups, mistakes, observations..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* Beta users */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
              Beta Users ({form.betaUsers.length})
            </p>
            <button
              type="button"
              onClick={addBeta}
              className="text-[11px] text-green border border-green/30 px-3 py-1 rounded-lg hover:bg-green/10 transition-colors font-medium"
            >
              + Add User
            </button>
          </div>

          {form.betaUsers.map((u, idx) => (
            <div key={idx} className="bg-[#080c14] border border-border rounded-xl p-3 space-y-2">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <input type="text" className="input" placeholder="Name"
                  value={u.name} onChange={e => setBeta(idx, 'name', e.target.value)} />
                <input type="number" className="input" placeholder="P/L $"
                  value={u.pl} onChange={e => setBeta(idx, 'pl', e.target.value)} />
                <button type="button" onClick={() => removeBeta(idx)}
                  className="text-red hover:text-white text-xl px-2 transition-colors leading-none">×</button>
              </div>
              <input type="text" className="input" placeholder="Feedback (optional)"
                value={u.feedback} onChange={e => setBeta(idx, 'feedback', e.target.value)} />
            </div>
          ))}
        </div>

        {/* Community */}
        <div className="card p-4 space-y-3">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Sunday Session</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Attendance</label>
              <input type="number" min="0" className="input" placeholder="0"
                value={form.communityAttendance} onChange={e => set('communityAttendance', e.target.value)} />
            </div>
            <div>
              <label className="label">Session Notes</label>
              <input type="text" className="input" placeholder="Topics, insights..."
                value={form.communityNotes} onChange={e => set('communityNotes', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold tracking-widest text-sm transition-all duration-200"
          style={{
            backgroundColor: saved ? '#059669' : '#00e5a0',
            color:           '#080c14',
            boxShadow:       saved ? 'none' : '0 0 20px rgba(0,229,160,0.2)',
          }}
        >
          {saved ? '✓ SESSION SAVED' : 'SAVE SESSION'}
        </button>
      </form>
    </div>
  )
}

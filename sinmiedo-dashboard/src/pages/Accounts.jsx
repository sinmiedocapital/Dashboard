import React, { useState } from 'react'
import { formatDate, fmt, plColor } from '../utils'

const PHASES = [
  { id: 'evaluation', label: 'Evaluation',  color: '#ffb020', bg: 'rgba(255,176,32,0.12)'  },
  { id: 'funded',     label: 'Funded',      color: '#00e5a0', bg: 'rgba(0,229,160,0.12)'   },
  { id: 'failed',     label: 'Failed',      color: '#ff3d6e', bg: 'rgba(255,61,110,0.1)'   },
  { id: 'withdrawn',  label: 'Withdrawn',   color: '#4a5a7a', bg: 'rgba(74,90,122,0.15)'   },
]

const SIZES = [10000, 25000, 50000, 100000, 150000, 200000]

const FIRMS = [
  'Tradeify', 'Apex Trader Funding', 'TopStep', 'Funded Futures Network',
  'Take Profit Trader', 'Bulenox', 'BluSky Trading', 'Other',
]

function PhaseBadge({ phase }) {
  const meta = PHASES.find(p => p.id === phase) || PHASES[0]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.label}
    </span>
  )
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function makeAccount(overrides = {}) {
  return {
    id:           newId(),
    firm:         'Tradeify',
    size:         50000,
    phase:        'evaluation',
    startDate:    new Date().toISOString().slice(0, 10),
    balance:      null,
    pnl:          null,
    maxDrawdown:  10,
    dailyLoss:    4,
    payouts:      [],
    notes:        '',
    ...overrides,
  }
}

export default function Accounts({ accounts, setAccounts }) {
  const [editing, setEditing]   = useState(null)
  const [isNew, setIsNew]       = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [addPayout, setAddPayout] = useState(null) // account id being paid out

  // ── Aggregate metrics ──
  const fundedAccounts  = accounts.filter(a => a.phase === 'funded')
  const evalAccounts    = accounts.filter(a => a.phase === 'evaluation')
  const failedAccounts  = accounts.filter(a => a.phase === 'failed')
  const totalCapital    = fundedAccounts.reduce((s, a) => s + a.size, 0)
  const totalPayouts    = accounts.reduce((s, a) => s + a.payouts.reduce((ps, p) => ps + p.amount, 0), 0)
  const attempted       = accounts.filter(a => a.phase !== 'evaluation').length
  const passed          = accounts.filter(a => a.phase === 'funded' || a.phase === 'withdrawn').length
  const passRate        = attempted > 0 ? Math.round((passed / attempted) * 100) : null

  // ── CRUD ──
  function openNew()         { setEditing(makeAccount()); setIsNew(true) }
  function openEdit(a)       { setEditing({ ...a, payouts: a.payouts.map(p => ({ ...p })) }); setIsNew(false) }
  function closeModal()      { setEditing(null); setIsNew(false) }

  function save() {
    if (!editing.firm.trim()) return
    const updated = { ...editing }
    if (isNew) setAccounts(prev => [updated, ...prev])
    else       setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
    closeModal()
  }

  function remove(id) {
    if (!window.confirm('Delete this account?')) return
    setAccounts(prev => prev.filter(a => a.id !== id))
    closeModal()
  }

  function updateField(field, val) {
    setEditing(a => ({ ...a, [field]: val }))
  }

  // ── Payouts ──
  const [payoutDate, setPayoutDate] = useState(new Date().toISOString().slice(0, 10))
  const [payoutAmt,  setPayoutAmt]  = useState('')

  function openAddPayout(accountId) {
    setAddPayout(accountId)
    setPayoutDate(new Date().toISOString().slice(0, 10))
    setPayoutAmt('')
  }

  function confirmAddPayout() {
    const amt = Number(payoutAmt)
    if (!amt || !payoutDate) return
    setAccounts(prev => prev.map(a => {
      if (a.id !== addPayout) return a
      return {
        ...a,
        payouts: [...a.payouts, { id: newId(), date: payoutDate, amount: amt }]
      }
    }))
    setAddPayout(null)
  }

  function removePayout(accountId, payoutId) {
    setAccounts(prev => prev.map(a => {
      if (a.id !== accountId) return a
      return { ...a, payouts: a.payouts.filter(p => p.id !== payoutId) }
    }))
  }

  const phaseOrder = { funded: 0, evaluation: 1, withdrawn: 2, failed: 3 }
  const sorted = [...accounts].sort((a, b) => (phaseOrder[a.phase] ?? 9) - (phaseOrder[b.phase] ?? 9))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">Prop Accounts</h1>
          <p className="text-xs text-muted mt-0.5">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-green text-bg px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green/90 transition-colors"
        >
          + Add Account
        </button>
      </div>

      {/* Summary metrics */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Funded Capital"    value={fmt(totalCapital)}   color="#00e5a0" sub={`${fundedAccounts.length} active`} />
          <MetricCard label="Total Payouts"     value={fmt(totalPayouts)}   color="#00e5a0" sub="using SMC system" />
          <MetricCard label="Active Evals"      value={evalAccounts.length} color="#ffb020" sub={evalAccounts.length > 0 ? evalAccounts[0].firm : '—'} />
          <MetricCard label="Pass Rate"
            value={passRate !== null ? `${passRate}%` : '—'}
            color={passRate !== null ? (passRate >= 50 ? '#00e5a0' : '#ff3d6e') : '#4a5a7a'}
            sub={attempted > 0 ? `${passed}/${attempted} passed` : 'No attempts yet'}
          />
        </div>
      )}

      {/* Account list */}
      {sorted.length === 0 && (
        <div className="card p-12 text-center text-muted text-sm">
          No accounts tracked yet.<br />
          <button onClick={openNew} className="text-green hover:underline mt-2 block mx-auto">
            Add your first prop account →
          </button>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(a => {
          const isOpen    = expanded === a.id
          const acctPayouts = a.payouts.reduce((s, p) => s + p.amount, 0)
          const plVal     = a.pnl !== null ? Number(a.pnl) : null

          return (
            <div key={a.id} className="card overflow-hidden">
              <div
                className="p-4 hover:bg-surf2/60 transition-colors cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : a.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-muted text-xs transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}>▶</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-txt">{a.firm}</p>
                      <PhaseBadge phase={a.phase} />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-muted num">{fmt(a.size)} account</span>
                      {a.phase === 'funded' && a.balance !== null && (
                        <span className="text-xs num" style={{ color: plColor(Number(a.balance) - a.size) }}>
                          Balance: {fmt(Number(a.balance))}
                        </span>
                      )}
                      {acctPayouts > 0 && (
                        <span className="text-xs text-green num">+{fmt(acctPayouts)} payouts</span>
                      )}
                      <span className="text-[10px] text-muted">Since {formatDate(a.startDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {plVal !== null && (
                      <span className="num text-sm font-bold" style={{ color: plColor(plVal) }}>
                        {plVal > 0 ? '+' : ''}{fmt(plVal)}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); openEdit(a) }}
                      className="text-muted hover:text-txt text-xs px-2 py-1 rounded-lg hover:bg-surf3 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-border bg-surf2/30 px-4 py-4 space-y-4">
                  {/* Risk params */}
                  <div className="flex gap-4 flex-wrap">
                    <RiskPill label="Max DD" value={`${a.maxDrawdown}%`} />
                    <RiskPill label="Daily Loss" value={`${a.dailyLoss}%`} />
                    {a.maxDrawdown > 0 && (
                      <RiskPill
                        label="DD Limit ($)"
                        value={fmt(Math.round(a.size * a.maxDrawdown / 100))}
                      />
                    )}
                  </div>

                  {a.notes && (
                    <p className="text-xs text-muted italic">{a.notes}</p>
                  )}

                  {/* Payouts */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                        Payouts ({a.payouts.length})
                      </p>
                      <button
                        onClick={() => openAddPayout(a.id)}
                        className="text-xs text-green hover:underline"
                      >
                        + Log payout
                      </button>
                    </div>

                    {a.payouts.length === 0 && (
                      <p className="text-xs text-muted/50">No payouts logged yet.</p>
                    )}

                    {[...a.payouts]
                      .sort((x, y) => y.date.localeCompare(x.date))
                      .map(p => (
                        <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 group">
                          <span className="text-xs text-muted">{formatDate(p.date)}</span>
                          <div className="flex items-center gap-3">
                            <span className="num text-sm font-bold text-green">+{fmt(p.amount)}</span>
                            <button
                              onClick={() => removePayout(a.id, p.id)}
                              className="text-muted/30 hover:text-red text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}

                    {a.payouts.length > 0 && (
                      <div className="flex justify-between pt-2 mt-1">
                        <span className="text-xs text-muted">Total</span>
                        <span className="num text-sm font-bold text-green">{fmt(acctPayouts)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Payout modal */}
      {addPayout && (
        <Overlay onClose={() => setAddPayout(null)}>
          <h3 className="font-bold text-txt mb-4">Log Payout</h3>
          <div className="space-y-3">
            <FormField label="Date">
              <FormInput type="date" value={payoutDate} onChange={e => setPayoutDate(e.target.value)} />
            </FormField>
            <FormField label="Amount ($)">
              <FormInput
                type="number"
                min="1"
                placeholder="e.g. 2500"
                value={payoutAmt}
                onChange={e => setPayoutAmt(e.target.value)}
                autoFocus
              />
            </FormField>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAddPayout(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted text-sm hover:text-txt transition-colors">Cancel</button>
              <button onClick={confirmAddPayout} className="flex-1 py-2.5 rounded-xl bg-green text-bg text-sm font-bold hover:bg-green/90 transition-colors">Save Payout</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Create/Edit Account modal */}
      {editing && (
        <Overlay onClose={closeModal} wide>
          <h3 className="font-bold text-txt mb-5">{isNew ? 'Add Account' : 'Edit Account'}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Firm">
                <select
                  value={editing.firm}
                  onChange={e => updateField('firm', e.target.value)}
                  className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt focus:outline-none focus:border-green/40"
                >
                  {FIRMS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </FormField>
              <FormField label="Account Size">
                <select
                  value={editing.size}
                  onChange={e => updateField('size', Number(e.target.value))}
                  className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt focus:outline-none focus:border-green/40"
                >
                  {SIZES.map(s => <option key={s} value={s}>${s.toLocaleString()}</option>)}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Phase">
                <select
                  value={editing.phase}
                  onChange={e => updateField('phase', e.target.value)}
                  className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt focus:outline-none focus:border-green/40"
                >
                  {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </FormField>
              <FormField label="Start Date">
                <FormInput
                  type="date"
                  value={editing.startDate}
                  onChange={e => updateField('startDate', e.target.value)}
                />
              </FormField>
            </div>

            {editing.phase === 'funded' && (
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Current Balance ($)">
                  <FormInput
                    type="number"
                    placeholder={`${editing.size}`}
                    value={editing.balance ?? ''}
                    onChange={e => updateField('balance', e.target.value ? Number(e.target.value) : null)}
                  />
                </FormField>
                <FormField label="Current P/L ($)">
                  <FormInput
                    type="number"
                    placeholder="0"
                    value={editing.pnl ?? ''}
                    onChange={e => updateField('pnl', e.target.value !== '' ? Number(e.target.value) : null)}
                  />
                </FormField>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Max Drawdown (%)">
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  value={editing.maxDrawdown}
                  onChange={e => updateField('maxDrawdown', Number(e.target.value))}
                />
              </FormField>
              <FormField label="Daily Loss Limit (%)">
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  value={editing.dailyLoss}
                  onChange={e => updateField('dailyLoss', Number(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Notes">
              <textarea
                rows={2}
                value={editing.notes}
                onChange={e => updateField('notes', e.target.value)}
                placeholder="Account notes, rules, reminders..."
                className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt placeholder-muted focus:outline-none focus:border-green/40 resize-none"
              />
            </FormField>

            <div className="flex items-center justify-between pt-2">
              <div>
                {!isNew && (
                  <button onClick={() => remove(editing.id)} className="text-sm text-red border border-red/20 hover:bg-red/10 px-3 py-2 rounded-xl transition-colors">
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={closeModal} className="text-sm text-muted border border-border hover:text-txt px-4 py-2 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={save} className="text-sm font-bold bg-green text-bg hover:bg-green/90 px-4 py-2 rounded-xl transition-colors">
                  {isNew ? 'Add Account' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

/* ── Shared sub-components ── */

function MetricCard({ label, value, sub, color = '#ccd6f6' }) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      <p className="num text-2xl font-bold leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function RiskPill({ label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-muted">{label}:</span>
      <span className="text-[10px] font-bold text-txt num">{value}</span>
    </div>
  )
}

function Overlay({ children, onClose, wide = false }) {
  React.useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`card w-full ${wide ? 'max-w-lg' : 'max-w-sm'} max-h-[90vh] overflow-y-auto p-5`}>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

function FormInput({ ...props }) {
  return (
    <input
      className="w-full bg-surf2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-txt placeholder-muted focus:outline-none focus:border-green/40 transition-colors"
      {...props}
    />
  )
}

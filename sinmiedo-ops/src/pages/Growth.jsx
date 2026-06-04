import React, { useState } from 'react'
import {
  makeGrowthSnapshot, formatDate, todayISO,
} from '../utils'
import MetricCard from '../components/MetricCard'
import Modal, { Field, Input, Textarea, Btn } from '../components/Modal'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

export default function Growth({ growth, setGrowth }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(null)
  const [isNew, setIsNew]       = useState(false)

  const sorted = [...growth].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1] || null
  const prev   = sorted[sorted.length - 2] || null

  function delta(field) {
    if (!latest || !prev) return null
    return latest[field] - prev[field]
  }

  function openNew() {
    setForm(makeGrowthSnapshot())
    setIsNew(true)
    setShowForm(true)
  }

  function openEdit(snap) {
    setForm({ ...snap })
    setIsNew(false)
    setShowForm(true)
  }

  function closeForm() { setShowForm(false); setForm(null) }

  function saveSnap() {
    if (!form.date) return
    if (isNew) {
      setGrowth(prev => [...prev, form])
    } else {
      setGrowth(prev => prev.map(s => s.id === form.id ? form : s))
    }
    closeForm()
  }

  function deleteSnap(id) {
    if (!window.confirm('Delete this snapshot?')) return
    setGrowth(prev => prev.filter(s => s.id !== id))
    closeForm()
  }

  const chartData = sorted.map(s => ({
    date: s.date.slice(5),  // MM-DD
    community: s.communityMembers,
    discord:   s.discordMembers,
    youtube:   s.youtubeSubscribers,
    revenue:   s.monthlyRevenue,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">Growth</h1>
          <p className="text-xs text-muted mt-0.5">{growth.length} snapshot{growth.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-green text-bg px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green/90 transition-colors"
        >
          + Log Snapshot
        </button>
      </div>

      {/* Latest snapshot metrics */}
      {latest && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Community"
              value={latest.communityMembers.toLocaleString()}
              color="#00e5a0"
              sub={deltaStr(delta('communityMembers'))}
            />
            <MetricCard
              label="Discord"
              value={latest.discordMembers.toLocaleString()}
              color="#8b5cf6"
              sub={deltaStr(delta('discordMembers'))}
            />
            <MetricCard
              label="YouTube"
              value={latest.youtubeSubscribers.toLocaleString()}
              color="#ff3d6e"
              sub={deltaStr(delta('youtubeSubscribers'))}
            />
            <MetricCard
              label="Revenue / Mo"
              value={`$${latest.monthlyRevenue.toLocaleString()}`}
              color="#ffb020"
              sub={deltaStr(delta('monthlyRevenue'), true)}
            />
          </div>

          {/* Charts — only show if 2+ data points */}
          {sorted.length >= 2 && (
            <div className="space-y-4">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Trend</p>
              <div className="card p-4">
                <p className="text-xs text-muted mb-3">Community + Discord</p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                    <XAxis dataKey="date" tick={{ fill: '#4a5a7a', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#4a5a7a', fontSize: 10 }} width={40} />
                    <Tooltip
                      contentStyle={{ background: '#0f1624', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: '#ccd6f6' }}
                    />
                    <Line type="monotone" dataKey="community" stroke="#00e5a0" strokeWidth={2} dot={false} name="Community" />
                    <Line type="monotone" dataKey="discord"   stroke="#8b5cf6" strokeWidth={2} dot={false} name="Discord" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4">
                <p className="text-xs text-muted mb-3">Monthly Revenue</p>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                    <XAxis dataKey="date" tick={{ fill: '#4a5a7a', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#4a5a7a', fontSize: 10 }} width={50} tickFormatter={v => `$${v.toLocaleString()}`} />
                    <Tooltip
                      contentStyle={{ background: '#0f1624', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 11 }}
                      formatter={v => [`$${v.toLocaleString()}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#ffb020" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* History list */}
      {sorted.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">History</p>
          <div className="card divide-y divide-border overflow-hidden">
            {[...sorted].reverse().map(s => (
              <div key={s.id} className="px-4 py-3 flex items-start justify-between gap-4 hover:bg-surf2 cursor-pointer transition-colors" onClick={() => openEdit(s)}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-txt">{formatDate(s.date)}</p>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-muted">Community: <span className="text-txt">{s.communityMembers}</span></span>
                    <span className="text-[10px] text-muted">Discord: <span className="text-txt">{s.discordMembers}</span></span>
                    <span className="text-[10px] text-muted">YT: <span className="text-txt">{s.youtubeSubscribers}</span></span>
                    <span className="text-[10px] text-muted">Rev: <span className="text-green">${s.monthlyRevenue.toLocaleString()}</span></span>
                  </div>
                  {s.notes && <p className="text-[10px] text-muted/60 italic mt-1 truncate">{s.notes}</p>}
                </div>
                <span className="text-muted text-xs">✎</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {growth.length === 0 && (
        <div className="card p-12 text-center text-muted text-sm">
          No growth data yet.<br />
          <button onClick={openNew} className="text-blue hover:underline mt-2 block mx-auto">Log your first snapshot →</button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && form && (
        <Modal title={isNew ? 'Log Snapshot' : 'Edit Snapshot'} onClose={closeForm}>
          <div className="space-y-4">
            <Field label="Date">
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Community Members">
                <Input
                  type="number"
                  min="0"
                  value={form.communityMembers || ''}
                  onChange={e => setForm(f => ({ ...f, communityMembers: Number(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </Field>
              <Field label="Discord Members">
                <Input
                  type="number"
                  min="0"
                  value={form.discordMembers || ''}
                  onChange={e => setForm(f => ({ ...f, discordMembers: Number(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </Field>
              <Field label="YouTube Subscribers">
                <Input
                  type="number"
                  min="0"
                  value={form.youtubeSubscribers || ''}
                  onChange={e => setForm(f => ({ ...f, youtubeSubscribers: Number(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </Field>
              <Field label="Monthly Revenue ($)">
                <Input
                  type="number"
                  min="0"
                  value={form.monthlyRevenue || ''}
                  onChange={e => setForm(f => ({ ...f, monthlyRevenue: Number(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Key events, wins, context..."
              />
            </Field>

            <div className="flex items-center justify-between pt-2">
              <div>{!isNew && <Btn variant="danger" onClick={() => deleteSnap(form.id)}>Delete</Btn>}</div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={closeForm}>Cancel</Btn>
                <Btn variant="green" onClick={saveSnap}>{isNew ? 'Save Snapshot' : 'Update'}</Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function deltaStr(d, isMoney = false) {
  if (d === null) return undefined
  if (d === 0) return 'No change'
  const prefix = d > 0 ? '+' : ''
  return `${prefix}${isMoney ? '$' : ''}${Math.abs(d).toLocaleString()} ${d > 0 ? '↑' : '↓'}`
}

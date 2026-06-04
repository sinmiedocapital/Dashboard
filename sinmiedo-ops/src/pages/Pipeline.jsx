import React, { useState } from 'react'
import { makeContentItem, CONTENT_TYPES, formatDateShort, STATUS_META } from '../utils'
import Modal, { Field, Input, Textarea, Select, Btn } from '../components/Modal'
import { StatusBadge } from '../components/StatusBadge'

const PIPELINE_STATUSES = [
  { key: 'idea',      label: 'Ideas' },
  { key: 'scripted',  label: 'Scripted' },
  { key: 'recording', label: 'Recording / Editing' },
  { key: 'published', label: 'Published' },
]

// Merge recording+editing into one column for display
const COLUMN_STATUS_MAP = {
  idea:      ['idea'],
  scripted:  ['scripted'],
  recording: ['recording', 'editing'],
  published: ['published'],
}

export default function Pipeline({ pipeline, setPipeline }) {
  const [editing, setEditing]   = useState(null)
  const [isNew, setIsNew]       = useState(false)
  const [filterType, setFilterType] = useState('all')

  const visible = filterType === 'all' ? pipeline : pipeline.filter(i => i.type === filterType)

  function openNew(defaultStatus = 'idea') {
    setEditing(makeContentItem({ status: defaultStatus }))
    setIsNew(true)
  }

  function openEdit(item) {
    setEditing({ ...item })
    setIsNew(false)
  }

  function closeModal() { setEditing(null); setIsNew(false) }

  function saveItem() {
    if (!editing.title.trim()) return
    if (isNew) {
      setPipeline(prev => [editing, ...prev])
    } else {
      setPipeline(prev => prev.map(i => i.id === editing.id ? editing : i))
    }
    closeModal()
  }

  function deleteItem(id) {
    if (!window.confirm('Delete this item?')) return
    setPipeline(prev => prev.filter(i => i.id !== id))
    closeModal()
  }

  function moveStatus(id, newStatus) {
    setPipeline(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i))
  }

  const typesSeen = [...new Set(pipeline.map(i => i.type))]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">Content Pipeline</h1>
          <p className="text-xs text-muted mt-0.5">{pipeline.length} piece{pipeline.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-2 bg-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue/90 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add
        </button>
      </div>

      {/* Type filter */}
      {typesSeen.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <TypeChip label="All" active={filterType === 'all'} onClick={() => setFilterType('all')} />
          {typesSeen.map(t => (
            <TypeChip key={t} label={t} active={filterType === t} onClick={() => setFilterType(prev => prev === t ? 'all' : t)} />
          ))}
        </div>
      )}

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STATUSES.map(col => {
          const statuses = COLUMN_STATUS_MAP[col.key]
          const items = visible.filter(i => statuses.includes(i.status))
          const meta = STATUS_META[col.key] || STATUS_META.idea

          return (
            <div key={col.key} className="space-y-2">
              {/* Column header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                    {col.label}
                  </span>
                  <span className="text-[10px] text-muted bg-surf2 rounded-full px-1.5 py-0.5">{items.length}</span>
                </div>
                <button
                  onClick={() => openNew(col.key === 'recording' ? 'recording' : col.key)}
                  className="text-muted hover:text-txt text-sm w-5 h-5 flex items-center justify-center rounded hover:bg-surf2 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[80px]">
                {items.map(item => (
                  <PipelineCard
                    key={item.id}
                    item={item}
                    onEdit={() => openEdit(item)}
                    onMove={moveStatus}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {pipeline.length === 0 && (
        <div className="card p-12 text-center text-muted text-sm">
          No content tracked yet.{' '}
          <button onClick={() => openNew()} className="text-blue hover:underline">Add your first piece →</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {editing && (
        <Modal title={isNew ? 'Add Content' : 'Edit Content'} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={editing.title}
                onChange={e => setEditing(i => ({ ...i, title: e.target.value }))}
                placeholder="e.g. MES June Setup Video"
                autoFocus
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <Select value={editing.type} onChange={e => setEditing(i => ({ ...i, type: e.target.value }))}>
                  {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Status">
                <Select value={editing.status} onChange={e => setEditing(i => ({ ...i, status: e.target.value }))}>
                  <option value="idea">Idea</option>
                  <option value="scripted">Scripted</option>
                  <option value="recording">Recording</option>
                  <option value="editing">Editing</option>
                  <option value="published">Published</option>
                </Select>
              </Field>
            </div>

            <Field label="Target Date">
              <Input
                type="date"
                value={editing.targetDate || ''}
                onChange={e => setEditing(i => ({ ...i, targetDate: e.target.value || null }))}
              />
            </Field>

            <Field label="Notes">
              <Textarea
                value={editing.notes}
                onChange={e => setEditing(i => ({ ...i, notes: e.target.value }))}
                placeholder="Topic, angle, call to action..."
              />
            </Field>

            <Field label="Link (optional)">
              <Input
                value={editing.link}
                onChange={e => setEditing(i => ({ ...i, link: e.target.value }))}
                placeholder="YouTube, Google Doc, Notion..."
              />
            </Field>

            <div className="flex items-center justify-between pt-2">
              <div>{!isNew && <Btn variant="danger" onClick={() => deleteItem(editing.id)}>Delete</Btn>}</div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
                <Btn variant="primary" onClick={saveItem}>{isNew ? 'Add' : 'Save'}</Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function PipelineCard({ item, onEdit, onMove }) {
  const allStatuses = ['idea','scripted','recording','editing','published']
  const currentIdx = allStatuses.indexOf(item.status)

  return (
    <div className="card p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-txt leading-snug flex-1">{item.title}</p>
        <button onClick={onEdit} className="text-muted hover:text-txt text-[10px] flex-shrink-0 mt-0.5">✎</button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <TypePill type={item.type} />
        {item.targetDate && (
          <span className="text-[10px] text-muted">{formatDateShort(item.targetDate)}</span>
        )}
      </div>

      {item.notes && (
        <p className="text-[10px] text-muted/70 italic leading-snug line-clamp-2">{item.notes}</p>
      )}

      {item.link && (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue hover:underline block truncate">
          {item.link}
        </a>
      )}

      {/* Move arrows */}
      <div className="flex gap-1 pt-1">
        {currentIdx > 0 && (
          <button
            onClick={() => onMove(item.id, allStatuses[currentIdx - 1])}
            className="flex-1 text-[9px] text-muted hover:text-txt border border-border hover:border-border/80 rounded px-2 py-1 transition-colors"
          >
            ← Back
          </button>
        )}
        {currentIdx < allStatuses.length - 1 && (
          <button
            onClick={() => onMove(item.id, allStatuses[currentIdx + 1])}
            className="flex-1 text-[9px] text-blue hover:text-blue/80 border border-blue/20 hover:border-blue/40 rounded px-2 py-1 transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

function TypePill({ type }) {
  const colors = {
    YouTube: '#ff3d6e', Short: '#ff3d6e', Instagram: '#8b5cf6',
    Twitter: '#3d8ef0', Blog: '#ffb020', Course: '#00e5a0', Other: '#4a5a7a',
  }
  const color = colors[type] || '#4a5a7a'
  return (
    <span className="badge" style={{ color, background: `${color}18` }}>{type}</span>
  )
}

function TypeChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
        active ? 'bg-blue/15 border-blue/30 text-blue' : 'bg-surf2 border-border text-muted hover:text-txt'
      }`}
    >
      {label}
    </button>
  )
}

import React, { useState } from 'react'
import {
  makeProject, makeTask, CATEGORIES, daysUntil, formatDateShort,
} from '../utils'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge'
import Modal, { Field, Input, Textarea, Select, Btn } from '../components/Modal'

const STATUSES = ['idea', 'active', 'review', 'done', 'paused']
const PRIORITIES = ['high', 'medium', 'low']

export default function Projects({ projects, setProjects }) {
  const [filterStatus, setFilterStatus]     = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [expanded, setExpanded]             = useState(null)
  const [editing, setEditing]               = useState(null)   // null | project object
  const [isNew, setIsNew]                   = useState(false)

  const visible = projects.filter(p => {
    if (filterStatus   !== 'all' && p.status   !== filterStatus)   return false
    if (filterCategory !== 'all' && p.category !== filterCategory) return false
    return true
  })

  const statusCounts = Object.fromEntries(
    STATUSES.map(s => [s, projects.filter(p => p.status === s).length])
  )

  function openNew() {
    setEditing(makeProject())
    setIsNew(true)
  }

  function openEdit(p) {
    setEditing({ ...p, tasks: p.tasks.map(t => ({ ...t })) })
    setIsNew(false)
  }

  function closeModal() { setEditing(null); setIsNew(false) }

  function saveProject() {
    if (!editing.title.trim()) return
    const updated = { ...editing, updatedAt: new Date().toISOString() }
    if (isNew) {
      setProjects(prev => [updated, ...prev])
    } else {
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    }
    closeModal()
  }

  function deleteProject(id) {
    if (!window.confirm('Delete this project?')) return
    setProjects(prev => prev.filter(p => p.id !== id))
    closeModal()
  }

  function toggleTask(projectId, taskId) {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
        updatedAt: new Date().toISOString(),
      }
    }))
  }

  function addTask(projectId) {
    const title = prompt('Task title:')
    if (!title?.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return { ...p, tasks: [...p.tasks, makeTask(title.trim())], updatedAt: new Date().toISOString() }
    }))
  }

  function deleteTask(projectId, taskId) {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return { ...p, tasks: p.tasks.filter(t => t.id !== taskId), updatedAt: new Date().toISOString() }
    }))
  }

  // For the modal's task editor
  function modalAddTask() {
    setEditing(e => ({ ...e, tasks: [...e.tasks, makeTask('')] }))
  }
  function modalUpdateTask(idx, field, val) {
    setEditing(e => {
      const tasks = [...e.tasks]
      tasks[idx] = { ...tasks[idx], [field]: val }
      return { ...e, tasks }
    })
  }
  function modalDeleteTask(idx) {
    setEditing(e => ({ ...e, tasks: e.tasks.filter((_, i) => i !== idx) }))
  }

  const sortOrder = { active: 0, review: 1, idea: 2, paused: 3, done: 4 }
  const sorted = [...visible].sort((a, b) => {
    const sd = (sortOrder[a.status] ?? 5) - (sortOrder[b.status] ?? 5)
    if (sd !== 0) return sd
    const pa = { high: 0, medium: 1, low: 2 }
    return (pa[a.priority] ?? 1) - (pa[b.priority] ?? 1)
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-txt">Projects</h1>
          <p className="text-xs text-muted mt-0.5">{projects.length} total · {statusCounts.active || 0} active</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue/90 transition-colors"
        >
          <span className="text-base leading-none">+</span> New Project
        </button>
      </div>

      {/* Status quick-filter chips */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip label="All" active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
        {STATUSES.map(s => (
          <FilterChip
            key={s}
            label={`${s.charAt(0).toUpperCase() + s.slice(1)} (${statusCounts[s] || 0})`}
            active={filterStatus === s}
            onClick={() => setFilterStatus(prev => prev === s ? 'all' : s)}
          />
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip label="All categories" small active={filterCategory === 'all'} onClick={() => setFilterCategory('all')} />
        {CATEGORIES.map(c => (
          <FilterChip
            key={c.value}
            label={c.label}
            small
            active={filterCategory === c.value}
            onClick={() => setFilterCategory(prev => prev === c.value ? 'all' : c.value)}
            color={filterCategory === c.value ? c.color : undefined}
          />
        ))}
      </div>

      {/* Project list */}
      {sorted.length === 0 && (
        <div className="card p-12 text-center text-muted text-sm">
          No projects yet.{' '}
          <button onClick={openNew} className="text-blue hover:underline">Create your first one →</button>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(p => {
          const isOpen = expanded === p.id
          const doneTasks = p.tasks.filter(t => t.done).length
          const progress = p.tasks.length ? Math.round((doneTasks / p.tasks.length) * 100) : null
          const days = daysUntil(p.deadline)

          return (
            <div key={p.id} className="card overflow-hidden">
              {/* Project row */}
              <div
                className="p-4 cursor-pointer hover:bg-surf2 transition-colors"
                onClick={() => setExpanded(isOpen ? null : p.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Chevron */}
                  <span className={`text-muted mt-0.5 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}>▶</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-txt truncate">{p.title}</p>
                      <StatusBadge status={p.status} />
                      <PriorityBadge priority={p.priority} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1.5">
                      <CategoryBadge category={p.category} />
                      {p.deadline && (
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: days !== null && days < 0 ? '#ff3d6e' : days !== null && days <= 7 ? '#ffb020' : '#4a5a7a' }}
                        >
                          {days === null ? '' : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                          {' · '}{formatDateShort(p.deadline)}
                        </span>
                      )}
                      {p.tasks.length > 0 && (
                        <span className="text-[10px] text-muted">{doneTasks}/{p.tasks.length} tasks</span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {progress !== null && (
                      <div className="mt-2 h-1 bg-surf3 rounded-full overflow-hidden w-full max-w-xs">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            background: progress === 100 ? '#00e5a0' : '#3d8ef0',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); openEdit(p) }}
                    className="flex-shrink-0 text-muted hover:text-txt text-xs px-2 py-1 rounded-lg hover:bg-surf3 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Expanded task list */}
              {isOpen && (
                <div className="border-t border-border bg-surf2/40 px-4 py-3 space-y-2">
                  {p.notes && (
                    <p className="text-xs text-muted italic mb-3">{p.notes}</p>
                  )}

                  {p.tasks.length === 0 && (
                    <p className="text-xs text-muted/60 mb-2">No tasks yet.</p>
                  )}

                  {p.tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 group">
                      <button
                        onClick={() => toggleTask(p.id, t.id)}
                        className={`w-4 h-4 flex-shrink-0 rounded border transition-colors ${
                          t.done
                            ? 'bg-green border-green'
                            : 'border-border hover:border-blue/50'
                        }`}
                      >
                        {t.done && (
                          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                            <polyline points="2,6 5,9 10,3" stroke="#080c14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className={`text-xs flex-1 ${t.done ? 'line-through text-muted/50' : 'text-txt'}`}>
                        {t.title}
                      </span>
                      <button
                        onClick={() => deleteTask(p.id, t.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted/40 hover:text-red text-xs transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addTask(p.id)}
                    className="text-xs text-blue hover:underline mt-1"
                  >
                    + Add task
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      {editing && (
        <Modal title={isNew ? 'New Project' : 'Edit Project'} onClose={closeModal} wide>
          <div className="space-y-4">
            <Field label="Title">
              <Input
                value={editing.title}
                onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                placeholder="Project name"
                autoFocus
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <Select value={editing.status} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </Select>
              </Field>
              <Field label="Priority">
                <Select value={editing.priority} onChange={e => setEditing(p => ({ ...p, priority: e.target.value }))}>
                  {PRIORITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Select>
              </Field>
              <Field label="Deadline">
                <Input
                  type="date"
                  value={editing.deadline || ''}
                  onChange={e => setEditing(p => ({ ...p, deadline: e.target.value || null }))}
                />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea
                value={editing.notes}
                onChange={e => setEditing(p => ({ ...p, notes: e.target.value }))}
                placeholder="Context, links, anything relevant..."
              />
            </Field>

            {/* Tasks editor */}
            <Field label={`Tasks (${editing.tasks.length})`}>
              <div className="space-y-2">
                {editing.tasks.map((t, idx) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => modalUpdateTask(idx, 'done', !t.done)}
                      className="flex-shrink-0 accent-green"
                    />
                    <Input
                      value={t.title}
                      onChange={e => modalUpdateTask(idx, 'title', e.target.value)}
                      placeholder="Task title"
                    />
                    <button
                      type="button"
                      onClick={() => modalDeleteTask(idx)}
                      className="flex-shrink-0 text-muted hover:text-red transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={modalAddTask}
                  className="text-xs text-blue hover:underline"
                >
                  + Add task
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between pt-2">
              <div>
                {!isNew && (
                  <Btn variant="danger" onClick={() => deleteProject(editing.id)}>Delete</Btn>
                )}
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
                <Btn variant="primary" onClick={saveProject}>
                  {isNew ? 'Create Project' : 'Save Changes'}
                </Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick, small = false, color }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-medium transition-all duration-150 ${small ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} ${
        active
          ? 'bg-blue/15 border border-blue/30 text-blue'
          : 'bg-surf2 border border-border text-muted hover:text-txt hover:border-border/80'
      }`}
      style={active && color ? { borderColor: `${color}50`, color, background: `${color}18` } : {}}
    >
      {label}
    </button>
  )
}

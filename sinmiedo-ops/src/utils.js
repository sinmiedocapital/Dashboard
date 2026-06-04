import { nanoid } from 'nanoid'

export const KEYS = {
  projects: 'smcOps_projects',
  pipeline: 'smcOps_pipeline',
  growth:   'smcOps_growth',
}

export function newId() { return nanoid(10) }

export function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

export function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function daysUntil(iso) {
  if (!iso) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const target = new Date(iso + 'T00:00:00')
  return Math.round((target - today) / 86400000)
}

export const STATUS_META = {
  // project statuses
  idea:    { label: 'Idea',        color: '#4a5a7a', bg: 'rgba(74,90,122,0.15)' },
  active:  { label: 'Active',      color: '#00e5a0', bg: 'rgba(0,229,160,0.12)' },
  review:  { label: 'Review',      color: '#ffb020', bg: 'rgba(255,176,32,0.12)' },
  done:    { label: 'Done',        color: '#3d8ef0', bg: 'rgba(61,142,240,0.12)' },
  paused:  { label: 'Paused',      color: '#ff3d6e', bg: 'rgba(255,61,110,0.1)'  },
  // pipeline statuses
  scripted:   { label: 'Scripted',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  recording:  { label: 'Recording',  color: '#ffb020', bg: 'rgba(255,176,32,0.12)' },
  editing:    { label: 'Editing',    color: '#3d8ef0', bg: 'rgba(61,142,240,0.12)' },
  published:  { label: 'Published',  color: '#00e5a0', bg: 'rgba(0,229,160,0.12)' },
}

export const PRIORITY_META = {
  high:   { label: 'High',   color: '#ff3d6e' },
  medium: { label: 'Med',    color: '#ffb020' },
  low:    { label: 'Low',    color: '#4a5a7a' },
}

export const CATEGORIES = [
  { value: 'indicator',    label: 'Indicator Dev',   color: '#8b5cf6' },
  { value: 'community',   label: 'Community',       color: '#00e5a0' },
  { value: 'content',     label: 'Content',         color: '#3d8ef0' },
  { value: 'business',    label: 'Business',        color: '#ffb020' },
  { value: 'partnership', label: 'Partnership',     color: '#ff3d6e' },
  { value: 'other',       label: 'Other',           color: '#4a5a7a' },
]

export const CONTENT_TYPES = [
  'YouTube', 'Short', 'Instagram', 'Twitter', 'Blog', 'Course', 'Other'
]

export function getCategoryMeta(value) {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1]
}

export function makeProject(overrides = {}) {
  const now = new Date().toISOString()
  return {
    id:       newId(),
    title:    '',
    category: 'business',
    status:   'idea',
    priority: 'medium',
    deadline: null,
    notes:    '',
    assignee: 'Me',
    tasks:    [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function makeTask(title = '') {
  return { id: newId(), title, done: false, dueDate: null }
}

export function makeContentItem(overrides = {}) {
  return {
    id:         newId(),
    title:      '',
    type:       'YouTube',
    status:     'idea',
    targetDate: null,
    notes:      '',
    link:       '',
    createdAt:  new Date().toISOString(),
    ...overrides,
  }
}

export function makeGrowthSnapshot(overrides = {}) {
  return {
    id:                   newId(),
    date:                 todayISO(),
    communityMembers:     0,
    discordMembers:       0,
    youtubeSubscribers:   0,
    monthlyRevenue:       0,
    notes:                '',
    ...overrides,
  }
}

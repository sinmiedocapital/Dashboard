import React from 'react'
import { STATUS_META, PRIORITY_META, getCategoryMeta } from '../utils'

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.idea
  return (
    <span
      className="badge"
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium
  return (
    <span className="badge" style={{ color: meta.color, background: `${meta.color}18` }}>
      {meta.label}
    </span>
  )
}

export function CategoryBadge({ category }) {
  const meta = getCategoryMeta(category)
  return (
    <span className="badge" style={{ color: meta.color, background: `${meta.color}18` }}>
      {meta.label}
    </span>
  )
}

import React from 'react'
import Sidebar from './components/Sidebar'
import Today from './pages/Today'
import Week from './pages/Week'
import Month from './pages/Month'
import BetaUsers from './pages/BetaUsers'
import Community from './pages/Community'
import Export from './pages/Export'
import {
  loadEntries, saveEntries, upsertEntry,
  currentYM, getMonthEntries, monthlyTotal, MONTHLY_TARGET,
} from './utils'

export default function App() {
  const [page,    setPage]    = React.useState('today')
  const [entries, setEntries] = React.useState(() => loadEntries())

  React.useEffect(() => {
    saveEntries(entries)
  }, [entries])

  function handleSave(entry) {
    setEntries(prev => upsertEntry(prev, entry))
  }

  const monthEntries = getMonthEntries(entries, currentYM())
  const monthTotal   = monthlyTotal(monthEntries)
  const pct          = Math.min(100, Math.max(0, (monthTotal / MONTHLY_TARGET) * 100))

  const pages = {
    today:     <Today     entries={entries} onSave={handleSave} />,
    week:      <Week      entries={entries} />,
    month:     <Month     entries={entries} />,
    beta:      <BetaUsers entries={entries} onSave={handleSave} />,
    community: <Community entries={entries} />,
    export:    <Export    entries={entries} />,
  }

  return (
    <div className="flex h-full overflow-hidden bg-bg">
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        monthTotal={monthTotal}
        pct={pct}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 pb-28 sm:pb-8">
          {pages[page]}
        </div>
      </main>
    </div>
  )
}

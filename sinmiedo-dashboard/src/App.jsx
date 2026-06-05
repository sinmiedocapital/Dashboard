import React from 'react'
import Sidebar   from './components/Sidebar'
import Welcome   from './pages/Welcome'
import Today     from './pages/Today'
import Week      from './pages/Week'
import Month     from './pages/Month'
import Accounts  from './pages/Accounts'
import Community from './pages/Community'
import Export    from './pages/Export'
import {
  loadEntries, saveEntries, upsertEntry,
  loadAccounts, saveAccounts,
  loadProfile,
  currentYM, getMonthEntries, monthlyTotal, MONTHLY_TARGET,
} from './utils'

export default function App() {
  const [profile,  setProfile]  = React.useState(() => loadProfile())
  const [page,     setPage]     = React.useState('today')
  const [entries,  setEntries]  = React.useState(() => loadEntries(loadProfile()?.name))
  const [accounts, setAccounts] = React.useState(() => loadAccounts(loadProfile()?.name || ''))

  // Persist entries & accounts whenever they change
  React.useEffect(() => {
    if (profile) saveEntries(entries, profile.name)
  }, [entries, profile])

  React.useEffect(() => {
    if (profile) saveAccounts(accounts, profile.name)
  }, [accounts, profile])

  function handleSave(entry) {
    setEntries(prev => upsertEntry(prev, entry))
  }

  function handleJoin(newProfile) {
    setProfile(newProfile)
    setEntries(loadEntries(newProfile.name))
    setAccounts(loadAccounts(newProfile.name))
  }

  function handleSignOut() {
    setProfile(null)
    setEntries([])
    setAccounts([])
    setPage('today')
  }

  // Show welcome screen if no profile
  if (!profile) {
    return <Welcome onJoin={handleJoin} />
  }

  const monthEntries = getMonthEntries(entries, currentYM())
  const monthTotal   = monthlyTotal(monthEntries)
  const pct          = Math.min(100, Math.max(0, (monthTotal / MONTHLY_TARGET) * 100))

  const pages = {
    today:     <Today     entries={entries} onSave={handleSave} />,
    week:      <Week      entries={entries} />,
    month:     <Month     entries={entries} />,
    accounts:  <Accounts  accounts={accounts} setAccounts={setAccounts} />,
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
        profile={profile}
        onSignOut={handleSignOut}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 pb-28 sm:pb-8">
          {pages[page]}
        </div>
      </main>
    </div>
  )
}

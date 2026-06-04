import React, { useState, useEffect } from 'react'
import { load, save, KEYS } from './utils'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import Pipeline from './pages/Pipeline'
import Growth   from './pages/Growth'

export default function App() {
  const [page,     setPage]     = useState('overview')
  const [projects, setProjects] = useState(() => load(KEYS.projects))
  const [pipeline, setPipeline] = useState(() => load(KEYS.pipeline))
  const [growth,   setGrowth]   = useState(() => load(KEYS.growth))

  useEffect(() => { save(KEYS.projects, projects) }, [projects])
  useEffect(() => { save(KEYS.pipeline, pipeline) }, [pipeline])
  useEffect(() => { save(KEYS.growth,   growth)   }, [growth])

  const pageProps = { projects, setProjects, pipeline, setPipeline, growth, setGrowth, setPage }

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar page={page} setPage={setPage} />

      {/* Main content — offset for sidebar on desktop, padding-bottom for mobile tab bar */}
      <main className="sm:ml-56 pb-24 sm:pb-8 px-4 sm:px-6 pt-6 max-w-4xl">
        {page === 'overview' && <Overview  {...pageProps} />}
        {page === 'projects' && <Projects  {...pageProps} />}
        {page === 'pipeline' && <Pipeline  {...pageProps} />}
        {page === 'growth'   && <Growth    {...pageProps} />}
      </main>
    </div>
  )
}

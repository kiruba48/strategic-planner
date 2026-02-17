import { useEffect } from 'react'
import { useTaskStore } from './stores/taskStore.js'
import { useUIStore } from './stores/uiStore.js'

function App() {
  const tasks = useTaskStore((s) => s.tasks)
  const activeLane = useUIStore((s) => s.activeLane)

  useEffect(() => {
    console.log('Tasks loaded:', tasks.length)
    console.log('Active lane:', activeLane)
    console.log(
      'Tasks by lane:',
      ['chess', 'hybrid', 'poker'].map((lane) => ({
        lane,
        count: tasks.filter((t) => t.classification === lane).length,
      }))
    )
  }, [tasks, activeLane])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f1f5f9' }}>
          Chess-Poker Task Manager
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Foundation layer active — stores and data layer ready
        </p>
        <div style={{ color: '#6366f1', fontSize: '0.875rem' }}>
          {tasks.length} tasks loaded across 3 lanes
        </div>
      </div>
    </div>
  )
}

export default App

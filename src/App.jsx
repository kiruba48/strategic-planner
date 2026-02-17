function App() {
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
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Foundation layer active — stores and data layer ready
        </p>
      </div>
    </div>
  )
}

export default App

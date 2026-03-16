import ErrorBoundary from './components/ErrorBoundary.jsx'
import TaskBoard from './components/Board/TaskBoard.jsx'

function App() {
  return (
    <ErrorBoundary>
      <TaskBoard />
    </ErrorBoundary>
  )
}

export default App

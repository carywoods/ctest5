import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Chat from './components/Chat'

function App() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <Chat />
}

export default App

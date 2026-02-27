import { useState } from 'react'
import { supabase } from './lib/supabase'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      setStatus({ type: 'error', text: 'Please enter a message' })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const { data, error } = await supabase
        .from('test_records')
        .insert([{ message: message.trim() }])
        .select()

      if (error) throw error

      setStatus({
        type: 'success',
        text: `Record created successfully! ID: ${data[0].id}`
      })
      setMessage('')
    } catch (error) {
      setStatus({
        type: 'error',
        text: `Error: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      {!supabase && (
        <div className="warning-banner">
          <strong>⚠️ Configuration Missing</strong>
          <p>Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables</p>
        </div>
      )}

      <header className="header">
        <div className="header-content">
          <div>
            <h1>Supabase Test App</h1>
            <p className="subtitle">Insert records into test_records table</p>
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button onClick={signOut} className="signout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              disabled={!supabase || loading}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={!supabase || loading}
            className="submit-button"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.text}
          </div>
        )}
      </main>
    </div>
  )
}

export default App

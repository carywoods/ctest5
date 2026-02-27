import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function App() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

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
        <h1>Supabase Test App</h1>
        <p className="subtitle">Insert records into test_records table</p>
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

import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('signin')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let result
      if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        })
      } else {
        result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        })
      }

      if (result.error) throw result.error

      if (mode === 'signup' && !result.error) {
        setError('Check your email for the confirmation link!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              className="input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="toggle-mode">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="link-button">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="link-button">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Chat() {
  const { user, signOut } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!supabase) return

    // Load initial messages
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((current) => [...current, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !user) return

    setSending(true)

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            email: user.email,
            body: newMessage.trim(),
          },
        ])

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Error sending message: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!supabase) {
    return (
      <div className="chat-container">
        <div className="warning-banner">
          <strong>⚠️ Configuration Missing</strong>
          <p>Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div>
          <h1>Chat</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={signOut} className="signout-button">
          Sign Out
        </button>
      </header>

      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.user_id === user?.id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-email">{message.email}</span>
                <span className="message-time">{formatTimestamp(message.created_at)}</span>
              </div>
              <div className="message-body">{message.body}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="message-input"
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className="send-button">
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat

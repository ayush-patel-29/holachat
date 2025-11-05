import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type ChatSession = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

type ChatContextValue = {
  sessions: ChatSession[]
  currentSessionId: string | null
  currentSession: ChatSession | null
  loading: boolean
  createNewChat: () => Promise<void>
  switchChat: (sessionId: string) => void
  addMessage: (role: 'user' | 'assistant', content: string) => Promise<void>
  deleteChat: (sessionId: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

const CACHE_KEY = 'holachat_sessions_cache'

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load sessions from Supabase on mount or user change
  useEffect(() => {
    if (!user) {
      setSessions([])
      setCurrentSessionId(null)
      setLoading(false)
      return
    }

    loadSessions()
  }, [user])

  // Cache sessions to localStorage for faster loading
  useEffect(() => {
    if (sessions.length > 0 && user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(sessions))
    }
  }, [sessions, user])

  const loadSessions = async () => {
    try {
      setLoading(true)
      
      // Try to load from cache first for instant UI
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setSessions(parsed)
          if (parsed.length > 0) {
            setCurrentSessionId(parsed[0].id)
          }
        } catch (e) {
          console.error('Failed to parse cached sessions:', e)
        }
      }

      // Fetch sessions from database
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })

      if (sessionsError) throw sessionsError

      if (!sessionsData || sessionsData.length === 0) {
        // Create initial session if none exists
        await createNewChat()
        return
      }

      // Fetch messages for all sessions
      const sessionIds = sessionsData.map((s) => s.id)
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      // Group messages by session
      const messagesBySession = new Map<string, Message[]>()
      messagesData?.forEach((msg) => {
        if (!messagesBySession.has(msg.session_id)) {
          messagesBySession.set(msg.session_id, [])
        }
        messagesBySession.get(msg.session_id)!.push({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at).getTime(),
        })
      })

      // Combine sessions with messages
      const loadedSessions: ChatSession[] = sessionsData.map((session) => ({
        id: session.id,
        title: session.title,
        messages: messagesBySession.get(session.id) || [],
        createdAt: new Date(session.created_at).getTime(),
        updatedAt: new Date(session.updated_at).getTime(),
      }))

      setSessions(loadedSessions)
      if (loadedSessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(loadedSessions[0].id)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewChat = async () => {
    if (!user) return

    // Don't create a new chat if the current session is empty
    const currentChat = sessions.find((s) => s.id === currentSessionId)
    if (currentChat && currentChat.messages.length === 0) {
      // Just stay on the current empty chat
      return
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat',
        })
        .select()
        .single()

      if (error) throw error

      const newSession: ChatSession = {
        id: data.id,
        title: data.title,
        messages: [],
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
      }

      setSessions((prev) => [newSession, ...prev])
      setCurrentSessionId(newSession.id)
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const switchChat = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!currentSessionId || !user) return

    try {
      // Insert message to database
      const { data: messageData, error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          role,
          content,
        })
        .select()
        .single()

      if (messageError) throw messageError

      const newMessage: Message = {
        id: messageData.id,
        role: messageData.role as 'user' | 'assistant',
        content: messageData.content,
        timestamp: new Date(messageData.created_at).getTime(),
      }

      // Update local state
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === currentSessionId) {
            const updatedMessages = [...session.messages, newMessage]
            // Auto-generate title from first user message
            const newTitle =
              session.messages.length === 0 && role === 'user'
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : session.title

            // Update title in database if changed
            if (newTitle !== session.title) {
              supabase
                .from('chat_sessions')
                .update({ title: newTitle })
                .eq('id', currentSessionId)
                .then(({ error }) => {
                  if (error) console.error('Error updating title:', error)
                })
            }

            return {
              ...session,
              messages: updatedMessages,
              title: newTitle,
              updatedAt: Date.now(),
            }
          }
          return session
        })
      )
    } catch (error) {
      console.error('Error adding message:', error)
    }
  }

  const deleteChat = async (sessionId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== sessionId)
        // If deleting current session, switch to another
        if (sessionId === currentSessionId) {
          if (filtered.length > 0) {
            setCurrentSessionId(filtered[0].id)
          } else {
            // Create new session if all deleted
            createNewChat()
          }
        }
        return filtered
      })
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentSession,
        loading,
        createNewChat,
        switchChat,
        addMessage,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}

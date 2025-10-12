import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type Provider = 'github' | 'google'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (provider: Provider) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.log('[AuthContext] Setting up auth listener')
    console.log('[AuthContext] Current URL:', window.location.href)
    console.log('[AuthContext] Has hash:', window.location.hash ? 'Yes' : 'No')
    console.log('[AuthContext] Has search:', window.location.search ? 'Yes' : 'No')

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.log('[AuthContext] Auth state changed:', event)
      console.log('[AuthContext] Session:', sess ? `User: ${sess.user?.email}` : 'No session')
      
      setSession(sess)
      setUser(sess?.user ?? null)
      setInitialized(true)
    })

    // Check for OAuth errors in URL first
    const params = new URLSearchParams(window.location.search)
    const urlError = params.get('error')
    const errorDescription = params.get('error_description')
    
    if (urlError) {
      console.error('[AuthContext] OAuth Error in URL:', urlError)
      console.error('[AuthContext] Error Description:', errorDescription)
      
      // Show user-friendly error message
      const message = errorDescription?.includes('Unable to exchange external code')
        ? 'Google authentication failed. Please check that:\n\n1. Google OAuth is enabled in Supabase Dashboard\n2. Client ID and Secret are correctly configured\n3. Authorized redirect URI matches Supabase callback URL'
        : `Authentication failed: ${errorDescription || urlError}`
      
      alert(message)
      
      // Clean URL and redirect to login
      window.history.replaceState({}, document.title, '/login')
      setInitialized(true)
      return
    }

    // Get initial session
    const init = async () => {
      console.log('[AuthContext] Getting initial session...')
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('[AuthContext] Error getting session:', error)
      }
      console.log('[AuthContext] Initial session:', data.session ? `User: ${data.session.user?.email}` : 'None')
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setInitialized(true)
    }
    init()

    return () => {
      console.log('[AuthContext] Cleaning up auth listener')
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (provider: Provider) => {
    const redirectTo = `${window.location.origin}/app`
    console.log('[AuthContext] Signing in with', provider, 'redirectTo:', redirectTo)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) {
      console.error('[AuthContext] Sign in error:', error)
      throw error
    }
    console.log('[AuthContext] OAuth initiated:', data)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const loading = !initialized
  const value = useMemo(() => ({ user, session, loading, signIn, signOut }), [user, session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

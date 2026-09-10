import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore, PAUSE_AUTH, DEV_MOCK_USER } from '../stores/authStore'
import { api } from '../lib/api'

export function useAuth() {
  const { supabaseUser, session, appUser, isLoading, setSession, setAppUser, setLoading, signOut } =
    useAuthStore()

  useEffect(() => {
    if (PAUSE_AUTH) {
      setLoading(false)
      fetchUserProfile()
      return
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile()
      } else {
        setLoading(false)
      }
    })

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile()
      } else {
        setAppUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/users/me')
      setAppUser(data.user)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const resolvedUser =
    appUser ||
    (supabaseUser
      ? {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split('@')[0] ||
            'User',
          currentStreakDays: 0,
          totalStudyMinutes: 0,
        }
      : null)

  return {
    user: resolvedUser,
    appUser,
    supabaseUser,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    signOut,
    fetchUserProfile,
  }
}

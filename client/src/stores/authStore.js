import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const PAUSE_AUTH = true // Set to false to re-enable Supabase login

export const DEV_MOCK_USER = {
  id: '4147f481-da38-4582-a6f0-06c989a85888',
  email: 'neeravgoyal06@gmail.com',
  name: 'Neerav Goyal',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neerav',
}

export const DEV_MOCK_SESSION = {
  access_token: 'dev-bypass-token',
  user: DEV_MOCK_USER,
}

export const useAuthStore = create((set) => ({
  supabaseUser: PAUSE_AUTH ? DEV_MOCK_USER : null,
  session: PAUSE_AUTH ? DEV_MOCK_SESSION : null,
  appUser: PAUSE_AUTH ? DEV_MOCK_USER : null,
  isLoading: false,
  setSession: (session) =>
    set((state) => ({
      session: session ?? (PAUSE_AUTH ? DEV_MOCK_SESSION : null),
      supabaseUser: (session?.user ?? (PAUSE_AUTH ? DEV_MOCK_USER : null)),
      isLoading: false,
    })),
  setAppUser: (appUser) => set({ appUser: appUser ?? (PAUSE_AUTH ? DEV_MOCK_USER : null) }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    try {
      await supabase.auth.signOut()
    } catch (_) {}
    if (!PAUSE_AUTH) {
      set({ supabaseUser: null, session: null, appUser: null, isLoading: false })
    }
  },
}))

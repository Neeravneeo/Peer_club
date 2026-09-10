import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  supabaseUser: null,
  session: null,
  appUser: null,
  isLoading: true,
  setSession: (session) =>
    set({
      session,
      supabaseUser: session?.user ?? null,
      isLoading: false,
    }),
  setAppUser: (appUser) => set({ appUser }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ supabaseUser: null, session: null, appUser: null, isLoading: false })
  },
}))

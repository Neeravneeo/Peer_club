import { createClient } from '@supabase/supabase-js'

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const supabaseUrl = isProd ? 'https://obeohxgrcteltbxfcdhi.supabase.co' : (import.meta.env.VITE_SUPABASE_URL || '')
const supabaseAnonKey = isProd ? 'sb_publishable_6bzhS08Oswb6AaSsa5Tssg_yHYB1EMb' : (import.meta.env.VITE_SUPABASE_ANON_KEY || '')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

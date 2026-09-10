import axios from 'axios'
import { supabase } from './supabase'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    } else {
      config.headers.Authorization = 'Bearer dev-bypass-token'
    }
  } catch (_) {
    config.headers.Authorization = 'Bearer dev-bypass-token'
  }
  return config
})

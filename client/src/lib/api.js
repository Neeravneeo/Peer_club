import axios from 'axios'
import { supabase } from './supabase'
import { PAUSE_AUTH } from '../stores/authStore'

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
export const api = axios.create({
  baseURL: isProd ? 'https://peerclub-production.up.railway.app/api' : (import.meta.env.VITE_API_URL || 'http://localhost:4000/api'),
})

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    } else if (PAUSE_AUTH) {
      config.headers.Authorization = 'Bearer dev-bypass-token'
    }
  } catch (_) {
    if (PAUSE_AUTH) {
      config.headers.Authorization = 'Bearer dev-bypass-token'
    }
  }
  return config
})

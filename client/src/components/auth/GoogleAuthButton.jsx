import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err) {
      toast.error(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2.5 border-border bg-pure-white hover:bg-surface-elevated text-carbon-ink font-semibold h-12 rounded-[8px]"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
        />
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
        />
        <path
          fill="#FBBC05"
          d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
        />
      </svg>
      {loading ? 'Connecting...' : 'Continue with Google'}
    </Button>
  )
}

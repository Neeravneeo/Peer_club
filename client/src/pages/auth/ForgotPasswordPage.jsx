import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { toast } from 'sonner'
import { Brain, ArrowLeft, Mail } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
      toast.success('Reset link sent to your email')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-pure-white">
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-[8px] bg-voltage-lime text-true-black font-bold">
          <Brain className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-carbon-ink">
          Peer Club
        </span>
      </div>

      <Card className="w-full max-w-md border-border bg-pure-white rounded-[24px]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold text-carbon-ink">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-voltage-lime text-true-black">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-sm text-ash">
                Check your inbox for a password reset email. Follow the link to set a new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-ash uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-accent-red">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-carbon-ink transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

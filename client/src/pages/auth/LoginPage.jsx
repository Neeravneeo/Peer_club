import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton'
import { toast } from 'sonner'
import { Brain, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      if (data.user) {
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password')
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
          <CardTitle className="text-3xl font-extrabold text-carbon-ink">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your study workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton />

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-border w-full absolute" />
            <span className="bg-pure-white px-3 text-xs uppercase tracking-wider text-ash relative z-10 font-semibold">
              or continue with email
            </span>
          </div>

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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-ash uppercase tracking-wider">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-carbon-ink font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-accent-red">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4 text-sm text-ash">
          Don't have an account?{' '}
          <Link to="/register" className="ml-1 text-carbon-ink font-bold hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

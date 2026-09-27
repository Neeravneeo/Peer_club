import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { CloudBackground } from '../../components/CloudBackground';
import { BrainIcon, GoogleIcon, EyeIcon, EyeOffIcon, Spinner } from '../../components/auth/AuthIcons';
import { toast } from 'sonner';
import { getSiteUrl } from '../../lib/utils';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Max 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
      .regex(/[0-9]/, 'Must contain at least 1 number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setServerError('');

      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            name: values.fullName.trim(),
            full_name: values.fullName.trim(),
          },
        },
      });

      if (error) throw error;

      if (data?.session) {
        toast.success('Account created successfully!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.success('Verification email sent!');
        navigate('/verify-email', { state: { email: values.email } });
      }
    } catch (err) {
      const msg = err.message || 'Failed to create account';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/dashboard`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      toast.error(err.message || 'Failed to connect with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden">
      <CloudBackground />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Floating Logo - Mathematically Centered */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center border border-white/80 animate-logoBob">
            <BrainIcon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Compact Card Container */}
        <div className="bg-[#F4F7F9] backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] p-8 pt-10">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            Start your free Peer Club account. No credit card required.
          </p>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Neerav Goyal"
                {...register('fullName')}
                className={`w-full h-11 px-4 rounded-xl bg-gray-200/60 border ${
                  errors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:border-blue-400 focus:bg-white'
                } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Your Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`w-full h-11 px-4 rounded-xl bg-gray-200/60 border ${
                  errors.email ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:border-blue-400 focus:bg-white'
                } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  {...register('password')}
                  className={`w-full h-11 px-4 pr-11 rounded-xl bg-gray-200/60 border ${
                    errors.password ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:border-blue-400 focus:bg-white'
                  } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className={`w-full h-11 px-4 pr-11 rounded-xl bg-gray-200/60 border ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:border-blue-400 focus:bg-white'
                  } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-4.5 h-4.5" /> : <EyeIcon className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-[15px] transition-all transform active:scale-[0.99] shadow-sm flex items-center justify-center mt-2"
            >
              {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SSO Button (Google) */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 text-[15px] font-medium text-gray-700 transition-colors shadow-xs"
            >
              {googleLoading ? <Spinner className="w-5 h-5 animate-spin text-gray-600" /> : <GoogleIcon className="w-5 h-5" />}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Legal Disclaimers */}
          <div className="mt-5 text-center space-y-1.5">
            <p className="text-xs text-gray-400 leading-relaxed">
              By clicking continue, you accept our{' '}
              <a href="#" className="underline hover:text-gray-600">Terms and Conditions</a> and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="#" className="underline hover:text-gray-600">Terms and Conditions</a> and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a> apply.
            </p>
          </div>

          {/* Switch to Login */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

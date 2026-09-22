import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { CloudBackground } from '../../components/CloudBackground';
import { BrainIcon, EyeIcon, EyeOffIcon, Spinner } from '../../components/auth/AuthIcons';
import { toast } from 'sonner';

const resetSchema = z
  .object({
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

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setServerError('');

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.message || 'Failed to update password';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden">
      <CloudBackground />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Floating Logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_28px_-8px_rgba(0,0,0,0.15)] flex items-center justify-center animate-logoBob border border-white/80">
            <BrainIcon className="w-9 h-9 text-emerald-600" />
          </div>
        </div>

        {/* Frosted Center Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] p-8 sm:p-10 pt-14 sm:pt-16">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight font-serif">
            Set new password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed font-sans">
            Choose a secure new password for your account.
          </p>

          {serverError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  {...register('password')}
                  className={`w-full h-12 px-4 pr-12 rounded-xl bg-white/75 border ${
                    errors.password ? 'border-red-400 focus:ring-red-100' : 'border-gray-200/80 focus:border-blue-400 focus:ring-blue-100'
                  } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all shadow-xs`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  {...register('confirmPassword')}
                  className={`w-full h-12 px-4 pr-12 rounded-xl bg-white/75 border ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-100' : 'border-gray-200/80 focus:border-blue-400 focus:ring-blue-100'
                  } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all shadow-xs`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-[15px] transition-all transform active:scale-[0.99] shadow-sm flex items-center justify-center mt-2"
            >
              {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Save New Password'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200/80 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium underline underline-offset-2 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

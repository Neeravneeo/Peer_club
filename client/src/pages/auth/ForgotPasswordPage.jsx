import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CloudBackground } from '../../components/CloudBackground';
import { BrainIcon, EnvelopeIcon, Spinner } from '../../components/auth/AuthIcons';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
      toast.error(err.message || 'Error sending reset email');
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
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] p-8 sm:p-10 pt-14 sm:pt-16 text-center">
          {sent ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                <EnvelopeIcon className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                Check your email
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                We sent a password reset link to <strong className="text-gray-800 font-semibold">{email}</strong>.
              </p>
              <div className="pt-4 border-t border-gray-200/80">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight font-serif">
                Reset your password
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed font-sans">
                Enter your account email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">
                    Account Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full h-12 px-4 rounded-xl bg-white/75 border ${
                      error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200/80 focus:border-blue-400 focus:ring-blue-100'
                    } text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all shadow-xs`}
                    required
                  />
                  {error && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-[15px] transition-all transform active:scale-[0.99] shadow-sm flex items-center justify-center"
                >
                  {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200/80 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium underline underline-offset-2 transition-colors"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

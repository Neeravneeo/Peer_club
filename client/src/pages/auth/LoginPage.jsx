import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CloudBackground } from '../../components/CloudBackground';
import { BrainIcon, GoogleIcon, EyeIcon, EyeOffIcon, Spinner } from '../../components/auth/AuthIcons';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes('email not confirmed')) {
          navigate('/verify-email', { state: { email } });
          return;
        }
        throw authError;
      }

      if (data?.user) {
        toast.success('Welcome back!');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      toast.error(err.message || 'Failed to connect with Google');
      setGoogleLoading(false);
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
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed font-sans">
            Sign in to your Peer Club account to continue your streak.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">
                Your Email
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-white/75 border border-gray-200/80 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right pt-0.5">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-[15px] transition-all transform active:scale-[0.99] shadow-sm flex items-center justify-center"
            >
              {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Continue'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200/80" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200/80" />
          </div>

          {/* SSO Options (Google only) */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-12 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 text-[15px] font-medium text-gray-700 transition-colors shadow-xs"
            >
              {googleLoading ? <Spinner className="w-5 h-5 animate-spin text-gray-600" /> : <GoogleIcon className="w-5 h-5" />}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Legal Disclaimers */}
          <div className="mt-8 text-center space-y-2">
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

          {/* Switch to Register */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

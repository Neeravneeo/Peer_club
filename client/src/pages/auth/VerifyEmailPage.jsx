import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CloudBackground } from '../../components/CloudBackground';
import { BrainIcon, EnvelopeIcon, CheckCircleIcon, Spinner } from '../../components/auth/AuthIcons';
import { toast } from 'sonner';

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email || 'your email';

  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Periodic check if session has become active (verified in another tab)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setVerified(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
    };

    const interval = setInterval(checkSession, 4000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });
      if (error) throw error;
      toast.success('Verification link resent!');
      setCooldown(60);
    } catch (err) {
      toast.error(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
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
          {verified ? (
            <div className="py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                Email verified!
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Redirecting to your study dashboard in a moment...
              </p>
              <div className="pt-2">
                <Spinner className="w-6 h-6 mx-auto text-emerald-600 animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {/* Envelope Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                <EnvelopeIcon className="w-10 h-10" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight font-serif">
                Check your inbox
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed font-sans">
                We sent a verification link to <strong className="text-gray-800 font-semibold">{userEmail}</strong>. Please click the link to activate your account.
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                  className="w-full h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-medium text-[15px] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <>
                      <Spinner className="w-4 h-4 animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    'Resend Email'
                  )}
                </button>

                <div className="pt-4 border-t border-gray-200/80">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;

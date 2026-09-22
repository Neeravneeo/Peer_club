import React, { useState } from 'react';
import { Shield, Lock, Laptop, AlertTriangle, Key } from 'lucide-react';

/**
 * SecuritySection Component
 * Password changes, active sessions, and Danger Zone.
 */
export const SecuritySection = ({
  onChangePassword,
  onDeleteAccountClick,
  onSignOutCurrent,
  isPasswordLoading = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    onChangePassword({ currentPassword, newPassword, confirmPassword }, () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  };

  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-24px leading-[1.4] tracking-[-0.72px] text-[var(--color-ink)] flex items-center gap-2.5 font-normal">
          <Shield className="w-6 h-6 text-[var(--color-graphite)]" />
          <span>Security & Account</span>
        </h2>
        <div className="w-12 h-0.5 bg-[var(--color-graphite)] rounded-full mt-2" />
      </div>

      {/* 1. Change Password Subsection */}
      <div className="mb-8 pb-8 border-b border-[var(--color-ash)]/60">
        <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-4 font-sans flex items-center gap-2">
          <Key className="w-4 h-4 text-[var(--color-stone)]" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-[var(--color-graphite)] mb-1.5 font-sans">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-graphite)] mb-1.5 font-sans">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-graphite)] mb-1.5 font-sans">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPasswordLoading || !newPassword}
            className="bg-[var(--color-ink)] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:shadow-md transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
          >
            {isPasswordLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* 2. Active Sessions */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-4 font-sans flex items-center gap-2">
          <Laptop className="w-4 h-4 text-[var(--color-stone)]" />
          <span>Active Sessions</span>
        </h3>

        <div className="flex items-center justify-between p-4 rounded-[14px] bg-[var(--color-linen)]/50 border border-[var(--color-ash)]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[var(--color-ash)]/60 flex items-center justify-center text-[var(--color-graphite)]">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-graphite)]">
                  Active Web Session
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-mint)]/20 text-emerald-950 text-xs font-semibold border border-[var(--color-mint)]/50">
                  Current
                </span>
              </div>
              <p className="text-xs text-[var(--color-stone)]">
                Local Device • Authenticated via Supabase
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOutCurrent}
            className="text-xs font-semibold text-[var(--color-azure)] hover:underline cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* 3. Danger Zone */}
      <div className="border-2 border-[var(--color-papaya)]/30 rounded-[20px] p-6 bg-[var(--color-papaya)]/5">
        <div className="flex items-center gap-2 text-[var(--color-papaya)] font-semibold mb-2 font-sans">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone</span>
        </div>

        <p className="text-sm text-[var(--color-graphite)] mb-4 font-sans leading-relaxed">
          Permanently delete your account, uploaded study documents, quizzes, and streak records. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={onDeleteAccountClick}
          className="bg-[var(--color-papaya)]/10 border-2 border-[var(--color-papaya)] text-[var(--color-papaya)] rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[var(--color-papaya)]/20 transition-all cursor-pointer"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;

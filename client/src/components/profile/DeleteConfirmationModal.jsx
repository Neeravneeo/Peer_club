import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteConfirmationModal Component
 * Safeguard modal requiring confirmation before account deletion.
 */
export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmDelete,
  isLoading = false,
  userEmail = '',
}) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const isValid =
    confirmText.trim().toUpperCase() === 'DELETE' ||
    (userEmail && confirmText.trim().toLowerCase() === userEmail.toLowerCase());

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-[var(--shadow-xl)] p-6 sm:p-8 max-w-md w-full border border-[var(--color-ash)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[var(--color-stone)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Bubble */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-papaya)]/15 border border-[var(--color-papaya)]/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-[var(--color-papaya)]" />
        </div>

        <h3 className="font-serif text-2xl text-center text-[var(--color-ink)] mb-2 font-normal">
          Delete Account?
        </h3>

        <p className="text-sm text-[var(--color-graphite)] text-center mb-6 leading-relaxed font-sans">
          This will permanently delete all your data including documents, quizzes, flashcards, and streaks. This action cannot be undone.
        </p>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] mb-2 text-center">
            Type <span className="text-[var(--color-papaya)] font-mono">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] text-sm text-center focus:outline-none focus:border-[var(--color-papaya)] focus:ring-2 focus:ring-[var(--color-papaya)]/20 transition-all font-sans"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] text-[var(--color-ink)] rounded-full py-3 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={!isValid || isLoading}
            className="flex-1 bg-[var(--color-papaya)] text-white rounded-full py-3 text-sm font-semibold transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

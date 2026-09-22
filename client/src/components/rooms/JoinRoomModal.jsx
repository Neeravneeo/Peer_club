import React, { useState } from 'react';
import { X, Key } from 'lucide-react';

export function JoinRoomModal({ isOpen, onClose, onJoin, isJoining }) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length >= 3) {
      onJoin(code.trim().toUpperCase());
    }
  };

  const handleInputChange = (val) => {
    setCode(val.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-8 max-w-md w-full border border-[var(--color-ash)] text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isJoining}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] flex items-center justify-center text-[var(--color-graphite)]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-3 text-amber-700">
          <Key className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-2xl text-[var(--color-ink)] font-normal mb-1">
          Join Study Circle
        </h3>
        <p className="text-xs text-[var(--color-stone)] mb-6">
          Enter the 6-character room invite code from your study buddy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={7}
              value={code}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="e.g. BIO-402"
              className="w-full max-w-[240px] h-14 rounded-[16px] border-2 border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-center font-mono text-2xl font-bold tracking-widest text-[var(--color-ink)] focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-400 placeholder:text-base"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isJoining || code.length < 3}
            className="w-full bg-[var(--color-ink)] hover:bg-gray-900 text-white rounded-full py-3.5 font-semibold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isJoining ? 'Joining Circle...' : 'Join Circle'}
          </button>
        </form>
      </div>
    </div>
  );
}

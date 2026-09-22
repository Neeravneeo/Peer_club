import React, { useState } from 'react';
import { Copy, Check, UploadCloud, Share2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function RoomHeader({ room, onUploadDoc, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);

  if (!room) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    toast.success('Room code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Room link copied to clipboard!');
  };

  return (
    <div className="border-b border-[var(--color-ash)]/60 pb-6 mb-6">
      {/* Title & Host row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--color-ink)] font-normal tracking-tight">
            {room.name} {room.icon || '👥'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[var(--color-stone)] mt-1">
            {room.host?.avatar && (
              <img
                src={room.host.avatar}
                alt={room.host.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span>Hosted by {room.host?.name || 'Scholar Peer'}</span>
            <span>•</span>
            <span>Created Sep 2026</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onUploadDoc}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-lime-400 hover:bg-lime-500 text-gray-950 text-xs font-semibold shadow-xs transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[var(--color-ash)] text-xs font-medium text-[var(--color-graphite)] hover:bg-[var(--color-linen)] transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={onLeaveRoom}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Code capsule & Live Online status */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-linen)]/80 border border-[var(--color-ash)] text-xs font-mono text-[var(--color-ink)]">
          <span className="text-[var(--color-stone)] font-sans">Code:</span>
          <span className="font-bold tracking-wider">{room.roomCode}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{room.onlineCount || 3} Peers Online Now</span>
        </div>

        {room.studyGoal && (
          <div className="text-xs text-[var(--color-stone)] italic truncate max-w-sm">
            "{room.studyGoal}"
          </div>
        )}
      </div>
    </div>
  );
}

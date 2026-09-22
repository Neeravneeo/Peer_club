import React from 'react';
import { Copy, Users, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

export function RoomCard({ room, isSelected, onSelect, onEnter }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    toast.success(`Copied room code "${room.roomCode}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBio = room.subjectTag?.toLowerCase().includes('bio');
  const isCS = room.subjectTag?.toLowerCase().includes('cs') || room.subjectTag?.toLowerCase().includes('computer');
  const isMed = room.subjectTag?.toLowerCase().includes('med');
  const isMath = room.subjectTag?.toLowerCase().includes('math');

  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
  if (isBio) badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  else if (isCS) badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  else if (isMed) badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  else if (isMath) badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-[22px] border-2 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
          : 'border-[var(--color-ash)]/70 bg-white hover:border-emerald-500 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Card Header: Subject Tag + Privacy */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
            <span>{room.icon || '📚'}</span>
            <span>{room.subjectTag}</span>
          </span>
          <span className="text-[11px] font-medium text-[var(--color-stone)]">
            {room.isPrivate ? '🔒 Private' : '🌐 Public'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[19px] font-medium text-[var(--color-ink)] leading-snug group-hover:text-emerald-950 transition-colors line-clamp-1 mb-2">
          {room.name}
        </h3>

        {/* Online & Members Indicator */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-graphite)] mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {room.onlineCount || 2} studying now • {room.memberCount || room.members?.length || 8} members
          </span>
        </div>

        {/* Members Facepile */}
        <div className="flex items-center -space-x-2 mb-3">
          {room.members?.slice(0, 3).map((m, idx) => (
            <img
              key={idx}
              src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`}
              alt={m.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
            />
          ))}
          <div className="w-7 h-7 rounded-full bg-[var(--color-linen)] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[var(--color-graphite)]">
            +{Math.max(1, (room.memberCount || 10) - 3)}
          </div>
        </div>

        {/* Vault stats */}
        <div className="text-xs text-[var(--color-stone)] flex items-center gap-2 mb-3">
          <FileText className="w-3.5 h-3.5 text-[var(--color-azure)]" />
          <span>
            {room.documents?.length || 8} Docs • {room.leaderboard?.length || 4} Quizzes
          </span>
        </div>
      </div>

      {/* Code capsule & Enter button */}
      <div className="pt-3 border-t border-[var(--color-ash)]/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-graphite)]">
          <span>Code: {room.roomCode}</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="w-6 h-6 rounded-full bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] flex items-center justify-center text-[var(--color-stone)] hover:text-[var(--color-ink)] transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnter(room);
          }}
          className="px-3 py-1 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold hover:shadow-xs transition-all"
        >
          Enter →
        </button>
      </div>
    </div>
  );
}

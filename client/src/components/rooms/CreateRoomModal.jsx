import React, { useState } from 'react';
import { X, Plus, Shield, Globe } from 'lucide-react';

export function CreateRoomModal({ isOpen, onClose, onCreate, isCreating }) {
  const [name, setName] = useState('');
  const [subjectTag, setSubjectTag] = useState('Biology');
  const [isPrivate, setIsPrivate] = useState(false);
  const [studyGoal, setStudyGoal] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      subjectTag,
      isPrivate,
      studyGoal: studyGoal.trim(),
    });
  };

  const subjectOptions = [
    'Biology',
    'Computer Science',
    'Mathematics',
    'Medicine',
    'History',
    'Physics',
    'Chemistry',
    'Economics',
    'Law',
    'Psychology',
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-8 max-w-lg w-full border border-[var(--color-ash)] overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isCreating}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] flex items-center justify-center text-[var(--color-graphite)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-emerald-950 text-xs font-semibold mb-2">
            Study Circles
          </div>
          <h2 className="font-serif text-2xl md:text-[28px] text-[var(--color-ink)] font-normal tracking-tight">
            Create Study Circle
          </h2>
          <p className="text-xs text-[var(--color-graphite)] mt-1">
            Start a collaborative study room with your peers to share documents and take synced quizzes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-1.5">
              Room Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Biochem Sprint 2026"
              className="w-full h-11 px-4 rounded-[14px] border-2 border-[var(--color-ash)] bg-[var(--color-linen)]/20 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {/* Subject Tag */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-1.5">
              Subject Tag
            </label>
            <select
              value={subjectTag}
              onChange={(e) => setSubjectTag(e.target.value)}
              className="w-full h-11 px-4 rounded-[14px] border-2 border-[var(--color-ash)] bg-[var(--color-linen)]/20 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            >
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-1.5">
              Privacy Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-3 rounded-[16px] border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                  !isPrivate
                    ? 'border-gray-900 bg-gray-50 shadow-xs'
                    : 'border-[var(--color-ash)] bg-white text-[var(--color-stone)] hover:border-gray-400'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--color-ink)]">🌐 Public</div>
                  <div className="text-[10px] text-[var(--color-stone)]">Visible to all</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-3 rounded-[16px] border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                  isPrivate
                    ? 'border-gray-900 bg-gray-50 shadow-xs'
                    : 'border-[var(--color-ash)] bg-white text-[var(--color-stone)] hover:border-gray-400'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--color-ink)]">🔒 Private</div>
                  <div className="text-[10px] text-[var(--color-stone)]">Passcode required</div>
                </div>
              </button>
            </div>
          </div>

          {/* Study Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-1.5">
              Study Goal (Optional)
            </label>
            <textarea
              rows={2}
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              placeholder="e.g., Aiming for 15 hours/week together before the midterm"
              className="w-full p-3 rounded-[14px] border-2 border-[var(--color-ash)] bg-[var(--color-linen)]/20 text-xs focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-gray-950 rounded-full py-3 font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Creating Room...' : 'Create Study Circle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

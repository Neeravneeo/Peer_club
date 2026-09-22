import React from 'react';
import { User, Save } from 'lucide-react';
import { AvatarPicker } from './AvatarPicker';
import { SubjectChips } from './SubjectChips';

export const STUDY_GOAL_OPTIONS = [
  'Semester Exams',
  'Competitive Tests (GATE/CAT/UPSC)',
  'Daily Revision',
  'Research Projects',
  'Skill Development',
];

/**
 * AboutSection Component
 * Personal profile details form.
 */
export const AboutSection = ({
  name = '',
  setName,
  bio = '',
  setBio,
  avatar = '🎓',
  setAvatar,
  subjects = [],
  onToggleSubject,
  studyGoal = 'Semester Exams',
  setStudyGoal,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-24px leading-[1.4] tracking-[-0.72px] text-[var(--color-ink)] flex items-center gap-2.5 font-normal">
          <User className="w-6 h-6 text-emerald-800" />
          <span>About</span>
        </h2>
        <div className="w-12 h-0.5 bg-[var(--color-mint)] rounded-full mt-2" />
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 1. Display Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-graphite)] mb-2 font-sans">
            Display Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Neerav Goyal"
            className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans"
          />
        </div>

        {/* 2. Bio / Study Motto */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[var(--color-graphite)] font-sans">
              Bio / Study Motto
            </label>
            <span className="text-xs text-[var(--color-stone)]">
              {bio.length} / 150
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Pre-med student focusing on biochemistry and active recall..."
            className="w-full h-24 p-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm text-[var(--color-ink)] resize-none focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans"
          />
        </div>

        {/* 3. Avatar Presets */}
        <AvatarPicker selectedAvatar={avatar} onSelect={setAvatar} />

        {/* 4. Study Subjects Multi-Select */}
        <SubjectChips
          selectedSubjects={subjects}
          onToggleSubject={onToggleSubject}
        />

        {/* 5. Primary Study Goal Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-graphite)] mb-2 font-sans">
            Primary Study Goal
          </label>
          <select
            value={studyGoal}
            onChange={(e) => setStudyGoal(e.target.value)}
            className="w-full h-12 px-4 rounded-[14px] border border-[var(--color-ash)] bg-[var(--color-linen)]/30 text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all font-sans cursor-pointer"
          >
            {STUDY_GOAL_OPTIONS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Save Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--color-ink)] text-white rounded-full py-3.5 px-6 text-sm font-semibold hover:shadow-[var(--shadow-md)] transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 text-[var(--color-mint)]" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AboutSection;

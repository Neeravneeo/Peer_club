import React from 'react';

export const AVATAR_PRESETS = ['🎓', '💻', '🔬', '📚', '⚡', '🧠', '🚀', '🎨'];

/**
 * AvatarPicker Component
 * Grid of preset emojis for profile avatar selection.
 */
export const AvatarPicker = ({ selectedAvatar = '🎓', onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-graphite)] mb-2 font-sans">
        Choose Avatar
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-6">
        {AVATAR_PRESETS.map((emoji) => {
          const isSelected = selectedAvatar === emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              className={`w-full aspect-square rounded-[14px] border-2 bg-white transition-all flex items-center justify-center text-2xl sm:text-3xl cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-mint)] bg-[var(--color-mint)]/15 shadow-sm scale-105'
                  : 'border-[var(--color-ash)] hover:border-[var(--color-mint)]/60 hover:shadow-xs'
              }`}
              title={`Select ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;

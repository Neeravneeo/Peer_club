import React, { useState } from 'react';
import { X, Clock, BookOpen, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { triggerStreakActivity } from '@/components/StreakCard';

/**
 * LogSessionModal in Craft Docs Scrapbook Style
 */
export const LogSessionModal = ({ isOpen, onClose, onSessionLogged }) => {
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [subject, setSubject] = useState('General Study');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickDurations = [15, 30, 45, 60];
  const studyTypes = ['Deep Work', 'Quiz Review', 'Flashcards', 'Reading'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const parsedDuration = parseInt(durationMinutes, 10) || 30;

      // Attempt to save session to backend /sessions endpoint
      try {
        await api.post('/sessions', {
          duration: parsedDuration,
          subject,
          notes,
          startTime: new Date(Date.now() - parsedDuration * 60 * 1000).toISOString(),
          endTime: new Date().toISOString(),
        });
      } catch (err) {
        // Fallback or dev mode logging
        console.warn('Session API notice:', err.message);
      }

      // Sync streak tracking
      await triggerStreakActivity('session');

      toast.success(`Logged ${parsedDuration} minutes of study! 🎉`);
      onSessionLogged?.(parsedDuration);
      onClose();
    } catch (err) {
      toast.error('Could not log study session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-craft-card shadow-craft-xl w-full max-w-md p-8 relative border border-ash/50 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-linen hover:bg-cloud flex items-center justify-center text-graphite transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-marigold/30 flex items-center justify-center text-amber-950">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-[24px] leading-[1.3] tracking-craft-subheading text-ink font-normal">
            Log Study Session
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Duration Selector */}
          <div>
            <label className="text-[13px] font-medium text-graphite mb-2 block font-sans">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="600"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full h-11 rounded-[14px] border border-ash px-4 text-[14px] text-ink focus:outline-none focus:border-azure focus:ring-2 focus:ring-azure/20 transition-all font-sans"
              required
            />
            {/* Quick Pick Pills */}
            <div className="flex items-center gap-2 mt-2.5">
              {quickDurations.map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`rounded-craft-pill px-3.5 py-1 text-[12px] font-medium border transition-all ${
                    Number(durationMinutes) === mins
                      ? 'bg-ink text-white border-ink'
                      : 'border-ash text-graphite hover:bg-linen'
                  }`}
                >
                  {mins === 60 ? '1 hr' : `${mins} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Study Type Pills */}
          <div>
            <label className="text-[13px] font-medium text-graphite mb-2 block font-sans">
              Study Activity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {studyTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSubject(type)}
                  className={`px-3 py-2 rounded-xl text-[12px] font-medium border text-center transition-all ${
                    subject === type
                      ? 'bg-mint/30 text-emerald-950 border-mint/70 font-semibold'
                      : 'border-ash/80 text-graphite hover:bg-linen'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <label className="text-[13px] font-medium text-graphite mb-1.5 block font-sans">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn or revise today?"
              className="w-full h-20 rounded-[14px] border border-ash p-3 text-[13px] text-ink focus:outline-none focus:border-azure focus:ring-2 focus:ring-azure/20 resize-none font-sans"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink hover:bg-graphite text-white rounded-[14px] py-3 text-[14px] font-semibold transition-all shadow-craft-sm hover:shadow-craft-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-4 h-4 text-mint" />
                <span>Save Study Session</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogSessionModal;

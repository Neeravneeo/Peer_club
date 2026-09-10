import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Clock, Sparkles, CheckCircle2, Flame } from 'lucide-react'

export function LogStudyModal({ open, onOpenChange }) {
  const queryClient = useQueryClient()
  const [duration, setDuration] = useState(25)
  const [sessionType, setSessionType] = useState('work')
  const [loading, setLoading] = useState(false)

  const PRESET_DURATIONS = [15, 25, 45, 60, 90]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!duration || duration <= 0) {
      toast.error('Please enter a valid study duration')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/sessions', {
        durationMinutes: Number(duration),
        sessionType,
        completed: true,
      })

      const { newStreak, totalStudyMinutes, badgesAwarded } = res.data

      toast.success(
        `Logged ${duration} mins of study! Streak: ${newStreak} days 🔥`
      )

      if (badgesAwarded && badgesAwarded.length > 0) {
        badgesAwarded.forEach((badgeName) => {
          toast.success(`🎉 New Badge Unlocked: ${badgeName}!`, {
            duration: 6000,
          })
        })
      }

      // Invalidate queries to refresh dashboard and profile instantly
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })

      onOpenChange(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log study session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-voltage-lime text-true-black">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-ash">
              Accountability Tracker
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-carbon-ink">
            Log Study Session
          </DialogTitle>
          <DialogDescription className="text-xs text-ash">
            Record your study time to update your daily streak and earn consistency badges.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-ash">Quick Presets</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDuration(preset)}
                  className={`py-2 px-1 text-center rounded-[12px] text-xs font-bold border transition-all ${
                    Number(duration) === preset
                      ? 'bg-voltage-lime text-true-black border-black/20 shadow-sm'
                      : 'bg-surface-elevated text-ash border-border hover:text-carbon-ink hover:border-true-black/40'
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-duration" className="text-xs font-bold text-ash">
              Custom Duration (Minutes)
            </Label>
            <div className="relative">
              <Input
                id="custom-duration"
                type="number"
                min="1"
                max="360"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="pl-9"
                required
              />
              <Clock className="w-4 h-4 text-ash absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-ash">Session Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'work', label: 'Deep Focus' },
                { type: 'short_break', label: 'Flashcards' },
                { type: 'long_break', label: 'Exam Review' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSessionType(item.type)}
                  className={`py-2 px-2 text-center rounded-[12px] text-xs font-semibold border transition-all ${
                    sessionType === item.type
                      ? 'bg-carbon-ink text-pure-white border-transparent'
                      : 'bg-surface-elevated text-ash border-border hover:text-carbon-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-xs gap-1.5"
            >
              {loading ? (
                'Logging...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Save Study Time
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

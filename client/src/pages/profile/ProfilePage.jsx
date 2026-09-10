import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  User,
  Mail,
  Lock,
  Bell,
  Award,
  Trash2,
  CheckCircle2,
  Sparkles,
  Shield,
  Save,
  Flame,
  Clock,
  BookOpen,
} from 'lucide-react'

const AVAILABLE_SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Economics',
  'History',
  'Psychology',
  'Medicine',
  'Literature',
  'Engineering',
  'Law',
]

const AVATAR_PRESETS = ['🎓', '💻', '🔬', '📚', '⚡', '🧠', '🚀', '🎨']

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()

  // Fetch full profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await api.get('/users/me')
      return res.data.user
    },
  })

  // Fetch badges with earned status
  const { data: badgesData } = useQuery({
    queryKey: ['user-badges'],
    queryFn: async () => {
      const res = await api.get('/users/me/badges')
      return res.data.badges
    },
  })

  // Form states
  const [name, setName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🎓')
  const [selectedSubjects, setSelectedSubjects] = useState([])

  // Password change states
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Preferences states
  const [preferences, setPreferences] = useState({
    emailWeeklySummary: true,
    emailStreakAlert: true,
    emailBadgeAlert: true,
    emailInactivityAlert: true,
    emailDocumentReminder: true,
  })

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Initialize fields once profile loads
  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '')
      setSelectedAvatar(profileData.avatarUrl || '🎓')
      setSelectedSubjects(profileData.subjects || [])
      if (profileData.preferences) {
        setPreferences({
          emailWeeklySummary: profileData.preferences.emailWeeklySummary ?? true,
          emailStreakAlert: profileData.preferences.emailStreakAlert ?? true,
          emailBadgeAlert: profileData.preferences.emailBadgeAlert ?? true,
          emailInactivityAlert: profileData.preferences.emailInactivityAlert ?? true,
          emailDocumentReminder: profileData.preferences.emailDocumentReminder ?? true,
        })
      }
    }
  }, [profileData])

  // Toggle subject
  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  // Update Profile Details mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/users/me', {
        name,
        avatarUrl: selectedAvatar,
        subjects: selectedSubjects,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    },
  })

  // Update Preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/users/me/preferences', preferences)
      return res.data
    },
    onSuccess: () => {
      toast.success('Email notification preferences saved!')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to save preferences')
    },
  })

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setPasswordLoading(true)
      await api.post('/users/me/change-password', { newPassword })
      toast.success('Password changed successfully!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true)
      await api.delete('/users/me')
      toast.success('Your account has been deleted')
      signOut()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  const badges = badgesData || []
  const earnedCount = badges.filter((b) => b.isEarned).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-voltage-lime border-t-true-black rounded-full animate-spin" />
          <p className="text-sm text-ash font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-[28px] bg-surface-elevated border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-voltage-lime to-cyan-spark flex items-center justify-center text-3xl shadow-sm shrink-0 border border-black/10">
            {selectedAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-carbon-ink tracking-tight font-sans">
                {profileData?.name || 'Peer Student'}
              </h1>
              <Badge variant="lime" className="text-[11px] font-bold">
                Student
              </Badge>
            </div>
            <p className="text-sm text-ash mt-0.5">{profileData?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 rounded-[16px] bg-pure-white border border-border text-center">
            <p className="text-xs text-ash font-medium">Streak</p>
            <p className="text-base font-bold text-carbon-ink">
              {profileData?.currentStreakDays || 0}d 🔥
            </p>
          </div>
          <div className="px-4 py-2 rounded-[16px] bg-pure-white border border-border text-center">
            <p className="text-xs text-ash font-medium">Badges</p>
            <p className="text-base font-bold text-carbon-ink">
              {earnedCount} / {badges.length || 10} 🏆
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Personal Details, Preferences, Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card className="rounded-[24px] border-border bg-pure-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-voltage-lime fill-true-black" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs text-ash">
                Update your display name, avatar, and study subjects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-ash uppercase tracking-wider">
                  Choose Avatar Icon
                </Label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedAvatar(preset)}
                      className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-xl border transition-all ${
                        selectedAvatar === preset
                          ? 'bg-voltage-lime border-black/30 scale-110 shadow-sm'
                          : 'bg-surface-elevated border-border hover:bg-surface-subtle'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-xs font-bold text-ash uppercase tracking-wider">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Subjects Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-ash uppercase tracking-wider">
                    Study Subjects
                  </Label>
                  <span className="text-[11px] text-ash">
                    {selectedSubjects.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj)
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleSubject(subj)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-voltage-lime text-true-black border-black/20 shadow-sm'
                            : 'bg-surface-elevated text-ash border-border hover:text-carbon-ink hover:border-black/30'
                        }`}
                      >
                        {subj}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => updateProfileMutation.mutate()}
                  disabled={updateProfileMutation.isPending}
                  className="gap-2 text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences (n8n Retention Toggles) */}
          <Card className="rounded-[24px] border-border bg-pure-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-voltage-lime fill-true-black" />
                Automated Email & Study Notifications
              </CardTitle>
              <CardDescription className="text-xs text-ash">
                Configure which automated retention digests and reminders you wish to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'emailWeeklySummary',
                  title: 'Weekly Progress Report',
                  desc: 'Comprehensive summary of weekly study hours, quiz scores, and recommendations.',
                },
                {
                  key: 'emailStreakAlert',
                  title: 'Daily Streak Reminder',
                  desc: 'Timely nudge before midnight to protect your active study streak.',
                },
                {
                  key: 'emailBadgeAlert',
                  title: 'Achievement & Badge Unlocks',
                  desc: 'Celebrate milestones and earned honors directly in your inbox.',
                },
                {
                  key: 'emailInactivityAlert',
                  title: 'Inactivity Re-engagement',
                  desc: 'Encouraging study motivation if no focus sessions are logged for 3 consecutive days.',
                },
                {
                  key: 'emailDocumentReminder',
                  title: 'Document & Exam Reminders',
                  desc: 'Prompts to test active recall on recently uploaded documents and flashcard decks.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-4 p-3.5 rounded-[16px] bg-surface-elevated border border-border/60"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-carbon-ink text-sm">{item.title}</p>
                    <p className="text-xs text-ash">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 accent-black rounded cursor-pointer mt-0.5"
                  />
                </div>
              ))}

              <div className="pt-2">
                <Button
                  onClick={() => updatePreferencesMutation.mutate()}
                  disabled={updatePreferencesMutation.isPending}
                  variant="outline"
                  className="gap-2 text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Notification Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Password */}
          <Card className="rounded-[24px] border-border bg-pure-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-voltage-lime fill-true-black" />
                Account Security
              </CardTitle>
              <CardDescription className="text-xs text-ash">
                Update your login password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-xs font-bold text-ash uppercase tracking-wider">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-xs font-bold text-ash uppercase tracking-wider">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="gap-2 text-xs font-bold"
                >
                  <Shield className="w-4 h-4" />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="rounded-[24px] border-red-200 bg-red-50/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-red-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-xs text-red-600/80">
                Permanently delete your account, study history, quizzes, and uploaded documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-xs font-bold gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Badges Grid Showcase */}
        <div className="space-y-6">
          <Card className="rounded-[24px] border-border bg-pure-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-voltage-lime fill-true-black" />
                  Badge Catalog
                </CardTitle>
                <Badge variant="outline" className="text-xs font-bold">
                  {earnedCount}/{badges.length} Unlocked
                </Badge>
              </div>
              <CardDescription className="text-xs text-ash">
                Earn badges by maintaining study streaks and mastering AI quizzes.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-[18px] border transition-all flex items-start gap-3.5 ${
                    badge.isEarned
                      ? 'bg-gradient-to-r from-voltage-lime/15 via-pure-white to-pure-white border-voltage-lime/60 shadow-sm'
                      : 'bg-surface-elevated border-border/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 shadow-sm ${
                      badge.isEarned
                        ? 'bg-gradient-to-tr from-voltage-lime to-cyan-spark text-true-black'
                        : 'bg-surface-subtle text-ash'
                    }`}
                  >
                    {badge.isEarned ? '🏆' : '🔒'}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-xs text-carbon-ink truncate">
                        {badge.name}
                      </p>
                      {badge.isEarned && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          Earned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ash leading-snug">
                      {badge.description}
                    </p>
                    {!badge.isEarned && (
                      <p className="text-[10px] font-semibold text-carbon-ink pt-0.5">
                        Target: {badge.threshold} {badge.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-ash">
              This action is permanent and cannot be undone. All your saved documents, quiz attempts, study streak data, and account preferences will be removed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

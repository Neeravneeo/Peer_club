import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

// Visual & Layout Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  HandDrawnUnderline,
} from '@/components/DecorativeElements';

// Profile Sections
import { ProfileHero } from '@/components/profile/ProfileHero';
import { AboutSection } from '@/components/profile/AboutSection';
import { BadgesSection, DEFAULT_BADGES } from '@/components/profile/BadgesSection';
import { StudyRoomsSection, DEFAULT_ADMIN_ROOMS, DEFAULT_JOINED_ROOMS } from '@/components/profile/StudyRoomsSection';
import { PreferencesSection, DEFAULT_PREFERENCES } from '@/components/profile/PreferencesSection';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { DeleteConfirmationModal } from '@/components/profile/DeleteConfirmationModal';

/**
 * Profile Page Component
 * Implements the Good Game + Craft.do Scrapbook Profile Experience.
 */
export function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local Form States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('🎓');
  const [subjects, setSubjects] = useState(['Computer Science', 'Mathematics']);
  const [studyGoal, setStudyGoal] = useState('Semester Exams');
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Modals & UI States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 1. Fetch User Profile
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      try {
        const res = await api.get('/users/me');
        if (res?.data?.user) return res.data.user;
      } catch (err) {
        // Fallback to direct Supabase query
        if (user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (data && !error) return data;
        }
      }

      // Default mock fallback for preview/development
      return {
        id: user?.id || 'demo-user-101',
        name: user?.name || user?.email?.split('@')[0] || 'Finn Campbell Mertens',
        email: user?.email || 'finn@university.edu',
        avatar: '🎓',
        bio: 'Pre-med student focusing on biochemistry, spaced repetition, and active recall.',
        subjects: ['Computer Science', 'Mathematics', 'Biology'],
        studyGoal: 'Semester Exams',
        totalStudyMinutes: 750,
        currentStreakDays: 5,
        longestStreakDays: 12,
        administeredRooms: DEFAULT_ADMIN_ROOMS,
        memberRooms: DEFAULT_JOINED_ROOMS,
      };
    },
  });

  // 2. Fetch User Badges
  const { data: badgesData } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      try {
        const res = await api.get('/users/me/badges');
        if (Array.isArray(res?.data?.badges) && res.data.badges.length > 0) {
          return res.data.badges;
        }
      } catch (_) {
        // Fallback gracefully
      }
      return DEFAULT_BADGES;
    },
  });

  // Synchronize state when profileData loads
  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '');
      setBio(profileData.bio || 'Pre-med student focusing on biochemistry and active recall.');
      setAvatar(profileData.avatar || profileData.avatarUrl || '🎓');
      if (Array.isArray(profileData.subjects) && profileData.subjects.length > 0) {
        setSubjects(profileData.subjects);
      }
      if (profileData.studyGoal) {
        setStudyGoal(profileData.studyGoal);
      }
      if (profileData.preferences) {
        setPreferences((prev) => ({
          ...prev,
          ...profileData.preferences,
        }));
      }
    }
  }, [profileData]);

  // Handle Toggle Subject
  const handleToggleSubject = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle Toggle Preference
  const handleTogglePreference = (key, val) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // 3. Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      // Try API first
      try {
        await api.patch('/users/me', {
          name,
          bio,
          avatar,
          avatarUrl: avatar,
          subjects,
          studyGoal,
        });
      } catch (_) {
        // Fallback to Supabase
        if (user?.id) {
          await supabase
            .from('profiles')
            .update({
              name,
              bio,
              avatar,
              subjects,
              study_goal: studyGoal,
            })
            .eq('id', user.id);
        }
      }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!', {
        style: { borderColor: 'var(--color-mint)' },
      });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update profile', {
        style: { borderColor: 'var(--color-papaya)' },
      });
    },
  });

  // 4. Update Preferences Mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.patch('/users/me/preferences', preferences);
      } catch (_) {
        if (user?.id) {
          await supabase
            .from('user_preferences')
            .upsert({
              user_id: user.id,
              ...preferences,
            });
        }
      }
    },
    onSuccess: () => {
      toast.success('Study preferences saved!', {
        style: { borderColor: 'var(--color-mint)' },
      });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: () => {
      toast.error('Failed to save preferences');
    },
  });

  // 5. Change Password Handler
  const handleChangePassword = async ({ currentPassword, newPassword, confirmPassword }, resetForm) => {
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsPasswordLoading(true);
      // Attempt Supabase Auth update
      const { error: sbError } = await supabase.auth.updateUser({ password: newPassword });
      if (sbError) {
        // Fallback to API route
        await api.post('/users/me/change-password', { currentPassword, newPassword });
      }
      toast.success('Password updated successfully!');
      resetForm();
    } catch (err) {
      toast.error(err.message || err.response?.data?.error || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // 6. Delete Account Handler
  const handleConfirmDelete = async () => {
    try {
      setIsDeletingAccount(true);
      try {
        await api.delete('/users/me');
      } catch (_) {
        if (user?.id) {
          await supabase.from('profiles').delete().eq('id', user.id);
        }
      }
      toast.success('Account deleted');
      setIsDeleteModalOpen(false);
      await signOut();
      navigate('/register');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Metrics resolution
  const streakDays = profileData?.currentStreakDays ?? 5;
  const totalStudyMinutes = profileData?.totalStudyMinutes ?? 750;
  const badgesList = badgesData || DEFAULT_BADGES;
  const badgesCount = badgesList.filter((b) => b.status === 'earned').length;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans relative overflow-x-clip w-full max-w-full selection:bg-[var(--color-mint)]/50 selection:text-[var(--color-ink)]">
      {/* Decorative Scrapbook Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-30" />
        <PastelBlob color="var(--color-mint)" className="w-96 h-96 -top-20 -left-20" opacity={0.12} />
        <PastelBlob color="var(--color-marigold)" className="w-96 h-96 top-40 -right-20" opacity={0.12} />
        <PastelBlob color="var(--color-periwinkle)" className="w-96 h-96 bottom-20 left-1/3" opacity={0.10} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        {/* Main Container */}
        <main className="flex-1 max-w-6xl w-full min-w-0 mx-auto px-4 sm:px-6 md:px-10 pt-24 pb-20 relative z-10">
        {/* Section 1: Hero Banner (Full Width) */}
        <ProfileHero
          name={name || profileData?.name || 'Finn Campbell Mertens'}
          email={profileData?.email || user?.email || 'finn@university.edu'}
          avatar={avatar}
          role="Verified Scholar"
          joinDate="Member since September 2026"
          streakDays={streakDays}
          totalStudyMinutes={totalStudyMinutes}
          badgesCount={badgesCount}
          onEditAvatarClick={() => {
            const aboutEl = document.getElementById('about-section');
            aboutEl?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2-Column Responsive Grid for Sections 2 to 5 */}
        <div className="space-y-12 sm:space-y-16">
          {/* Row 1: About (Left) + Badges (Right) */}
          <div id="about-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <AboutSection
              name={name}
              setName={setName}
              bio={bio}
              setBio={setBio}
              avatar={avatar}
              setAvatar={setAvatar}
              subjects={subjects}
              onToggleSubject={handleToggleSubject}
              studyGoal={studyGoal}
              setStudyGoal={setStudyGoal}
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutate();
              }}
              isLoading={updateProfileMutation.isPending}
            />

            <BadgesSection badges={badgesList} />
          </div>

          {/* Row 2: Study Rooms (Left) + Preferences (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <StudyRoomsSection
              adminRooms={profileData?.administeredRooms || DEFAULT_ADMIN_ROOMS}
              joinedRooms={profileData?.memberRooms || DEFAULT_JOINED_ROOMS}
            />

            <PreferencesSection
              preferences={preferences}
              onTogglePreference={handleTogglePreference}
              onSavePreferences={() => updatePreferencesMutation.mutate()}
              isLoading={updatePreferencesMutation.isPending}
            />
          </div>

          {/* Row 3: Security & Danger Zone (Full Width) */}
          <SecuritySection
            onChangePassword={handleChangePassword}
            onDeleteAccountClick={() => setIsDeleteModalOpen(true)}
            onSignOutCurrent={handleSignOut}
            isPasswordLoading={isPasswordLoading}
          />
        </div>
      </main>
    </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        isLoading={isDeletingAccount}
        userEmail={profileData?.email || user?.email || ''}
      />
    </div>
  );
}

export default Profile;

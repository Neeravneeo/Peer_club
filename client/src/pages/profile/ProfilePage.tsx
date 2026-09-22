import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  User,
  Camera,
  Linkedin,
  Github,
  LogOut,
  Trash2,
  Lock,
  Save,
  Loader2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ─── Avatar presets ───────────────────────────────────────────────────────────
const AVATAR_PRESETS = [
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer1&backgroundColor=6d28d9",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer2&backgroundColor=7c3aed",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer3&backgroundColor=5b21b6",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer4&backgroundColor=4c1d95",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer5&backgroundColor=8b5cf6",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer6&backgroundColor=a78bfa",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer7&backgroundColor=7c3aed",
  "https://api.dicebear.com/8.x/bottts/svg?seed=peer8&backgroundColor=4338ca",
];

function countWords(str: string) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function ProfilePage() {
  const { user: authUser, signOut } = useAuth();
  const queryClient = useQueryClient();

  // ─── Fetch profile ────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.user;
    },
  });

  // ─── Local form state ─────────────────────────────────────────────────────
  const profile = data || {};
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Sync state once data loads
  React.useEffect(() => {
    if (data) {
      setName(data.name || "");
      setBio(data.bio || "");
      setLinkedin(data.linkedinUrl || "");
      setGithub(data.githubUrl || "");
      setAvatar(data.avatar || AVATAR_PRESETS[0]);
    }
  }, [data]);

  // ─── Update profile mutation ──────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/users/me", {
        name,
        bio,
        linkedinUrl: linkedin,
        githubUrl: github,
        avatar,
      });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to save profile");
    },
  });

  // ─── Password change ──────────────────────────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/me/change-password", {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to change password");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) return toast.error("Passwords do not match");
    if (newPw.length < 8) return toast.error("New password must be at least 8 characters");
    passwordMutation.mutate();
  };

  // ─── Delete account ───────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete("/users/me");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account deleted. Goodbye!");
      signOut();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete account");
    },
  });

  const wordCount = countWords(bio);
  const wordLimit = 150;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your identity, links, and account security.
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2 text-secondary hover:text-accent-red hover:border-accent-red"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: Avatar + Name + Bio + Links
          ════════════════════════════════════════════════════════════════════ */}
      <Card className="border-border bg-surface shadow-xl">
        <CardContent className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={avatar}
                alt="Profile avatar"
                className="w-24 h-24 rounded-full border-4 border-primary/40 shadow-lg shadow-primary/10 bg-surface-elevated object-cover"
              />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-white border-2 border-background hover:bg-primary/80 transition-colors"
                title="Change avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-lg">{name}</p>
              <p className="text-xs text-secondary">{profile.email}</p>
            </div>
          </div>

          <div className="border-t border-border/60" />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              maxLength={80}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <span
                className={`text-xs font-medium ${
                  wordCount > wordLimit
                    ? "text-accent-red"
                    : wordCount > wordLimit * 0.85
                    ? "text-accent-amber"
                    : "text-secondary"
                }`}
              >
                {wordCount} / {wordLimit} words
              </span>
            </div>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself — your subjects, goals, study style... (150 words max)"
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-white placeholder:text-secondary-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-colors"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn
              </Label>
              <div className="relative">
                <Input
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/your-name"
                  className="pr-9"
                />
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary-light"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-1.5">
                <Github className="w-4 h-4 text-white" />
                GitHub
              </Label>
              <div className="relative">
                <Input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className="pr-9"
                />
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary-light"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || wordCount > wordLimit}
            className="w-full gap-2 shadow-lg shadow-primary/20"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: Account Security
          ════════════════════════════════════════════════════════════════════ */}
      <Card className="border-border bg-surface shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary-light" />
            Account Security
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border">
            <div>
              <p className="text-sm font-semibold text-white">Password</p>
              <p className="text-xs text-secondary">
                Use a strong, unique password for your account.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: Danger Zone
          ════════════════════════════════════════════════════════════════════ */}
      <Card className="border-accent-red/30 bg-surface shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-bold text-accent-red flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent-red/5 border border-accent-red/20">
            <div>
              <p className="text-sm font-semibold text-white">Delete Account</p>
              <p className="text-xs text-secondary">
                Permanently delete your account and all your data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white gap-1.5 shrink-0 ml-4"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: Avatar Picker
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showAvatarPicker} onOpenChange={setShowAvatarPicker}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Pick one of the preset avatars for your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {AVATAR_PRESETS.map((src, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAvatar(src);
                  setShowAvatarPicker(false);
                }}
                className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                  avatar === src
                    ? "border-primary ring-2 ring-primary"
                    : "border-border"
                }`}
              >
                <img
                  src={src}
                  alt={`Avatar option ${idx + 1}`}
                  className="w-full h-full object-cover bg-surface-elevated"
                />
              </button>
            ))}
          </div>
          {avatar !== AVATAR_PRESETS[0] && (
            <p className="text-xs text-secondary text-center mt-1">
              Click "Save Profile" to apply this avatar.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: Change Password
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary-light">
              <Lock className="w-5 h-5" />
              <DialogTitle>Change Password</DialogTitle>
            </div>
            <DialogDescription>
              Choose a strong password with at least 8 characters.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="current-pw">Current Password</Label>
              <Input
                id="current-pw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Your current password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">New Password</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirm New Password</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                required
              />
              {confirmPw && newPw !== confirmPw && (
                <p className="text-xs text-accent-red flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              {confirmPw && newPw === confirmPw && newPw.length >= 8 && (
                <p className="text-xs text-accent-green flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={passwordMutation.isPending || newPw !== confirmPw || newPw.length < 8}
            >
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Update Password
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: Confirm Delete Account
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-accent-red">
              <AlertTriangle className="w-5 h-5" />
              <DialogTitle className="text-accent-red">Delete Account?</DialogTitle>
            </div>
            <DialogDescription>
              This action is <strong className="text-white">permanent and irreversible</strong>.
              All your documents, quizzes, flashcards, and progress will be erased immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/30 text-xs text-accent-red space-y-1">
              <p>• All uploaded documents will be deleted from Cloudinary</p>
              <p>• All AI quizzes and flashcard sets will be removed</p>
              <p>• Your study streak and badges will be lost forever</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                Type{" "}
                <strong className="font-mono text-accent-red">DELETE</strong>{" "}
                to confirm:
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="border-accent-red/30 focus:ring-accent-red"
              />
            </div>

            <Button
              onClick={() => deleteMutation.mutate()}
              disabled={
                deleteConfirmText !== "DELETE" || deleteMutation.isPending
              }
              className="w-full gap-2 bg-accent-red hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Permanently Delete Account
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

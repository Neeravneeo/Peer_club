import {
  Home,
  FileText,
  Brain,
  Layers,
  User,
  Users,
  Trophy,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export const PRIMARY_NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Documents', path: '/documents', icon: FileText },
  { label: 'AI Quizzes', path: '/quizzes', icon: Brain },
  { label: 'Flashcards', path: '/flashcards', icon: Layers },
  { label: 'Profile', path: '/profile', icon: User },
];

export const SECONDARY_NAV_ITEMS = [
  { label: 'Study Rooms', path: '/rooms', icon: Users },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Notifications', path: '/notifications', icon: Bell, hasBadge: true },
];

export const MOBILE_NAV_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Docs', path: '/documents', icon: FileText },
  { label: 'Quizzes', path: '/quizzes', icon: Brain },
  { label: 'Cards', path: '/flashcards', icon: Layers },
  { label: 'Profile', path: '/profile', icon: User },
];

export const UTILITY_NAV_ITEMS = [
  { label: 'Help', id: 'help', icon: HelpCircle },
  { label: 'Settings', path: '/profile', icon: Settings },
  { label: 'Log Out', id: 'logout', icon: LogOut, isAction: true, danger: true },
];

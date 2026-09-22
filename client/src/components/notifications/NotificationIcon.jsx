import React from 'react';
import { Heart, Brain, Folder, Flame, Trophy, Bell } from 'lucide-react';

export function NotificationIcon({ type }) {
  switch (type) {
    case 'cheer':
      return (
        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>
      );
    case 'quiz_result':
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
          <Brain className="w-5 h-5" />
        </div>
      );
    case 'room_activity':
      return (
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
          <Folder className="w-5 h-5" />
        </div>
      );
    case 'streak':
      return (
        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
          <Flame className="w-5 h-5 fill-amber-500" />
        </div>
      );
    case 'system':
      return (
        <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 flex-shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
          <Bell className="w-5 h-5" />
        </div>
      );
  }
}

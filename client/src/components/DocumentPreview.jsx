import React from 'react';
import {
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Target,
  FileText,
  Clock,
  ChevronRight,
  Bookmark
} from 'lucide-react';

/**
 * DocumentPreview component
 * Renders rich, dynamic scrapbook-style previews for documents
 */
export const DocumentPreview = ({ document = {} }) => {
  const previewType = document?.previewType || 'editor';

  // Preview 1: Editor preview with blocks & button
  if (previewType === 'editor') {
    return (
      <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-4.5 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
        <div className="space-y-2.5">
          {/* Simulated Title Block */}
          <div className="h-3.5 bg-[var(--color-ink)]/25 rounded-md w-3/4 animate-pulse" />
          
          {/* Paragraph Blocks */}
          <div className="space-y-1.5 pt-1">
            <div className="h-2 bg-[#d8d8d8] rounded w-full" />
            <div className="h-2 bg-[#e4e4e4] rounded w-5/6" />
          </div>

          {/* Mint Highlight Block */}
          <div className="h-11 bg-[var(--color-mint)]/35 rounded-xl border border-[var(--color-mint)]/60 px-3 flex items-center gap-2 text-[11px] font-sans text-[var(--color-ink)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="truncate font-medium">Type "/" for inline commands and formatting</span>
          </div>
        </div>

        {/* Ink Button Mockup */}
        <div className="pt-2 flex items-center justify-between">
          <div className="h-7 px-3.5 bg-[var(--color-ink)] text-white rounded-full flex items-center justify-center text-[11px] font-semibold shadow-xs">
            Start Writing
          </div>
          <span className="text-[10px] text-[var(--color-stone)] font-mono">markdown • blocks</span>
        </div>
      </div>
    );
  }

  // Preview 2: Feature grid with "The Basics", "Tasks & Scheduling", "Daily Notes"
  if (previewType === 'handbook') {
    return (
      <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-3.5 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
        <div className="text-[11px] font-semibold text-[var(--color-graphite)] font-sans flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Core Craft Modules</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-2 border border-[var(--color-ash)]/60 shadow-xs flex flex-col justify-between h-24">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-mint)]/40 flex items-center justify-center">
              <FileText className="w-3 h-3 text-emerald-800" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-ink)] leading-tight">The Basics</p>
              <p className="text-[9px] text-[var(--color-stone)]">Blocks & docs</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2 border border-[var(--color-ash)]/60 shadow-xs flex flex-col justify-between h-24">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-periwinkle)]/40 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-blue-800" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-ink)] leading-tight">Tasks</p>
              <p className="text-[9px] text-[var(--color-stone)]">Scheduling</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2 border border-[var(--color-ash)]/60 shadow-xs flex flex-col justify-between h-24">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-marigold)]/50 flex items-center justify-center">
              <Calendar className="w-3 h-3 text-amber-800" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-ink)] leading-tight">Daily Notes</p>
              <p className="text-[9px] text-[var(--color-stone)]">Calendar sync</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[10px] text-[var(--color-stone)]">
          <span>Explore 14 interactive chapters</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-stone)]" />
        </div>
      </div>
    );
  }

  // Preview 3: Video thumbnail with play button
  if (previewType === 'video') {
    return (
      <div className="flex-1 bg-[#1a1b22] mx-6 mb-5 rounded-[14px] overflow-hidden border border-black/10 flex flex-col justify-between p-4 min-h-[180px] relative select-none group/video">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950/40 via-black/50 to-emerald-950/30" />
        
        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/90 border border-white/10">
            HD Video • 4:15
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[var(--color-mint)] text-emerald-950 text-[10px] font-bold">
            Interactive
          </span>
        </div>

        {/* Center Play Button */}
        <div className="relative z-10 self-center my-auto">
          <div className="w-12 h-12 rounded-full bg-white/95 text-[var(--color-ink)] flex items-center justify-center shadow-lg transition-transform group-hover/video:scale-110 group-hover/video:bg-white pl-0.5">
            <Play className="w-5 h-5 fill-current text-[var(--color-ink)]" />
          </div>
        </div>

        {/* Bottom Title & Progress Bar */}
        <div className="relative z-10 space-y-1.5">
          <p className="text-white text-xs font-semibold tracking-tight truncate">
            Craft — An Introduction: Blocks & Gestures
          </p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--color-mint)] h-full rounded-full w-2/5" />
          </div>
        </div>
      </div>
    );
  }

  // Preview 4: Study Tips & Techniques
  if (previewType === 'study-tips') {
    return (
      <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-4 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-marigold)]/40 text-[var(--color-ink)] text-[11px] font-semibold border border-[var(--color-marigold)]/70">
            <Bookmark className="w-3 h-3 text-amber-800" />
            <span>Active Recall Matrix</span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-[var(--color-ash)]/50 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="h-2 bg-[var(--color-graphite)]/40 rounded w-4/5" />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <div className="h-2 bg-[var(--color-graphite)]/30 rounded w-3/5" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border border-[var(--color-stone)] shrink-0" />
              <div className="h-2 bg-[var(--color-cloud)] rounded w-2/3" />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--color-graphite)] font-sans">
          <span className="font-semibold text-emerald-700">Feynman Method</span>
          <span className="text-[10px] text-[var(--color-stone)]">3 min read</span>
        </div>
      </div>
    );
  }

  // Preview 5: Exam Preparation Guide
  if (previewType === 'exam-guide') {
    return (
      <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-4 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--color-ink)] uppercase tracking-wider">
              Revision Timeline
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-periwinkle)]/40 text-indigo-900 text-[10px] font-semibold">
              High-Yield
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-[var(--color-graphite)] mb-1">
                <span>Syllabus Coverage</span>
                <span className="font-semibold">74%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[var(--color-ash)]/50">
                <div className="bg-gradient-to-r from-[var(--color-mint)] to-[var(--color-azure)] h-full rounded-full w-3/4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white p-2 rounded-lg border border-[var(--color-ash)]/50 text-center">
                <p className="text-[14px] font-serif font-bold text-[var(--color-ink)]">14</p>
                <p className="text-[9px] text-[var(--color-stone)] uppercase">Days Left</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[var(--color-ash)]/50 text-center">
                <p className="text-[14px] font-serif font-bold text-emerald-700">8/10</p>
                <p className="text-[9px] text-[var(--color-stone)] uppercase">Mocks Done</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-[var(--color-stone)] flex items-center justify-between">
          <span>Next mock: Tomorrow 10 AM</span>
          <Target className="w-3.5 h-3.5 text-[var(--color-papaya)]" />
        </div>
      </div>
    );
  }

  // Preview 6: Project Notes
  if (previewType === 'project-notes') {
    return (
      <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-4 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-mint)]/40 text-emerald-950 text-[10px] font-bold uppercase tracking-wider">
              In Progress
            </span>
            <span className="text-[11px] font-mono text-[var(--color-stone)]">Sprint 03</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="bg-white p-2 rounded-lg border border-[var(--color-ash)]/50 shadow-xs flex items-center justify-between text-[11px]">
              <span className="text-[var(--color-ink)] font-medium truncate">Architecture Diagrams</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="bg-white p-2 rounded-lg border border-[var(--color-ash)]/50 shadow-xs flex items-center justify-between text-[11px]">
              <span className="text-[var(--color-ink)] font-medium truncate">Peer Review Feedback</span>
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--color-graphite)]">
          <span>Progress</span>
          <span className="font-semibold text-[var(--color-azure)]">68% completed</span>
        </div>
      </div>
    );
  }

  // Generic / Default Preview
  return (
    <div className="flex-1 bg-[var(--color-linen)]/60 mx-6 mb-5 rounded-[14px] overflow-hidden border border-[var(--color-ash)]/40 p-4 flex flex-col justify-between min-h-[180px] select-none relative group-hover:bg-[var(--color-linen)] transition-colors">
      <div className="space-y-2">
        <div className="h-3 bg-[var(--color-ink)]/20 rounded w-2/3" />
        <div className="h-2 bg-[#d8d8d8] rounded w-full" />
        <div className="h-2 bg-[#e4e4e4] rounded w-4/5" />
        <div className="h-8 bg-[var(--color-mint)]/20 rounded-lg border border-[var(--color-mint)]/40 px-3 flex items-center text-[10px] text-[var(--color-graphite)] mt-2">
          Study notes & references
        </div>
      </div>
      <div className="pt-2 flex items-center justify-between text-[10px] text-[var(--color-stone)]">
        <span>Click card to inspect</span>
        <FileText className="w-3.5 h-3.5 text-[var(--color-stone)]" />
      </div>
    </div>
  );
};

export default DocumentPreview;

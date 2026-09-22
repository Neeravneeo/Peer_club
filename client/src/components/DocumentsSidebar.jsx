import React, { useState } from 'react';
import {
  Plus,
  Share2,
  FileText,
  CheckCircle2,
  Calendar,
  LayoutTemplate,
  Star,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Tag,
  FileUp,
  Settings,
  HelpCircle,
  ExternalLink,
  X
} from 'lucide-react';

/**
 * DocumentsSidebar component
 * Full implementation of Craft Docs Left Sidebar matching PART 4 specs.
 */
export const DocumentsSidebar = ({
  activeFilter = 'all', // 'all' | 'tasks' | 'calendar' | 'templates' | 'starred' | 'folder-craft' | 'folder-unsorted' | tag
  onSelectFilter,
  onNewDocument,
  onImportClick,
  onSettingsClick,
  onHelpClick,
  starredDocs = [],
  tags = ['craft', 'starter', 'guide', 'study', 'exam', 'notes'],
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [foldersExpanded, setFoldersExpanded] = useState({
    craft: true,
    unsorted: false,
  });

  const handleFilterClick = (filterId) => {
    onSelectFilter?.(filterId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="w-72 h-[calc(100vh-64px)] bg-white border-r border-[var(--color-ash)]/50 overflow-y-auto p-6 flex flex-col gap-6 select-none">
      {/* Mobile Close Button */}
      {onCloseMobile && (
        <div className="flex md:hidden items-center justify-between pb-2 border-b border-[var(--color-ash)]">
          <span className="font-serif text-base font-semibold text-[var(--color-ink)]">
            Craft Navigation
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-full hover:bg-[var(--color-linen)] text-[var(--color-stone)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 1. Quick Actions */}
      <div className="space-y-2">
        {/* New Document Button */}
        <button
          onClick={() => {
            onNewDocument?.();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-[var(--color-ink)] text-white rounded-full py-3 px-5 text-sm font-semibold hover:shadow-[var(--shadow-md)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 text-[var(--color-mint)] transition-transform group-hover:rotate-90" />
          <span>New Document</span>
        </button>

        {/* Shared With Me Link */}
        <div
          onClick={() => handleFilterClick('shared')}
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-medium transition-colors cursor-pointer ${
            activeFilter === 'shared'
              ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
              : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
          }`}
        >
          <Share2 className="w-4 h-4 text-[var(--color-stone)]" />
          <span>Shared With Me</span>
        </div>
      </div>

      {/* 2. My Space Section */}
      <div>
        <div className="text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider px-4 mb-2">
          My Space
        </div>
        <nav className="space-y-1">
          {/* All Docs (Active) */}
          <button
            onClick={() => handleFilterClick('all')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-colors text-left ${
              activeFilter === 'all'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeFilter === 'all' ? 'text-emerald-800' : 'text-[var(--color-stone)]'}`} />
            <span>All Docs</span>
          </button>

          {/* Tasks */}
          <button
            onClick={() => handleFilterClick('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-colors text-left ${
              activeFilter === 'tasks'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--color-stone)]" />
            <span>Tasks</span>
          </button>

          {/* Calendar */}
          <button
            onClick={() => handleFilterClick('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-colors text-left ${
              activeFilter === 'calendar'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[var(--color-stone)]" />
            <span>Calendar</span>
          </button>

          {/* My Templates */}
          <button
            onClick={() => handleFilterClick('templates')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-colors text-left ${
              activeFilter === 'templates'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-[var(--color-stone)]" />
            <span>My Templates</span>
          </button>
        </nav>
      </div>

      {/* 3. Starred Section */}
      <div>
        <div
          onClick={() => handleFilterClick('starred')}
          className="flex items-center justify-between text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider px-4 mb-2 cursor-pointer hover:text-[var(--color-ink)]"
        >
          <span>Starred</span>
          {starredDocs.length > 0 && (
            <span className="text-[10px] bg-[var(--color-marigold)]/50 text-amber-950 px-1.5 py-0.5 rounded-full font-bold">
              {starredDocs.length}
            </span>
          )}
        </div>

        {starredDocs.length === 0 ? (
          <p className="text-xs text-[var(--color-stone)] px-4 italic">
            Star docs to keep them close
          </p>
        ) : (
          <div className="space-y-1">
            {starredDocs.slice(0, 3).map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleFilterClick(`doc-${doc.id}`)}
                className="w-full flex items-center gap-2.5 px-4 py-1.5 rounded-[12px] text-xs text-[var(--color-graphite)] hover:bg-[var(--color-linen)] truncate text-left"
              >
                <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Folders Section */}
      <div>
        <div className="text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider px-4 mb-2">
          Folders
        </div>
        <div className="space-y-1">
          {/* Folder 1: How to use Craft */}
          <div
            onClick={() => handleFilterClick('folder-craft')}
            className={`flex items-center justify-between px-4 py-2 rounded-[14px] text-sm transition-colors cursor-pointer ${
              activeFilter === 'folder-craft'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4 text-amber-500 fill-amber-400/50" />
              <span>How to use Craft</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFoldersExpanded((p) => ({ ...p, craft: !p.craft }));
              }}
              className="p-1 text-[var(--color-stone)] hover:text-[var(--color-ink)]"
            >
              {foldersExpanded.craft ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Folder 2: Unsorted */}
          <div
            onClick={() => handleFilterClick('folder-unsorted')}
            className={`flex items-center justify-between px-4 py-2 rounded-[14px] text-sm transition-colors cursor-pointer ${
              activeFilter === 'folder-unsorted'
                ? 'bg-[var(--color-mint)]/20 text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-graphite)] hover:bg-[var(--color-linen)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-amber-600 fill-amber-500/40" />
              <span>Unsorted</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tags Section */}
      <div>
        <div className="text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider px-4 mb-2">
          Tags
        </div>
        <p className="text-xs text-[var(--color-stone)] px-4 italic mb-2.5">
          Pin your key tags for quick access
        </p>
        <div className="flex flex-wrap gap-1.5 px-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilterClick(`tag-${tag}`)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === `tag-${tag}`
                  ? 'bg-amber-300 text-[var(--color-ink)] font-semibold ring-2 ring-amber-400/50'
                  : 'bg-[var(--color-marigold)]/30 text-[var(--color-ink)] hover:bg-[var(--color-marigold)]/60'
              }`}
            >
              <Tag className="w-3 h-3 text-amber-800" />
              <span>#{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Bottom Actions */}
      <div className="mt-auto pt-4 border-t border-[var(--color-ash)]/50 space-y-1">
        <button
          onClick={onImportClick}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
        >
          <FileUp className="w-4 h-4 text-[var(--color-stone)]" />
          <span>Import</span>
        </button>

        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-[var(--color-stone)]" />
          <span>Settings</span>
        </button>

        <a
          href="https://craft.do"
          target="_blank"
          rel="noreferrer"
          onClick={onHelpClick}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-[14px] text-sm text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-[var(--color-stone)]" />
            <span>Help Center</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--color-stone)]" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar (sticky) */}
      <aside className="hidden md:block shrink-0 sticky top-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsSidebar;

import React from 'react';
import {
  FileText,
  Folder,
  Star,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Brain,
  Trash2
} from 'lucide-react';
import { DocumentCard } from './DocumentCard';

// Subtle pastel torn paper backdrop colors for scrapbook aesthetic
const BACKDROP_COLORS = [
  'bg-[var(--color-mint)]/20',
  'bg-[var(--color-marigold)]/25',
  'bg-[var(--color-periwinkle)]/25',
  '',
  'bg-[var(--color-mint)]/20',
  '',
];

/**
 * DocumentGrid Component
 * Supports both 3-column responsive grid view and sleek list view.
 */
export const DocumentGrid = ({
  documents = [],
  viewMode = 'grid', // 'grid' | 'list'
  onCardClick,
  onOpen,
  onEdit,
  onDelete,
  onDuplicate,
  onRename,
  onMove,
  onToggleStar,
  onReorder,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {documents.map((doc) => {
          const title = doc?.title || doc?.fileName || doc?.name || 'Untitled Document';
          const category = doc?.category || 'General';
          const updated = doc?.updatedAt || (doc?.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '2 days ago');
          const isStarred = Boolean(doc?.starred);

          return (
            <div
              key={doc.id}
              onClick={() => (onOpen ? onOpen(doc) : onCardClick?.(doc))}
              className="flex items-center justify-between p-4.5 rounded-[16px] bg-white border border-[var(--color-ash)] shadow-craft-subtle hover:shadow-craft-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-mint)]/20 border border-[var(--color-mint)]/50 flex items-center justify-center shrink-0 text-emerald-950 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--color-ink)] truncate font-sans group-hover:text-black">
                      {title}
                    </h4>
                    {isStarred && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--color-stone)] mt-0.5">
                    <Folder className="w-3 h-3 text-amber-600/70" />
                    <span>{category}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-stone)]" />
                    <span>{updated}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar?.(doc);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isStarred ? 'text-amber-500 hover:bg-amber-50' : 'text-[var(--color-stone)] hover:text-amber-500 hover:bg-[var(--color-linen)]'
                  }`}
                  title={isStarred ? 'Unstar' : 'Star'}
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(doc);
                  }}
                  className="p-2 rounded-full text-[var(--color-stone)] hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {onMove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove?.(doc);
                    }}
                    className="p-2 rounded-full text-[var(--color-stone)] hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Move to Study Room"
                  >
                    <Folder className="w-4 h-4" />
                  </button>
                )}

                <div className="w-8 h-8 rounded-full bg-[var(--color-linen)] flex items-center justify-center text-[var(--color-graphite)] group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc, index) => {
        const backdropColor = BACKDROP_COLORS[index % BACKDROP_COLORS.length];

        return (
          <DocumentCard
            key={doc.id || index}
            document={doc}
            variant="craft"
            backdropColor={backdropColor}
            onClick={onCardClick}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onRename={onRename}
            onMove={onMove}
            onToggleStar={onToggleStar}
          />
        );
      })}
    </div>
  );
};

export default DocumentGrid;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Folder,
  Star,
  MoreVertical,
  ExternalLink,
  Copy,
  FolderInput,
  Edit2,
  Trash2,
  Share2,
  FileText,
  Sparkles,
  Brain,
  ArrowUpRight,
} from 'lucide-react';
import { DocumentPreview } from './DocumentPreview';
import { TornPaperBackdrop } from './DecorativeElements';

/**
 * DocumentCard Component
 * Implements the Craft Docs Scrapbook Card with rich metadata, preview, and context menu.
 * Retains compact mode compatibility for Dashboard usage.
 */
export const DocumentCardComponent = ({
  document = {},
  variant = 'craft', // 'craft' | 'compact'
  backdropColor,
  onClick,
  onOpen,
  onEdit,
  onDelete,
  onDuplicate,
  onRename,
  onMove,
  onToggleStar,
  onGenerateQuiz,
  onGenerateFlashcards,
  isDraggable = true,
  onDragStart,
  onDragEnd,
}) => {
  const navigate = useNavigate();
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contextMenuOpen) {
        setContextMenuOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [contextMenuOpen]);

  // Backward-compatible compact view for Dashboard
  if (
    variant === 'compact' ||
    (!document.bullets && !document.description && !document.category && onGenerateQuiz)
  ) {
    const fileName = document?.fileName || document?.name || document?.title || 'Untitled Study Document';
    const dateFormatted = document?.createdAt
      ? new Date(document.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : 'Recent';

    return (
      <div className="group relative bg-white rounded-[18px] p-5 border border-[var(--color-ash)]/60 shadow-craft-subtle hover:shadow-craft-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-linen)] border border-[var(--color-ash)]/60 flex items-center justify-center shrink-0 text-[var(--color-graphite)] group-hover:bg-[var(--color-mint)]/20 group-hover:text-emerald-950 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-semibold text-[var(--color-ink)] truncate font-sans max-w-[220px] sm:max-w-xs">
                {fileName}
              </h4>
              <p className="text-[12px] text-[var(--color-stone)] font-medium mt-0.5 font-sans">
                Uploaded {dateFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-mint)]/25 text-[var(--color-ink)] text-[12px] font-medium border border-[var(--color-mint)]/40">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              AI Ready
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onGenerateQuiz?.(document)}
                title="Generate AI Quiz"
                className="p-1.5 rounded-lg text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
              >
                <Brain className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => onGenerateFlashcards?.(document)}
                title="Generate Flashcards"
                className="p-1.5 rounded-lg text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
              </button>
              {document?.fileUrl && (
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View Original File"
                  className="p-1.5 rounded-lg text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-azure)]" />
                </a>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(document)}
                  title="Delete Document"
                  className="p-1.5 rounded-lg text-[var(--color-stone)] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Craft Scrapbook Document Card
  const title = document?.title || document?.fileName || document?.name || 'Untitled Document';
  const category = document?.category || 'How to use Craft';
  const updatedInfo = document?.updatedAt || (document?.createdAt ? `Updated ${new Date(document.createdAt).toLocaleDateString()}` : 'Updated 2 days ago');
  const description =
    document?.description ||
    'Think of Craft as your personal notebook. Bring together tasks, your calendar as well as docs in one place to keep an overview of projects, work and life.';
  const bullets = document?.bullets || [
    "This is your editor. Click anywhere and make an edit. You can't mess it up.",
    'Organize tasks and sync notes with your active revision timetable.',
  ];
  const isStarred = Boolean(document?.starred);

  // Right-click context menu handler
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMenuCoords({
      x: Math.min(e.clientX - rect.left, rect.width - 180),
      y: Math.min(e.clientY - rect.top, rect.height - 200),
    });
    setContextMenuOpen(true);
  };

  const handleCardClick = (e) => {
    // If command or control key is pressed, open in new tab
    if (e.ctrlKey || e.metaKey) {
      window.open(`/documents/${document.id || ''}`, '_blank');
      return;
    }
    if (onClick) {
      onClick(document);
    } else if (onOpen) {
      onOpen(document);
    }
  };

  return (
    <div className="relative group select-none">
      {/* Subtle Torn Paper Scrapbook Backdrop if provided */}
      {backdropColor && <TornPaperBackdrop color={backdropColor} />}

      <div
        ref={cardRef}
        draggable={isDraggable}
        onDragStart={(e) => {
          setIsDragging(true);
          e.dataTransfer.setData('text/plain', document.id || title);
          onDragStart?.(document);
        }}
        onDragEnd={(e) => {
          setIsDragging(false);
          onDragEnd?.(document);
        }}
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
        className={`bg-white rounded-[24px] border border-[var(--color-ash)]/50 shadow-[var(--shadow-xl)] overflow-hidden hover:shadow-[var(--shadow-md)] transition-all cursor-pointer flex flex-col min-h-[400px] relative ${
          isDragging ? 'opacity-50 scale-105 shadow-2xl' : 'hover:-translate-y-1'
        }`}
      >
        {/* Hover Subtle Overlay */}
        <div className="absolute inset-0 bg-[var(--color-azure)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

        {/* Floating Quick Action Buttons on Hover */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(document);
            }}
            title={isStarred ? 'Unstar document' : 'Star document'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
              isStarred
                ? 'bg-[var(--color-marigold)] text-amber-950'
                : 'bg-white/90 hover:bg-white text-[var(--color-stone)] hover:text-amber-500 border border-[var(--color-ash)]/60'
            }`}
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500 text-amber-600' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e);
            }}
            title="More Options"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[var(--color-graphite)] hover:text-[var(--color-ink)] border border-[var(--color-ash)]/60 flex items-center justify-center transition-colors shadow-xs"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Card Header */}
        <div className="p-6 pb-4">
          <h3 className="font-serif text-xl leading-[1.2] tracking-[-0.5px] text-[var(--color-ink)] mb-2 group-hover:text-black transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-[var(--color-stone)] mb-1">
            <Folder className="w-3.5 h-3.5 text-amber-600/80" />
            <span className="font-medium text-[var(--color-graphite)]">{category}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-stone)]" />
            <span>{updatedInfo}</span>
          </div>
        </div>

        {/* 2. Description */}
        <div className="px-6 pb-4">
          <p className="text-sm text-[var(--color-graphite)] leading-relaxed line-clamp-3 font-sans">
            {description}
          </p>
        </div>

        {/* 3. Preview/Thumbnail Section */}
        <DocumentPreview document={document} />

        {/* 4. Card Footer with Bullet Points */}
        <div className="px-6 pb-6 pt-1 mt-auto">
          <div className="space-y-2">
            {bullets.slice(0, 2).map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-graphite)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)] mt-1.5 shrink-0" />
                <span className="line-clamp-2">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right-Click Styled Context Menu */}
        {contextMenuOpen && (
          <div
            style={{ top: `${menuCoords.y}px`, left: `${menuCoords.x}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bg-white rounded-[14px] shadow-[var(--shadow-xl)] border border-[var(--color-ash)] py-2 z-50 w-48 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              onClick={() => {
                setContextMenuOpen(false);
                onOpen ? onOpen(document) : onClick?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              <span>Open</span>
            </button>

            <button
              onClick={() => {
                setContextMenuOpen(false);
                onRename?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
            >
              <Edit2 className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              <span>Rename</span>
            </button>

            <button
              onClick={() => {
                setContextMenuOpen(false);
                onMove?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
            >
              <FolderInput className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              <span>Move to...</span>
            </button>

            <button
              onClick={() => {
                setContextMenuOpen(false);
                onDuplicate?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
            >
              <Copy className="w-3.5 h-3.5 text-[var(--color-stone)]" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => {
                setContextMenuOpen(false);
                onToggleStar?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors text-left"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>{isStarred ? 'Remove from Starred' : 'Star Document'}</span>
            </button>

            <div className="border-t border-[var(--color-ash)]/60 my-1" />

            <button
              onClick={() => {
                setContextMenuOpen(false);
                onDelete?.(document);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const DocumentCard = React.memo(DocumentCardComponent);
export default DocumentCard;

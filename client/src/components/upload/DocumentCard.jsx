import React from 'react';
import { FileText, Brain, Layers, Eye, Trash2 } from 'lucide-react';

/**
 * Format bytes into human readable string (e.g. 2.4 MB)
 */
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.2 MB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

/**
 * Format date string into "Uploaded Sep 16" or similar
 */
function formatUploadDate(dateInput) {
  if (!dateInput) return 'Uploaded recently';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Uploaded recently';
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    return `Uploaded ${month} ${day}`;
  } catch (_) {
    return 'Uploaded recently';
  }
}

/**
 * DocumentCard - Craft.do Aesthetic Document Card
 */
export function DocumentCard({
  document,
  onGenerateQuiz,
  onGenerateFlashcards,
  onView,
  onDelete,
}) {
  if (!document) return null;

  const fileName = document.fileName || document.name || 'Untitled Document';
  const fileUrl = document.fileUrl || document.downloadUrl || '#';
  const fileSize = document.fileSize || document.fileSizeBytes || 1024 * 1024 * 1.5;
  const isAiReady = document.status === 'AI Ready' || document.hasText !== false;

  const handleView = () => {
    if (onView) {
      onView(fileUrl, document);
    } else if (fileUrl && fileUrl !== '#') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e1e1e1]/60 p-5 hover:shadow-md transition-shadow duration-200">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: File icon + File name */}
        <div className="flex items-center min-w-0">
          <FileText className="w-5 h-5 text-[#6b7280] mr-3 shrink-0" aria-hidden="true" />
          <h4
            className="font-medium text-[#030302] truncate text-base font-sans tracking-tight"
            title={fileName}
          >
            {fileName}
          </h4>
        </div>

        {/* Right: Status badge */}
        <div className="shrink-0">
          {isAiReady ? (
            <span className="inline-flex items-center bg-[#9bd8a9]/20 text-[#059669] px-3 py-1 rounded-full text-xs font-medium">
              AI Ready
            </span>
          ) : (
            <span className="inline-flex items-center bg-[#f7f7f7] text-[#6b7280] px-3 py-1 rounded-full text-xs font-medium">
              No Text
            </span>
          )}
        </div>
      </div>

      {/* Meta Row */}
      <div className="mt-1 pl-8">
        <p className="text-xs text-[#6b7280] font-sans">
          {formatUploadDate(document.uploadDate || document.createdAt)} • {formatFileSize(fileSize)}
        </p>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 mt-4 pt-1 flex-wrap">
        {/* Quiz button */}
        <button
          type="button"
          aria-label={`Generate quiz from ${fileName}`}
          disabled={!isAiReady}
          onClick={() => onGenerateQuiz && onGenerateQuiz(document.id, document)}
          className={`px-4 py-2 rounded-full bg-[#9bd8a9]/20 text-[#059669] text-sm font-medium hover:bg-[#9bd8a9]/30 transition-colors flex items-center gap-1.5 cursor-pointer ${
            !isAiReady ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <Brain className="w-4 h-4" aria-hidden="true" />
          <span>Quiz</span>
        </button>

        {/* Flashcards button */}
        <button
          type="button"
          aria-label={`Generate flashcards from ${fileName}`}
          disabled={!isAiReady}
          onClick={() => onGenerateFlashcards && onGenerateFlashcards(document.id, document)}
          className={`px-4 py-2 rounded-full bg-[#b8caf5]/20 text-[#4f46e5] text-sm font-medium hover:bg-[#b8caf5]/30 transition-colors flex items-center gap-1.5 cursor-pointer ${
            !isAiReady ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span>Flashcards</span>
        </button>

        {/* View button */}
        <button
          type="button"
          aria-label={`View document: ${fileName}`}
          onClick={handleView}
          className="px-4 py-2 rounded-full bg-[#f7f7f7] text-[#41413f] text-sm font-medium hover:bg-[#efefef] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span>View</span>
        </button>

        {/* Delete button */}
        <button
          type="button"
          aria-label={`Delete document: ${fileName}`}
          onClick={() => onDelete && onDelete(document.id, document)}
          className="px-4 py-2 rounded-full bg-[#fee2e2] text-[#dc2626] text-sm font-medium hover:bg-[#fecaca] transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;

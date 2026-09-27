import React from 'react';
import { FileText, Brain, Layers, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function DocumentsVault({ documents = [], onUpload }) {
  const navigate = useNavigate();

  const handleGenerateQuiz = (doc) => {
    toast.success(`Synthesizing practice quiz from "${doc.title}"!`);
    navigate('/quizzes');
  };

  const handleFlashcards = (doc) => {
    toast.success(`Generating flashcard deck from "${doc.title}"!`);
    navigate('/flashcards');
  };

  const handlePreview = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      toast.error('Document file URL is missing.');
    }
  };

  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      toast.error('Document file URL is missing.');
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-[var(--color-ash)] rounded-[24px] p-6 space-y-3">
        <FileText className="w-10 h-10 text-[var(--color-stone)] mx-auto" />
        <h4 className="font-serif text-lg text-[var(--color-ink)]">No documents in vault yet</h4>
        <p className="text-xs text-[var(--color-stone)] max-w-sm mx-auto">
          Upload lecture slides, notes, or textbook chapters to share with your study group.
        </p>
        <button
          type="button"
          onClick={onUpload}
          className="px-5 py-2 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold"
        >
          + Upload First Document
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc, idx) => (
        <div
          key={doc.id || idx}
          className="bg-[var(--color-linen)]/40 rounded-[20px] border border-[var(--color-ash)]/70 p-5 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {/* File Info */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[14px] bg-blue-100/70 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-ink)] line-clamp-1">
                {doc.title || doc.fileName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-[var(--color-stone)] mt-0.5">
                <span>By {doc.uploaderName || doc.uploader?.name || 'Peer'}</span>
                <span>•</span>
                <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : (doc.uploadedTime || 'Recently')}</span>
                <span>•</span>
                <span>{doc.fileSize || 'PDF Document'}</span>
              </div>
            </div>
          </div>

          {/* AI Study Actions Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleGenerateQuiz(doc)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-emerald-700" />
              <span>🧠 Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => handleFlashcards(doc)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>🃏 Cards</span>
            </button>

            <button
              type="button"
              onClick={() => handlePreview(doc)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[var(--color-linen)] border border-[var(--color-ash)] text-xs text-[var(--color-graphite)] font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload(doc)}
              className="w-8 h-8 rounded-full bg-white hover:bg-[var(--color-linen)] border border-[var(--color-ash)] flex items-center justify-center text-[var(--color-stone)] hover:text-[var(--color-ink)] transition-colors"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

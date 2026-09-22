import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { DocumentCard } from '@/components/upload/DocumentCard';
import { GenerateQuizModal } from '@/pages/quiz/GenerateQuizModal';
import { GenerateFlashcardModal } from '@/components/flashcards/GenerateFlashcardModal';
import { triggerStreakActivity } from '@/components/StreakCard';
import { Folder, UploadCloud, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * UploadPage - Craft.do Aesthetic Document Upload & Management
 */
export function UploadPage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [generateQuizModal, setGenerateQuizModal] = useState({ open: false, documentId: null });
  const [generateFlashcardModal, setGenerateFlashcardModal] = useState({ open: false, documentId: null });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, document: null });

  // Query documents list
  const { data: documents = [], isLoading, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/documents');
      return res.data?.documents || [];
    },
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      // Support both 'document' and 'file' field keys
      formData.append('document', file);
      formData.append('file', file);

      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: async (res) => {
      // Trigger user streak activity
      try {
        await triggerStreakActivity('document');
      } catch (streakErr) {
        console.warn('Streak update warning:', streakErr);
      }

      toast.success(res?.message || 'Document uploaded successfully! AI is processing...');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.error || error.message || 'Upload failed. Please try again.';
      toast.error(msg);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId) => {
      const res = await api.delete(`/documents/${documentId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Document deleted successfully');
      setDeleteConfirmModal({ open: false, document: null });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.error || error.message || 'Failed to delete document';
      toast.error(msg);
    },
  });

  // Handlers
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleOpenDeleteModal = (documentId, docObj) => {
    const targetDoc = docObj || documents.find((d) => d.id === documentId);
    setDeleteConfirmModal({ open: true, document: targetDoc || { id: documentId } });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.document?.id) {
      deleteMutation.mutate(deleteConfirmModal.document.id);
    }
  };

  const selectedQuizDoc = documents.find((d) => d.id === generateQuizModal.documentId);
  const selectedFlashcardDoc = documents.find((d) => d.id === generateFlashcardModal.documentId);

  return (
    <div className="min-h-screen bg-[#fff3e7] text-[#030302] selection:bg-[#9bd8a9]/40 relative overflow-x-hidden">
      {/* Floating Craft.do Topbar */}
      <Topbar />

      {/* Main Page Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-6xl w-full min-w-0">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#030302] tracking-tight">
            Study Materials & Documents
          </h1>
          <p className="text-base text-[#41413f] mt-2 font-sans">
            Upload textbook chapters, slide decks, or lecture notes to extract AI quizzes and flashcards.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="mb-10 md:mb-12">
          <FileDropzone
            onFileUpload={handleFileUpload}
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            maxSlots={10}
            usedSlots={documents.length}
          />
        </div>

        {/* Uploaded Files Section */}
        <section aria-labelledby="uploaded-files-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="uploaded-files-heading" className="flex items-center font-semibold text-[#030302] text-lg font-sans">
              <Folder className="w-5 h-5 text-[#9bd8a9] mr-2" aria-hidden="true" />
              <span>Uploaded Files</span>
            </h2>
            <div className="px-3 py-1 rounded-full bg-[#f7f7f7] text-xs font-medium text-[#41413f] border border-[#e1e1e1]/50">
              {documents.length} of 10 slots used
            </div>
          </div>

          {isLoading ? (
            /* Skeleton Loading */
            <div className="space-y-4" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#e1e1e1]/60 h-24 p-5 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-[24px] border border-[#e1e1e1]/60 p-12 text-center">
              <UploadCloud className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" aria-hidden="true" />
              <p className="font-medium text-[#030302] text-base mb-2">No documents uploaded yet</p>
              <p className="text-sm text-[#6b7280] max-w-sm mx-auto">
                Drop a PDF or TXT above to start generating practice material.
              </p>
            </div>
          ) : (
            /* Document Cards Grid */
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onGenerateQuiz={(id) => setGenerateQuizModal({ open: true, documentId: id })}
                  onGenerateFlashcards={(id) => setGenerateFlashcardModal({ open: true, documentId: id })}
                  onView={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e1e1e1] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-[#dc2626]">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="font-semibold text-lg text-[#030302]">
                  Delete Document
                </h3>
                <p className="text-xs text-[#6b7280] truncate max-w-[280px]">
                  {deleteConfirmModal.document?.fileName || deleteConfirmModal.document?.name}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#41413f] mb-2 font-medium">
              Are you sure you want to delete this document?
            </p>
            <p className="text-xs text-[#6b7280] mb-6 bg-amber-50 border border-amber-200/80 p-3 rounded-xl">
              ⚠️ This will also delete all associated quizzes and flashcards created from this document.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal({ open: false, document: null })}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-full border border-[#e1e1e1] text-[#41413f] text-sm font-medium hover:bg-[#f7f7f7] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Quiz Generation Modal */}
      {generateQuizModal.open && (
        <GenerateQuizModal
          document={selectedQuizDoc || { id: generateQuizModal.documentId }}
          documentId={generateQuizModal.documentId}
          isOpen={generateQuizModal.open}
          onClose={() => setGenerateQuizModal({ open: false, documentId: null })}
        />
      )}

      {/* AI Flashcard Generation Modal */}
      {generateFlashcardModal.open && (
        <GenerateFlashcardModal
          document={selectedFlashcardDoc || { id: generateFlashcardModal.documentId }}
          documentId={generateFlashcardModal.documentId}
          isOpen={generateFlashcardModal.open}
          onClose={() => setGenerateFlashcardModal({ open: false, documentId: null })}
        />
      )}
    </div>
  );
}

export default UploadPage;

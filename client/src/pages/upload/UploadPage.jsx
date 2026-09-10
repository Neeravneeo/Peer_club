import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { FileDropzone } from '@/components/upload/FileDropzone'
import { DocumentCard } from '@/components/upload/DocumentCard'
import { GenerateQuizModal } from '@/pages/quiz/GenerateQuizModal'
import { GenerateFlashcardModal } from '@/components/flashcards/GenerateFlashcardModal'
import { toast } from 'sonner'
import { UploadCloud, FolderOpen, Loader2 } from 'lucide-react'

export function UploadPage() {
  const queryClient = useQueryClient()
  const [selectedDocForQuiz, setSelectedDocForQuiz] = useState(null)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [selectedDocForFlashcards, setSelectedDocForFlashcards] = useState(null)
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch documents
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/documents')
      return res.data.documents
    },
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Document uploaded successfully')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setIsUploading(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Upload failed')
      setIsUploading(false)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/documents/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Document removed')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete')
    },
  })

  const handleFileSelect = (file) => {
    setIsUploading(true)
    uploadMutation.mutate(file)
  }

  const handleOpenQuizModal = (doc) => {
    setSelectedDocForQuiz(doc)
    setIsQuizModalOpen(true)
  }

  const handleOpenFlashcardModal = (doc) => {
    setSelectedDocForFlashcards(doc)
    setIsFlashcardModalOpen(true)
  }

  const documents = data || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-carbon-ink tracking-tight">
          Study Materials & Documents
        </h1>
        <p className="text-sm text-ash mt-1">
          Upload textbook chapters, slide decks, or lecture notes to extract AI quizzes and flashcards.
        </p>
      </div>

      {/* Dropzone */}
      <FileDropzone onFileSelect={handleFileSelect} isUploading={isUploading} />

      {/* Document List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-carbon-ink" />
            <h2 className="text-lg font-bold text-carbon-ink">Uploaded Files</h2>
          </div>
          <span className="text-xs text-ash font-medium">
            {documents.length} of 10 slots used
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-true-black animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-[24px] bg-surface-elevated p-8 space-y-2">
            <UploadCloud className="w-10 h-10 text-ash mx-auto" />
            <p className="text-sm font-semibold text-carbon-ink">No documents uploaded yet</p>
            <p className="text-xs text-ash">
              Drop a PDF or TXT above to start generating practice material.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onGenerateQuiz={handleOpenQuizModal}
                onGenerateFlashcards={handleOpenFlashcardModal}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      <GenerateQuizModal
        document={selectedDocForQuiz}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      <GenerateFlashcardModal
        document={selectedDocForFlashcards}
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
      />
    </div>
  )
}

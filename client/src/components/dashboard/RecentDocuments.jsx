import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, ArrowRight, FileText, Brain, Layers } from 'lucide-react'

export function RecentDocuments({ documents = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-white tracking-tight">
          Uploaded Materials
        </h3>
        <Link
          to="/upload"
          className="text-xs font-medium text-[#8a8f98] hover:text-white flex items-center gap-1 group transition-colors"
        >
          View All{' '}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {documents.length === 0 ? (
        <Card className="border border-white/[0.08] bg-[#0d0e11]/80 p-8 text-center space-y-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <UploadCloud className="w-5 h-5 text-[#8f9bff]" />
          </div>
          <p className="text-sm font-medium text-white">No materials uploaded yet</p>
          <p className="text-xs text-[#8a8f98] max-w-sm mx-auto">
            Upload PDFs or lecture notes to automatically generate flashcards and quizzes.
          </p>
          <Button asChild size="sm" variant="secondary" className="mt-2 text-xs">
            <Link to="/upload">Upload PDF</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 transition-all p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white shrink-0">
                  <FileText className="w-4 h-4 text-[#8f9bff]" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[#8a8f98] mt-0.5 font-mono">
                    {(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB • PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Button asChild size="sm" variant="secondary" className="text-xs gap-1.5 h-8">
                  <Link to="/upload">
                    <Brain className="w-3.5 h-3.5 text-[#8a8f98]" /> Quiz
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="text-xs gap-1.5 h-8">
                  <Link to="/upload">
                    <Layers className="w-3.5 h-3.5 text-[#8a8f98]" /> Flashcards
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

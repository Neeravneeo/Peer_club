import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, ArrowRight, FileText, Brain, Layers } from 'lucide-react'

export function RecentDocuments({ documents = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-carbon-ink tracking-tight">
          Uploaded Materials
        </h3>
        <Link
          to="/upload"
          className="text-xs font-semibold text-carbon-ink hover:underline flex items-center gap-1 group"
        >
          View All{' '}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {documents.length === 0 ? (
        <Card className="border-border bg-pure-white p-8 text-center space-y-3 rounded-[24px]">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-ash">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-carbon-ink">No materials uploaded yet</p>
          <p className="text-xs text-ash max-w-sm mx-auto">
            Upload PDFs or lecture notes to automatically generate flashcards and quizzes.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
            <Link to="/upload">Upload PDF</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="border-border bg-pure-white hover:border-true-black/60 transition-all p-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-[12px] bg-surface-elevated text-carbon-ink border border-border shrink-0">
                  <FileText className="w-4 h-4 text-ash" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-carbon-ink text-sm truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-ash mt-0.5">
                    {(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB • PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                  <Link to="/upload">
                    <Brain className="w-3.5 h-3.5 text-ash" /> Quiz
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                  <Link to="/upload">
                    <Layers className="w-3.5 h-3.5 text-ash" /> Flashcards
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

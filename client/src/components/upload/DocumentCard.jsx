import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Brain, Trash2, Layers, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

export function DocumentCard({
  document,
  onGenerateQuiz,
  onGenerateFlashcards,
  onDelete,
}) {
  const sizeMb = (document.fileSizeBytes / (1024 * 1024)).toFixed(2)

  return (
    <Card className="border-border bg-pure-white hover:border-true-black transition-colors rounded-[24px]">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-3 rounded-[12px] bg-surface-elevated text-carbon-ink border border-border shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-carbon-ink truncate max-w-xs md:max-w-md text-base">
                {document.name}
              </h4>
              {document.hasText ? (
                <Badge variant="lime" className="text-[11px]">AI Ready</Badge>
              ) : (
                <Badge variant="secondary" className="text-[11px]">No Text</Badge>
              )}
            </div>
            <p className="text-xs text-ash mt-0.5">
              {sizeMb} MB • Uploaded on{' '}
              {format(new Date(document.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <Button
            size="sm"
            onClick={() => onGenerateFlashcards(document)}
            disabled={!document.hasText}
            variant="outline"
            className="gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            Flashcards
          </Button>

          <Button
            size="sm"
            onClick={() => onGenerateQuiz(document)}
            disabled={!document.hasText}
            className="gap-1.5"
          >
            <Brain className="w-3.5 h-3.5" />
            Quiz
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1 text-ash hover:text-carbon-ink"
          >
            <a href={document.downloadUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document.id)}
            className="text-ash hover:text-accent-red"
            title="Delete Document"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Loader2,
  HelpCircle,
  Brain,
  Check,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TornPaperBackdrop } from '@/components/DecorativeElements';
import { AnimatedLoader } from '@/components/AnimatedLoader';

export function GenerationModal({ isOpen, onClose, onGenerate, isGenerating }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('mcq');

  // Fetch available documents from backend API
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['documents-list'],
    queryFn: async () => {
      try {
        const res = await api.get('/documents');
        return res?.data?.documents || [];
      } catch (_) {
        return [];
      }
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const sampleDocs = [
    { id: 'sample-bio-doc', fileName: 'Lecture-4-Biochem-Respiration.pdf', size: '2.4 MB' },
    { id: 'sample-cs-doc', fileName: 'DSA-Notes-Trees-Graphs.pdf', size: '1.8 MB' },
    { id: 'sample-hist-doc', fileName: 'History-Textbook-Ch7.pdf', size: '3.1 MB' },
  ];

  const availableDocs = docsData && docsData.length > 0 ? docsData : sampleDocs;

  const handleSubmit = (e) => {
    e.preventDefault();
    const effectiveDocId = selectedDocId || availableDocs[0]?.id || 'sample-bio-doc';
    const foundDoc = availableDocs.find((d) => d.id === effectiveDocId);

    onGenerate({
      documentId: effectiveDocId,
      documentName: foundDoc?.fileName || foundDoc?.name || 'Study Notes.pdf',
      questionCount,
      difficulty,
      questionType,
    });
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-10 max-w-xl w-full border border-[var(--color-ash)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <TornPaperBackdrop color="bg-blue-100/30" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] flex items-center justify-center text-[var(--color-graphite)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-emerald-950 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI Exam Generator
          </div>
          <h2 className="font-serif text-[28px] text-[var(--color-ink)] font-normal tracking-[-0.7px]">
            Generate AI Quiz
          </h2>
          <p className="text-sm text-[var(--color-graphite)] mt-1">
            Create an active recall practice test directly synthesized from your study materials.
          </p>
        </div>

        {isGenerating ? (
          /* Loading Animation State */
          <div className="py-14 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-lime-100 border-2 border-lime-300 flex items-center justify-center mx-auto animate-bounce">
              <Brain className="w-8 h-8 text-emerald-700 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--color-ink)] font-normal">
                Synthesizing questions from your notes...
              </h3>
              <p className="text-xs text-[var(--color-stone)] mt-1 max-w-sm mx-auto">
                Extracting core concepts, generating tricky distractors, and writing step-by-step explanations.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-3">
              <AnimatedLoader size={20} variant="color-shift" color="mint" glow label="Analyzing document semantics" />
              <span className="text-xs font-mono text-[var(--color-graphite)]">
                Analyzing document semantics
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Source Document Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-2.5">
                1. Select Source Document
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {availableDocs.map((doc) => {
                  const isSelected = selectedDocId === doc.id || (!selectedDocId && doc.id === availableDocs[0]?.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`flex items-center justify-between p-3.5 rounded-[16px] border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-50 shadow-xs'
                          : 'border-[var(--color-ash)] bg-white hover:border-gray-400 hover:bg-[var(--color-linen)]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText className={`w-4 h-4 ${isSelected ? 'text-gray-900' : 'text-[var(--color-azure)]'}`} />
                        <span className="text-sm font-medium text-[var(--color-ink)] truncate">
                          {doc.fileName || doc.name || 'Lecture Notes.pdf'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 ml-2">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Number of Questions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-2.5">
                2. Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                          : 'border-[var(--color-ash)] bg-white text-[var(--color-graphite)] hover:border-gray-400'
                      }`}
                    >
                      {count} Qs
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Difficulty */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)] mb-2.5">
                3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Easy', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
                  { id: 'medium', label: 'Medium', color: 'border-amber-300 bg-amber-50 text-amber-800' },
                  { id: 'hard', label: 'Hard', color: 'border-rose-300 bg-rose-50 text-rose-800' },
                ].map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setDifficulty(diff.id)}
                      className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                        isSelected
                          ? `${diff.color} ring-2 ring-gray-900 shadow-xs font-black`
                          : 'border-[var(--color-ash)] bg-white text-[var(--color-stone)] hover:border-gray-400'
                      }`}
                    >
                      {diff.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-gray-950 rounded-full py-3.5 font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-emerald-800" />
                <span>Generate Quiz</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

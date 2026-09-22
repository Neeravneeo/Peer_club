import React from 'react';
import { FileText, Plus } from 'lucide-react';

/**
 * EmptyDocsState Component
 */
export const EmptyDocsState = ({
  onCreateClick,
  heading = 'No documents yet',
  subheading = 'Create your first document to start organizing your study materials.',
  actionLabel = 'Create Document',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 select-none animate-in fade-in duration-300">
      {/* Large Mint Icon Bubble */}
      <div className="w-24 h-24 rounded-full bg-[var(--color-mint)]/30 flex items-center justify-center mb-6 border border-[var(--color-mint)]/50 shadow-xs">
        <FileText className="w-12 h-12 text-[var(--color-ink)]" />
      </div>

      {/* Heading */}
      <h2 className="font-serif text-[36px] leading-[1.2] tracking-[-0.72px] text-[var(--color-ink)] mb-3 text-center">
        {heading}
      </h2>

      {/* Subheading */}
      <p className="text-base text-[var(--color-graphite)] mb-8 text-center max-w-md font-sans">
        {subheading}
      </p>

      {/* CTA Button */}
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="bg-[var(--color-ink)] text-white rounded-full px-8 py-3 font-semibold hover:shadow-[var(--shadow-md)] transition-all flex items-center gap-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 text-[var(--color-mint)] transition-transform group-hover:rotate-90" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyDocsState;

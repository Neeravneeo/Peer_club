import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Upload, Sparkles } from 'lucide-react';
import { TornPaperBackdrop } from './DecorativeElements';

/**
 * EmptyState in Craft Docs Scrapbook Style
 */
export const EmptyState = ({ onUploadClick }) => {
  return (
    <div className="relative group max-w-xl mx-auto my-12 text-center p-10 bg-white rounded-craft-card shadow-craft-xl border border-ash/50 overflow-hidden">
      {/* Decorative Scrapbook Backdrop */}
      <TornPaperBackdrop color="bg-mint/20" />

      {/* Large Brain Illustration Circle */}
      <div className="relative w-24 h-24 rounded-full bg-mint/30 border border-mint/50 flex items-center justify-center mx-auto mb-6 shadow-craft-sm">
        <Brain className="w-12 h-12 text-ink" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-marigold border border-white" />
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-serif text-[32px] sm:text-[36px] leading-[1.2] tracking-craft-heading-sm text-ink mb-3 font-normal">
        Welcome to Peer Club!
      </h2>

      {/* Subheading */}
      <p className="text-[15px] sm:text-[16px] text-graphite leading-relaxed mb-8 max-w-md mx-auto font-sans">
        Upload your first study document to instantly generate AI quizzes, flashcards, and summary notes. Your learning streak starts today!
      </p>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/upload"
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 bg-ink text-white rounded-craft-pill px-8 py-3.5 text-[14px] font-semibold hover:bg-graphite transition-all shadow-craft-sm hover:shadow-craft-md cursor-pointer"
        >
          <Upload className="w-4 h-4 text-mint" />
          <span>Upload Document</span>
        </Link>
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 bg-linen text-ink border border-ash rounded-craft-pill px-6 py-3 text-[14px] font-medium hover:bg-cloud transition-colors"
        >
          <Sparkles className="w-4 h-4 text-azure" />
          <span>Explore Quizzes</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;

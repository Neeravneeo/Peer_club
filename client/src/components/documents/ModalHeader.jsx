import React from 'react';
import { XIcon } from './Icons';

export function ModalHeader({
  title = 'Create New Document',
  subtitle = 'Add a new note to your Peer Club scrapbook notebook.',
  onClose,
}) {
  return (
    <div className="flex items-start justify-between mb-6 relative">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl select-none" role="img" aria-label="document">
            📄
          </span>
          <h2
            id="modal-title"
            className="font-serif text-2xl font-semibold text-[#030302] tracking-tight"
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-[#41413f] mt-1 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] active:bg-[#efefef] flex items-center justify-center transition-colors text-[#6b7280] hover:text-[#030302] focus:outline-none focus:ring-2 focus:ring-[#9bd8a9]"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

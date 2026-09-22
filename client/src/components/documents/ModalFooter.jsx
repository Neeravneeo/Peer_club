import React from 'react';
import { PlusIcon } from './Icons';
import { AnimatedLoader } from '@/components/AnimatedLoader';

export function ModalFooter({
  onClose,
  onSubmit,
  isSubmitting = false,
  isValid = true,
  submitLabel = 'Create Document',
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e1e1e1]/60">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-6 py-3 rounded-full border border-[#e1e1e1] text-sm font-medium text-[#41413f] hover:bg-[#f7f7f7] active:bg-[#efefef] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        className="px-6 py-3 rounded-full bg-[#030302] text-white text-sm font-semibold hover:bg-[#1a1a1a] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group"
      >
        {isSubmitting ? (
          <>
            <AnimatedLoader size={18} variant="pulse" color="mint" label="Uploading & Creating..." />
            <span className="opacity-90">Uploading & Creating...</span>
          </>
        ) : (
          <>
            <PlusIcon className="w-4 h-4 text-[#9bd8a9] group-hover:rotate-90 transition-transform duration-200" />
            <span>{submitLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}

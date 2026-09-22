import React, { useState, useEffect, useCallback } from 'react';
import { ModalHeader } from './ModalHeader';
import { FormField } from './FormField';
import { FileUploadZone } from './FileUploadZone';
import { ModalFooter } from './ModalFooter';
import { useFileUpload } from './hooks/useFileUpload';
import { useModalAnimation } from './hooks/useModalAnimation';
import { validateFile } from './utils/fileUtils';
import { toast } from 'sonner';
import { triggerStreakActivity } from '@/components/StreakCard';

const CATEGORIES = [
  'Study Resources',
  'Lecture Notes',
  'Research Papers',
  'Practice Problems',
  'Exam Prep',
  'Personal',
];

const PREVIEW_STYLES = [
  { label: 'Editor Canvas', value: 'editor' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Detailed', value: 'detailed' },
  { label: 'Card View', value: 'card' },
];

export function DocumentUploadModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Study Resources');
  const [previewStyle, setPreviewStyle] = useState('editor');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const [errors, setErrors] = useState({});

  const { isRendered, isAnimatingOut, modalContentRef } = useModalAnimation(isOpen, onClose);

  // File upload hook
  const {
    selectedFile,
    isDragging,
    fileError,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    clearFile,
    openPicker,
    setFileError,
  } = useFileUpload((file) => {
    // If title is currently empty, auto-populate from file name without extension
    if (!title.trim() && file?.name) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('Study Resources');
      setPreviewStyle('editor');
      setSummary('');
      setIsSubmitting(false);
      setTitleTouched(false);
      setErrors({});
      clearFile();
    }
  }, [isOpen, clearFile]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Document title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Document title must be at least 3 characters.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Document title cannot exceed 100 characters.';
    }

    if (summary.length > 500) {
      newErrors.summary = 'Summary cannot exceed 500 characters.';
    }

    if (selectedFile) {
      const fileValidation = validateFile(selectedFile);
      if (!fileValidation.isValid) {
        newErrors.file = fileValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, summary, selectedFile]);

  // Real-time title validation after touched
  useEffect(() => {
    if (titleTouched) {
      validateForm();
    }
  }, [title, titleTouched, validateForm]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setTitleTouched(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const docPayload = {
        title: title.trim(),
        category,
        previewStyle,
        summary: summary.trim(),
        file: selectedFile,
      };

      if (onCreate) {
        await onCreate(docPayload);
      }

      // Sync streak tracking
      triggerStreakActivity('document');

      toast.success('✨ Document created successfully!');
      onClose();
    } catch (err) {
      console.error('[DocumentUploadModal] Error creating document:', err);
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create document. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRendered) return null;

  const isFormValid =
    title.trim().length >= 3 &&
    title.trim().length <= 100 &&
    summary.length <= 500 &&
    !fileError;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030302]/40 backdrop-blur-sm transition-opacity duration-200 ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContentRef}
        className={`bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#edd5c0]/40 w-full max-w-2xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto transform transition-all duration-200 ${
          isAnimatingOut
            ? 'scale-95 opacity-0'
            : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
        }`}
        style={{
          boxShadow:
            '0 25px 60px -15px rgba(3, 3, 2, 0.15), 0 0 0 1px rgba(237, 213, 192, 0.35)',
        }}
      >
        {/* Torn paper / Scrapbook pastel accent in top-right corner */}
        <div
          className="absolute -top-1 -right-1 w-14 h-14 overflow-hidden pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#9bd8a9]/30 rounded-bl-2xl rotate-12 border-b border-l border-[#9bd8a9]/50" />
        </div>

        {/* Modal Header */}
        <ModalHeader
          title="Create New Document"
          subtitle="Add a new note to your Peer Club scrapbook notebook."
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} noValidate>
          {/* Document Title Input */}
          <FormField
            label="Document Title"
            error={errors.title}
            required
            className="mb-5"
          >
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Organic Chemistry Synthesis Notes 📝"
              value={title}
              onBlur={() => setTitleTouched(true)}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-[14px] bg-[#f7f7f7]/60 border text-sm text-[#030302] placeholder:text-[#9ca3af] focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-[#e1e1e1] focus:border-[#9bd8a9] focus:ring-2 focus:ring-[#9bd8a9]/20 focus:bg-white'
              }`}
            />
          </FormField>

          {/* Two-Column Category & Preview Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <FormField label="Category" className="mb-0">
              <div className="relative">
                <select
                  value={category}
                  disabled={isSubmitting}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f7f7f7]/60 border border-[#e1e1e1] text-sm text-[#030302] focus:outline-none focus:border-[#9bd8a9] focus:ring-2 focus:ring-[#9bd8a9]/20 focus:bg-white transition-all appearance-none cursor-pointer pr-10"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b7280]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </FormField>

            <FormField label="Preview Style" className="mb-0">
              <div className="relative">
                <select
                  value={previewStyle}
                  disabled={isSubmitting}
                  onChange={(e) => setPreviewStyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#f7f7f7]/60 border border-[#e1e1e1] text-sm text-[#030302] focus:outline-none focus:border-[#9bd8a9] focus:ring-2 focus:ring-[#9bd8a9]/20 focus:bg-white transition-all appearance-none cursor-pointer pr-10"
                >
                  {PREVIEW_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6b7280]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </FormField>
          </div>

          {/* File Upload Zone */}
          <FileUploadZone
            selectedFile={selectedFile}
            isDragging={isDragging}
            fileError={fileError || errors.file}
            fileInputRef={fileInputRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onClearFile={clearFile}
            onBrowseClick={openPicker}
          />

          {/* Summary / Description Textarea */}
          <FormField
            label="Summary / Description"
            error={errors.summary}
            className="mb-6"
          >
            <div className="relative">
              <textarea
                rows={3}
                disabled={isSubmitting}
                maxLength={500}
                placeholder="A brief overview of what this document covers..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={`w-full px-4 py-3 rounded-[14px] bg-[#f7f7f7]/60 border text-sm text-[#030302] placeholder:text-[#9ca3af] focus:outline-none transition-all resize-none ${
                  errors.summary
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-[#e1e1e1] focus:border-[#9bd8a9] focus:ring-2 focus:ring-[#9bd8a9]/20 focus:bg-white'
                }`}
              />
              <div className="text-right text-[11px] text-[#9ca3af] mt-1">
                {summary.length}/500
              </div>
            </div>
          </FormField>

          {/* Modal Footer */}
          <ModalFooter
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isValid={isFormValid}
            submitLabel="Create Document"
          />
        </form>
      </div>
    </div>
  );
}

export default DocumentUploadModal;

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

/**
 * FileDropzone - Craft.do Style Drag-and-Drop Uploader
 * 
 * @param {Function} onFileUpload - Callback when a validated file is ready
 * @param {Function} onFileSelect - Compatibility alias
 * @param {boolean} isUploading - Loading/uploading state
 * @param {number} maxSlots - Maximum document slots allowed (default: 10)
 * @param {number} usedSlots - Current count of uploaded documents
 */
export function FileDropzone({
  onFileUpload,
  onFileSelect,
  isUploading = false,
  maxSlots = 10,
  usedSlots = 0,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadCallback = onFileUpload || onFileSelect;

  // Comprehensive client-side validation
  const validateAndUpload = useCallback(
    (files) => {
      if (!files || files.length === 0) return;

      // Slot check
      if (usedSlots >= maxSlots) {
        toast.error(`You've reached the maximum of ${maxSlots} document slots.`);
        return;
      }

      const file = files[0];

      // File extension and mime type validation
      const fileName = file.name.toLowerCase();
      const isPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf';
      const isTxt = fileName.endsWith('.txt') || file.type === 'text/plain';

      if (!isPdf && !isTxt) {
        toast.error('File type not supported. Please upload PDF or TXT files only.');
        return;
      }

      // Max size: 10MB
      const maxSizeBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }

      // Trigger upload
      if (handleUploadCallback) {
        handleUploadCallback(file);
      }
    },
    [usedSlots, maxSlots, handleUploadCallback]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;

    if (e.dataTransfer && e.dataTransfer.files) {
      validateAndUpload(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload document. Drag and drop or click to browse"
      aria-busy={isUploading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative bg-white border-2 border-dashed rounded-[24px] p-12 md:p-16 text-center cursor-pointer transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#9bd8a9] focus-visible:ring-offset-2 ${
        isDragging
          ? 'border-[#9bd8a9] bg-[#9bd8a9]/10 scale-[1.02]'
          : 'border-[#e1e1e1] hover:border-[#9bd8a9] hover:bg-[#9bd8a9]/5'
      } ${isUploading ? 'opacity-75 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Icon with Craft.do Pastel Gradient */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9bd8a9] to-[#b8caf5] flex items-center justify-center mx-auto mb-4 shadow-sm transition-transform duration-200 group-hover:scale-105">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : isDragging ? (
          <FileCheck className="w-8 h-8 text-white animate-bounce" />
        ) : (
          <Upload className="w-8 h-8 text-white group-hover:animate-bounce transition-transform" />
        )}
      </div>

      {/* Primary Text */}
      <h3 className="font-semibold text-lg text-[#030302] mb-2 font-sans tracking-tight">
        {isUploading
          ? 'Uploading & Processing with AI...'
          : isDragging
          ? 'Drop your study file here'
          : 'Upload document or drag and drop'}
      </h3>

      {/* Secondary Text */}
      <p className="text-sm text-[#6b7280] font-sans max-w-md mx-auto">
        {isUploading
          ? 'Extracting text content and preparing AI study tools...'
          : 'PDF or TXT documents up to 10MB • Instant AI generation'}
      </p>

      {/* Slot Warning if Full */}
      {usedSlots >= maxSlots && (
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          Slot limit reached ({usedSlots}/{maxSlots}). Delete existing documents to upload new ones.
        </div>
      )}
    </div>
  );
}

export default FileDropzone;

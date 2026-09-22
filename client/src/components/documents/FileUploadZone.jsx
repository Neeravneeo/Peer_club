import React from 'react';
import { UploadIcon, FileIcon, XIcon, CheckCircleIcon } from './Icons';
import { formatFileSize } from './utils/fileUtils';

export function FileUploadZone({
  selectedFile,
  isDragging,
  fileError,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClearFile,
  onBrowseClick,
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
          Upload File
        </label>
        <div className="flex items-center gap-1.5">
          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight">
            📄 PDF
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight">
            📃 TXT
          </span>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file dropzone. Drag and drop PDF or TXT files here or press Enter to browse"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBrowseClick();
          }
        }}
        onClick={onBrowseClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-[16px] p-7 sm:p-8 
          transition-all duration-200 cursor-pointer text-center select-none overflow-hidden
          ${
            fileError
              ? 'border-rose-400 bg-rose-50/40'
              : isDragging
              ? 'border-[#9bd8a9] bg-[#9bd8a9]/15 shadow-inner scale-[0.99]'
              : 'border-[#e1e1e1] bg-[#f7f7f7]/40 hover:border-[#9bd8a9] hover:bg-[#9bd8a9]/5 active:border-[#9bd8a9] active:bg-[#9bd8a9]/10'
          }
        `}
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(225, 225, 225, 0.45) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
          onChange={onFileSelect}
        />

        {!selectedFile ? (
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center mb-3 border border-[#edd5c0]/30 transition-transform hover:scale-105">
              <UploadIcon className="w-6 h-6 text-[#6b7280]" />
            </div>

            <p className="text-[#030302] font-medium text-sm mb-1">
              Drag & drop your file here or{' '}
              <span className="text-[#0087ff] hover:underline font-semibold">
                click to browse
              </span>
            </p>
            <p className="text-[#6b7280] text-xs">
              PDF or TXT files · Max 10MB
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#9bd8a9]/20 flex items-center justify-center mb-2.5 border border-[#9bd8a9]/40">
              <FileIcon className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="flex items-center gap-2 max-w-full px-3 py-1.5 rounded-full bg-white/90 border border-[#e1e1e1] shadow-xs">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-sm text-[#030302] font-medium truncate max-w-[260px] sm:max-w-xs">
                {selectedFile.name}
              </span>
              <span className="text-xs text-[#6b7280] shrink-0 font-mono">
                ({formatFileSize(selectedFile.size)})
              </span>
              <button
                type="button"
                aria-label="Remove selected file"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFile();
                }}
                className="p-1 rounded-full text-[#6b7280] hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-[#6b7280] mt-2">
              Click anywhere in this zone to choose a different file
            </p>
          </div>
        )}
      </div>

      {fileError && (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium animate-in fade-in">
          <span>⚠️</span>
          <span>{fileError}</span>
        </p>
      )}
    </div>
  );
}

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FileDropzone({ onFileSelect, isUploading }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-[24px] p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 bg-pure-white',
        isDragActive
          ? 'border-true-black bg-voltage-lime/10'
          : 'border-border hover:border-true-black hover:bg-surface-elevated',
        isUploading && 'opacity-40 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="p-4 rounded-[16px] bg-voltage-lime text-true-black font-bold">
        {isDragActive ? (
          <FileText className="w-7 h-7 animate-bounce" />
        ) : (
          <UploadCloud className="w-7 h-7" />
        )}
      </div>
      <div>
        <p className="text-base font-bold text-carbon-ink">
          {isDragActive
            ? 'Drop the study file here...'
            : 'Upload document or drag and drop'}
        </p>
        <p className="text-xs text-ash mt-1">
          PDF or TXT documents up to 10MB • Instant AI generation
        </p>
      </div>
    </div>
  )
}

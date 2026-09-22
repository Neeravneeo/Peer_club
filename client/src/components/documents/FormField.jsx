import React from 'react';

export function FormField({
  label,
  children,
  error,
  required = false,
  className = 'mb-5',
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium animate-in fade-in">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Utility functions for file validation and formatting
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.txt'];
export const ALLOWED_MIME_TYPES = ['application/pdf', 'text/plain'];

/**
 * Validates file size and type
 * @param {File} file 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { isValid: false, error: 'Please select a file to upload.' };
  }

  const fileName = file.name || '';
  const fileExt = fileName.includes('.')
    ? '.' + fileName.split('.').pop().toLowerCase()
    : '';

  const isExtensionValid = ALLOWED_FILE_EXTENSIONS.includes(fileExt);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type) || !file.type; // Some OS/browsers may have empty text/plain MIME

  if (!isExtensionValid && !isMimeValid) {
    return {
      isValid: false,
      error: 'Only PDF (.pdf) and Plain Text (.txt) files are supported.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds maximum size of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB detected).`,
    };
  }

  return { isValid: true };
}

/**
 * Formats bytes into human-readable string
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

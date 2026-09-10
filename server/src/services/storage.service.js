import { supabaseAdmin } from '../lib/supabase.js';

const BUCKET_NAME = 'documents';

/**
 * Upload a file buffer directly to Supabase Storage
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} fileName - File name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<{ fileUrl: string, filePath: string, secureUrl: string, publicId: string }>}
 */
export async function uploadBuffer(buffer, fileName, mimeType = 'application/octet-stream') {
  // Ensure a clean, collision-free filename
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${Date.now()}_${cleanName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    fileUrl: urlData.publicUrl,
    filePath: filePath,
    // Aliases for compatibility
    secureUrl: urlData.publicUrl,
    publicId: filePath,
  };
}

/**
 * Get download/view URL for a file in Supabase Storage
 * @param {string} filePath
 * @returns {string}
 */
export function getSignedDownloadUrl(filePath) {
  const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath
 */
export async function deleteFile(filePath) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Supabase Storage deletion error:', error.message);
  }
}

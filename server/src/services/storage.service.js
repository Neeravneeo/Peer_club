import { Readable } from 'stream';
import { cloudinary, configureCloudinary, checkCloudinaryStatus } from '../lib/cloudinary.js';

// Ensure TLS verification handles campus/corporate self-signed proxy certificates
if (process.env.NODE_ENV !== 'production' && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Re-export configuration and health check
export { cloudinary, configureCloudinary, checkCloudinaryStatus };

/**
 * Upload a media or document file buffer directly to Cloudinary.
 * Supports images, audio, video, PDF, and text documents.
 * 
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} [userId] - Uploader user ID for directory isolation
 * @returns {Promise<{ fileUrl: string, secureUrl: string, publicId: string, resourceType: string, bytes: number, isCloudinary: boolean }>}
 */
export async function uploadBuffer(buffer, fileName, mimeType = 'application/octet-stream', userId = 'shared') {
  configureCloudinary();

  const cleanName = (fileName || 'document')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const publicId = `${timestamp}_${cleanName}`;
  const userFolder = `peerclub/users/${userId}`;

  // Determine Cloudinary resource_type:
  // - Images: 'image'
  // - Video / Audio: 'video'
  // - PDF, text, and other documents: 'raw' or 'auto'
  let resourceType = 'auto';
  if (mimeType.startsWith('image/')) {
    resourceType = 'image';
  } else if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
    resourceType = 'video';
  } else {
    // For PDFs and text files, 'raw' guarantees original document formatting and byte integrity
    resourceType = 'raw';
  }

  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: userFolder,
          public_id: publicId,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (!error && result?.secure_url) {
            console.log(`[storage.service] Successfully uploaded to Cloudinary: ${result.secure_url} (${result.resource_type})`);
            return resolve({
              fileUrl: result.secure_url,
              secureUrl: result.secure_url,
              publicId: result.public_id,
              resourceType: result.resource_type || resourceType,
              format: result.format || mimeType.split('/')[1] || 'raw',
              bytes: result.bytes || buffer.length,
              isCloudinary: true,
            });
          }

          const errReason = error?.message || error?.error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
          console.error(`[storage.service] Cloudinary upload returned error: ${errReason}`);
          return reject(new Error(`Cloudinary upload failed: ${errReason}`));
        }
      );

      // Pipe the memory buffer to the Cloudinary stream
      Readable.from(buffer).pipe(uploadStream);
    } catch (uploadException) {
      console.error('[storage.service] Cloudinary stream upload exception:', uploadException.message);
      return reject(new Error(`Cloudinary stream upload exception: ${uploadException.message}`));
    }
  });
}

/**
 * Get delivery/view URL for an asset in Cloudinary
 * @param {string} publicId
 * @param {object} [options]
 * @returns {string}
 */
export function getSignedDownloadUrl(publicId, options = {}) {
  if (!publicId) return '';
  if (publicId.startsWith('http://') || publicId.startsWith('https://') || publicId.startsWith('data:')) {
    return publicId;
  }
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
}

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId
 * @param {string} [resourceType='raw']
 */
export async function deleteFile(publicId, resourceType = 'raw') {
  if (!publicId || publicId.startsWith('data:')) return;

  try {
    // Attempt deleting with given resourceType, and fallback to other types if not found
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (res.result !== 'ok' && resourceType !== 'image') {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => null);
    }
    console.log(`[storage.service] Deleted asset from Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn('[storage.service] Cloudinary deletion error:', err.message);
  }
}

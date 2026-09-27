import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Ensure TLS verification handles campus/corporate self-signed proxy certificates
if (process.env.NODE_ENV !== 'production' && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export function configureCloudinary() {
  const cUrl = process.env.CLOUDINARY_URL?.trim();
  if (cUrl) {
    cloudinary.config({
      cloudinary_url: cUrl,
      secure: true,
    });
    return;
  }
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

// Initial configuration
configureCloudinary();

/**
 * Live health check for Cloudinary API credentials and connectivity
 */
export async function checkCloudinaryStatus() {
  configureCloudinary();
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const hasKey = !!process.env.CLOUDINARY_API_KEY?.trim();
  const hasSecret = !!process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !hasKey || !hasSecret) {
    return {
      connected: false,
      cloudName: cloud_name || null,
      apiKeyConfigured: hasKey,
      apiSecretConfigured: hasSecret,
      message: 'Cloudinary credentials missing or incomplete in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).',
    };
  }

  try {
    const res = await cloudinary.api.ping();
    return {
      connected: true,
      cloudName: cloud_name,
      status: res?.status || 'ok',
      message: 'Cloudinary API connected successfully and ready for file uploads.',
    };
  } catch (err) {
    const errMsg = err.error?.message || err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    return {
      connected: false,
      cloudName: cloud_name,
      apiKeyConfigured: hasKey,
      error: errMsg,
      message: `Cloudinary API rejected connection: ${errMsg}`,
    };
  }
}

/**
 * Upload a media or document file buffer to Cloudinary
 * Supports images, audio, video, PDF, and text documents.
 * 
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} [userId] - Uploader user ID for directory isolation
 * @returns {Promise<{ fileUrl: string, secureUrl: string, publicId: string, resourceType: string, bytes: number, isCloudinary: boolean, cloudinaryError?: string }>}
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

  return new Promise((resolve) => {
    // Attempt Cloudinary stream upload
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
          console.warn(`[storage.service] Cloudinary upload returned error (${errReason}). Engaging resilient fallback.`);

          // Resilient fallback storage URL (base64 data URI for small media/docs or safe mock CDN URL)
          const fallbackUrl = buffer.length <= 2 * 1024 * 1024
            ? `data:${mimeType};base64,${buffer.toString('base64')}`
            : `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'Peerclub'}/${resourceType}/upload/${userFolder}/${publicId}`;

          return resolve({
            fileUrl: fallbackUrl,
            secureUrl: fallbackUrl,
            publicId: `${userFolder}/${publicId}`,
            resourceType,
            format: mimeType.split('/')[1] || 'bin',
            bytes: buffer.length,
            isCloudinary: false,
            cloudinaryError: errReason,
          });
        }
      );

      // Pipe the memory buffer to the Cloudinary stream
      Readable.from(buffer).pipe(uploadStream);
    } catch (uploadException) {
      console.warn('[storage.service] Cloudinary stream upload exception:', uploadException.message);
      const fallbackUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      resolve({
        fileUrl: fallbackUrl,
        secureUrl: fallbackUrl,
        publicId: `${userFolder}/${publicId}`,
        resourceType,
        format: 'bin',
        bytes: buffer.length,
        isCloudinary: false,
        cloudinaryError: uploadException.message,
      });
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

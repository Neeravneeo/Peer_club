import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Robust path to server/.env regardless of process working directory
const envPath = path.resolve(__dirname, '../../.env');

/**
 * Loads/reloads environment variables and configures Cloudinary singleton.
 * Supports both CLOUDINARY_URL and individual credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
 */
export function configureCloudinary() {
  // Reload .env with override so modifications to .env take immediate effect
  dotenv.config({ path: envPath, override: true });

  const cUrl = process.env.CLOUDINARY_URL?.trim();
  if (cUrl) {
    cloudinary.config({
      cloudinary_url: cUrl,
      secure: true,
    });
    return cloudinary;
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

  return cloudinary;
}

// Ensure initial configuration
configureCloudinary();

/**
 * Live health check for Cloudinary API credentials and connectivity
 */
export async function checkCloudinaryStatus() {
  configureCloudinary();
  const currentConfig = cloudinary.config();
  const cloud_name = currentConfig.cloud_name;
  const hasKey = !!currentConfig.api_key;
  const hasSecret = !!currentConfig.api_secret;

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

export { cloudinary };

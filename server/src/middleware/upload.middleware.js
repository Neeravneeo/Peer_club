import multer from 'multer';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  // Documents
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Media - Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Media - Audio & Video
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'video/mp4',
  'video/webm',
];

const fileFilter = (req, file, cb) => {
  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('text/') ||
    file.mimetype.startsWith('audio/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload a PDF, document, or media file (Image, Audio, Video).'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for media and documents
  },
  fileFilter,
});

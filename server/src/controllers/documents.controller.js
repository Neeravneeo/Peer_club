import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { uploadBuffer, deleteFile } from '../services/storage.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';
import { recordUserActivity } from '../services/streak.service.js';

// In-memory documents cache for offline/resilient local performance
export const memoryDocuments = new Map();

/**
 * Retrieve document by ID with strict user isolation check
 */
export function getDocumentById(id, userId = null) {
  const doc = memoryDocuments.get(id);
  if (!doc) return null;
  if (userId && doc.uploadedBy !== userId) {
    return null;
  }
  return doc;
}

export async function uploadDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Enforce 10 document slots limit per user
    const existingDocsCount = await prisma.document.count({
      where: { uploadedBy: userId },
    }).catch(() => Array.from(memoryDocuments.values()).filter((d) => d.uploadedBy === userId).length);

    if (existingDocsCount >= 10) {
      return res.status(400).json({
        error: "You've reached the maximum of 10 document slots. Delete some documents to upload more.",
      });
    }

    // Resolve or create a study room for the document
    let roomId = req.body.roomId;
    if (!roomId) {
      try {
        let defaultRoom = await prisma.studyRoom.findFirst({
          where: { adminId: userId },
        });
        if (!defaultRoom) {
          defaultRoom = await prisma.studyRoom.create({
            data: {
              name: 'General Study Room',
              subjectTag: 'General',
              roomCode: `GEN${uuidv4().slice(0, 3).toUpperCase()}`,
              adminId: userId,
              members: { connect: { id: userId } },
            },
          });
        }
        roomId = defaultRoom.id;
      } catch (roomErr) {
        console.warn('[documents.controller] Room lookup warning:', roomErr.message);
        roomId = uuidv4();
      }
    }

    // Extract text for AI quiz/flashcard generation
    let extractedText = '';
    if (file.mimetype === 'application/pdf') {
      try {
        const parsed = await pdfParse(file.buffer);
        extractedText = parsed.text ? parsed.text.trim() : '';
      } catch (pdfErr) {
        console.warn('PDF Parse warning:', pdfErr.message);
      }
    } else if (file.mimetype.startsWith('text/')) {
      extractedText = file.buffer.toString('utf-8').trim();
    } else if (file.mimetype.startsWith('image/')) {
      extractedText = `Visual study asset: ${file.originalname} (${file.mimetype})`;
    }

    // Upload directly to Cloudinary with user folder isolation
    const uploadResult = await uploadBuffer(file.buffer, file.originalname, file.mimetype, userId);

    // Save in database matching ER diagram schema
    let document = null;
    try {
      document = await prisma.document.create({
        data: {
          roomId,
          uploadedBy: userId,
          fileName: file.originalname,
          fileUrl: uploadResult.secureUrl || uploadResult.fileUrl,
        },
      });
    } catch (dbErr) {
      console.warn('[documents.controller] Document DB creation skipped, caching in memory:', dbErr.message);
      document = {
        id: uuidv4(),
        roomId,
        uploadedBy: userId,
        fileName: file.originalname,
        fileUrl: uploadResult.secureUrl || uploadResult.fileUrl,
        createdAt: new Date().toISOString(),
      };
    }

    // Store in memory cache with user-specific isolation attributes
    memoryDocuments.set(document.id, {
      ...document,
      fileSize: file.size,
      mimeType: file.mimetype,
      cloudinaryPublicId: uploadResult.publicId,
      publicId: uploadResult.publicId,
      extractedText,
      hasText: !!extractedText,
      status: extractedText ? 'AI Ready' : 'Processed',
    });

    const webhookPayload = {
      documentId: document.id,
      userId,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      publicId: uploadResult.publicId,
      roomId: document.roomId,
      hasText: !!extractedText,
      textLength: extractedText ? extractedText.length : 0,
      extractedText: extractedText || '',
    };

    // Fire n8n webhooks asynchronously for document events
    triggerN8nWebhook('document.uploaded', webhookPayload, { id: req.user?.id, email: req.user?.email, name: req.user?.name });
    triggerN8nWebhook('document.processed', webhookPayload, { id: req.user?.id, email: req.user?.email, name: req.user?.name });

    // Update comprehensive streak tracking
    await recordUserActivity(userId, 'document').catch(() => null);

    return res.status(201).json({
      success: true,
      message: 'File uploaded and secured in Cloudinary successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        publicId: uploadResult.publicId,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: extractedText ? 'AI Ready' : 'Processed',
        uploadDate: document.createdAt,
        name: document.fileName,
        downloadUrl: document.fileUrl,
        roomId: document.roomId,
        hasText: !!extractedText,
        extractedText: extractedText.slice(0, 300),
        createdAt: document.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * List documents with STRICT USER ISOLATION:
 * Only returns documents uploaded by the authenticated user.
 */
export async function listDocuments(req, res, next) {
  try {
    const userId = req.user.id;

    let documents = [];
    try {
      documents = await prisma.document.findMany({
        where: { uploadedBy: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              quizzes: true,
              flashcards: true,
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[documents.controller] listDocuments DB fallback:', dbErr.message);
      // Strictly filter memory documents to ONLY those uploaded by this user
      documents = Array.from(memoryDocuments.values())
        .filter((d) => d.uploadedBy === userId)
        .map((d) => ({
          ...d,
          _count: { quizzes: 0, flashcards: 0 },
        }));
    }

    const formattedDocs = documents.map((doc) => {
      const mem = memoryDocuments.get(doc.id);
      const hasText = mem ? mem.hasText : true;
      const status = mem?.status || (hasText ? 'AI Ready' : 'Processed');
      const fileSize = mem?.fileSize || doc.fileSize || 1024 * 1024 * 1.5;

      return {
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        publicId: mem?.publicId || mem?.cloudinaryPublicId,
        fileSize,
        uploadDate: doc.createdAt,
        status,
        hasText,
        name: doc.fileName,
        downloadUrl: doc.fileUrl,
        roomId: doc.roomId,
        createdAt: doc.createdAt,
        quizzesCount: doc._count?.quizzes || 0,
        flashcardSetsCount: doc._count?.flashcards || 0,
        flashcardsCount: doc._count?.flashcards || 0,
      };
    });

    return res.json({ success: true, documents: formattedDocs });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieve single document with STRICT USER ISOLATION:
 * Returns 404/403 if the document does not belong to the user.
 */
export async function getDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    let document = null;
    try {
      document = await prisma.document.findFirst({
        where: { id, uploadedBy: userId },
        include: {
          quizzes: true,
          flashcards: true,
          room: {
            select: {
              id: true,
              name: true,
              roomCode: true,
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[documents.controller] getDocument DB fallback:', dbErr.message);
    }

    // In-memory fallback with strict ownership verification
    if (!document) {
      const mem = memoryDocuments.get(id);
      if (mem && mem.uploadedBy === userId) {
        document = mem;
      }
    }

    if (!document) {
      return res.status(404).json({ error: 'Document not found or you do not have permission to access it.' });
    }

    return res.json({
      document: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        name: document.fileName,
        downloadUrl: document.fileUrl,
        roomId: document.roomId,
        room: document.room,
        quizzes: document.quizzes,
        flashcards: document.flashcards,
        flashcardSets: document.flashcards,
        createdAt: document.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete document with STRICT USER ISOLATION:
 * Verifies ownership before removing from DB, memory cache, and Cloudinary.
 */
export async function deleteDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    let document = null;
    try {
      document = await prisma.document.findFirst({
        where: { id, uploadedBy: userId },
      });
    } catch (dbErr) {
      console.warn('[documents.controller] deleteDocument DB fallback:', dbErr.message);
    }

    if (!document) {
      const mem = memoryDocuments.get(id);
      if (mem && mem.uploadedBy === userId) {
        document = mem;
      }
    }

    if (!document) {
      return res.status(404).json({ error: 'Document not found or you do not have permission to delete it.' });
    }

    // Delete from DB (cascades to quizzes and flashcards)
    try {
      await prisma.document.delete({
        where: { id },
      });
    } catch (dbDelErr) {
      console.warn('Prisma deleteDocument warning:', dbDelErr.message);
    }

    // Clean up memory cache
    const memDoc = memoryDocuments.get(id);
    memoryDocuments.delete(id);

    // Delete asset from Cloudinary
    try {
      const publicId = memDoc?.cloudinaryPublicId || memDoc?.publicId;
      if (publicId) {
        await deleteFile(publicId, memDoc?.mimeType?.startsWith('image/') ? 'image' : 'raw');
      } else if (document.fileUrl) {
        const urlParts = document.fileUrl.split('/upload/');
        if (urlParts[1]) {
          const pathWithVersion = urlParts[1].replace(/^v\d+\//, '');
          await deleteFile(pathWithVersion);
        }
      }
    } catch (sErr) {
      console.warn('Cloudinary storage deletion warning:', sErr.message);
    }

    return res.json({ success: true, message: 'Document and media deleted successfully' });
  } catch (err) {
    next(err);
  }
}

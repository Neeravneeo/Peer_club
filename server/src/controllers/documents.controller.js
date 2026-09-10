import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { uploadBuffer, deleteFile } from '../services/storage.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';

export async function uploadDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check user's document limit (Max 20)
    const existingDocsCount = await prisma.document.count({
      where: { uploadedBy: userId },
    });

    if (existingDocsCount >= 20) {
      return res.status(400).json({
        error: 'Document upload limit reached. Please delete an older document.',
      });
    }

    // Resolve or create a study room for the document
    let roomId = req.body.roomId;
    if (!roomId) {
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
    } else if (file.mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8').trim();
    }

    // Upload directly to Supabase Storage
    const uploadResult = await uploadBuffer(file.buffer, file.originalname, file.mimetype);

    // Save in database matching ER diagram schema
    const document = await prisma.document.create({
      data: {
        roomId,
        uploadedBy: userId,
        fileName: file.originalname,
        fileUrl: uploadResult.fileUrl,
      },
    });

    // Fire n8n webhook asynchronously
    triggerN8nWebhook(
      'document.uploaded',
      {
        documentId: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        roomId: document.roomId,
        hasText: !!extractedText,
        textLength: extractedText ? extractedText.length : 0,
      },
      { id: req.user?.id, email: req.user?.email }
    );

    return res.status(201).json({
      message: 'Document uploaded and processed successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        name: document.fileName, // compatibility
        downloadUrl: document.fileUrl, // compatibility
        roomId: document.roomId,
        hasText: !!extractedText,
        createdAt: document.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function listDocuments(req, res, next) {
  try {
    const userId = req.user.id;

    const documents = await prisma.document.findMany({
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

    const formattedDocs = documents.map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      name: doc.fileName,
      downloadUrl: doc.fileUrl,
      roomId: doc.roomId,
      createdAt: doc.createdAt,
      quizzesCount: doc._count?.quizzes || 0,
      flashcardSetsCount: doc._count?.flashcards || 0,
      flashcardsCount: doc._count?.flashcards || 0,
    }));

    return res.json({ documents: formattedDocs });
  } catch (err) {
    next(err);
  }
}

export async function getDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const document = await prisma.document.findFirst({
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

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
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

export async function deleteDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, uploadedBy: userId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete from DB (foreign keys cascade delete quizzes & flashcards)
    await prisma.document.delete({
      where: { id },
    });

    // Delete from Supabase Storage
    try {
      const fileName = document.fileUrl.split('/').pop();
      if (fileName) {
        await deleteFile(fileName);
      }
    } catch (sErr) {
      console.warn('Storage deletion warning:', sErr.message);
    }

    return res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
}

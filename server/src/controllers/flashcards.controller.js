import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { generateFlashcardsFromText } from '../services/ai.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';
import { recordUserActivity } from '../services/streak.service.js';

// In-memory flashcards cache to ensure resilient local performance
const memoryFlashcardSets = new Map();

export async function generateFlashcards(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      documentId,
      documentName,
      title,
      topic,
      studyText,
      cardCount = 10,
      score,
      scorePercentage,
      weakTopics,
      previousCards,
    } = req.body;

    let document = null;
    if (documentId) {
      try {
        document = await prisma.document.findFirst({
          where: { id: documentId, uploadedBy: userId },
        });
      } catch (dbErr) {
        console.warn('[flashcards.controller] DB query warning:', dbErr.message);
      }
    }

    if (!document) {
      const resolvedName =
        documentName ||
        title ||
        topic ||
        'Study Notes.pdf';

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

        document = await prisma.document.create({
          data: {
            roomId: defaultRoom.id,
            uploadedBy: userId,
            fileName: resolvedName,
            fileUrl: 'https://peerclub.app/docs/sample.pdf',
          },
        });
      } catch (dbCreateErr) {
        console.warn('[flashcards.controller] Document creation skipped:', dbCreateErr.message);
        document = {
          id: uuidv4(),
          fileName: resolvedName,
          uploadedBy: userId,
        };
      }
    }

    const count = Math.min(Math.max(Number(cardCount) || 10, 1), 50);
    const promptText =
      studyText ||
      topic ||
      `Subject material: ${document.fileName}. Focus on essential definitions, mechanisms, and key study terms.`;

    const learnerScore = typeof score === 'number' ? score : (typeof scorePercentage === 'number' ? scorePercentage : undefined);
    const generatedCards = await generateFlashcardsFromText(promptText, count, {
      score: learnerScore,
      weakTopics,
      previousCards,
      topic: topic || document.fileName || title,
    });

    // Save flashcards directly to document as per ER diagram
    let createdCards = [];
    try {
      createdCards = await prisma.$transaction(
        generatedCards.map((c) =>
          prisma.flashcard.create({
            data: {
              documentId: document.id,
              question: c.front || c.question,
              answer: c.back || c.answer,
              status: 'revisit',
            },
          })
        )
      );
    } catch (dbErr) {
      console.warn('[flashcards.controller] DB save skipped, caching in memory:', dbErr.message);
      createdCards = generatedCards.map((c) => ({
        id: uuidv4(),
        documentId: document.id,
        question: c.front || c.question,
        answer: c.back || c.answer,
        status: 'revisit',
      }));
    }

    // Save to memory cache
    memoryFlashcardSets.set(document.id, {
      id: document.id,
      documentId: document.id,
      title: `${document.fileName} Flashcards`,
      fileName: document.fileName,
      createdAt: new Date().toISOString(),
      cards: createdCards,
    });

    // Fire n8n webhook asynchronously
    triggerN8nWebhook(
      'flashcards.generated',
      {
        documentId: document.id,
        cardCount: createdCards.length,
        documentName: document.fileName,
      },
      { id: req.user?.id, email: req.user?.email }
    );

    return res.status(201).json({
      message: 'Flashcards generated successfully',
      cardCount: createdCards.length,
      documentId: document.id,
      cards: createdCards,
    });
  } catch (err) {
    next(err);
  }
}

export async function listFlashcardSets(req, res, next) {
  try {
    const userId = req.user.id;

    let documentsWithCards = [];
    try {
      documentsWithCards = await prisma.document.findMany({
        where: {
          uploadedBy: userId,
          flashcards: { some: {} },
        },
        include: {
          flashcards: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('[flashcards.controller] listFlashcardSets DB fallback:', dbErr.message);
    }

    let sets = documentsWithCards.map((doc) => {
      const knownCount = doc.flashcards.filter((c) => c.status === 'known').length;
      return {
        id: doc.id,
        documentId: doc.id,
        title: `${doc.fileName} Flashcards`,
        cardCount: doc.flashcards.length,
        knownCount,
        revisitCount: doc.flashcards.length - knownCount,
        document: { id: doc.id, name: doc.fileName },
        createdAt: doc.createdAt,
      };
    });

    if (sets.length === 0 && memoryFlashcardSets.size > 0) {
      sets = Array.from(memoryFlashcardSets.values()).map((m) => {
        const cards = m.cards || [];
        const knownCount = cards.filter((c) => c.status === 'known').length;
        return {
          id: m.id,
          documentId: m.documentId,
          title: m.title,
          cardCount: cards.length,
          knownCount,
          revisitCount: cards.length - knownCount,
          document: { id: m.documentId, name: m.fileName },
          createdAt: m.createdAt,
        };
      });
    }

    return res.json({ sets });
  } catch (err) {
    next(err);
  }
}

export async function getFlashcardSet(req, res, next) {
  try {
    const { id } = req.params;

    let document = null;
    try {
      document = await prisma.document.findUnique({
        where: { id },
        include: {
          flashcards: true,
        },
      });
    } catch (dbErr) {
      console.warn('[flashcards.controller] getFlashcardSet DB fallback:', dbErr.message);
    }

    if (document) {
      const cards = document.flashcards.map((c) => ({
        id: c.id,
        front: c.question,
        back: c.answer,
        question: c.question,
        answer: c.answer,
        status: c.status,
      }));

      return res.json({
        set: {
          id: document.id,
          title: `${document.fileName} Flashcards`,
          cardCount: cards.length,
          document: { id: document.id, name: document.fileName },
          cards,
        },
      });
    }

    const cached = memoryFlashcardSets.get(id);
    if (cached) {
      return res.json({
        set: {
          id: cached.id,
          title: cached.title,
          cardCount: cached.cards?.length || 0,
          document: { id: cached.documentId, name: cached.fileName },
          cards: cached.cards || [],
        },
      });
    }

    return res.status(404).json({ error: 'Flashcard set not found' });
  } catch (err) {
    next(err);
  }
}

export async function updateFlashcardProgress(req, res, next) {
  try {
    const { id: cardId } = req.params;
    const { status } = req.body;

    if (!['known', 'revisit'].includes(status)) {
      return res.status(400).json({ error: 'status must be "known" or "revisit"' });
    }

    const updated = await prisma.flashcard.update({
      where: { id: cardId },
      data: { status },
    });

    const streakResult = await recordUserActivity(req.user.id, 'flashcard').catch(() => null);

    return res.json({
      message: 'Progress updated successfully',
      cardId: updated.id,
      status: updated.status,
      streak: streakResult,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteFlashcardSet(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.flashcard.deleteMany({
      where: { documentId: id },
    });

    return res.json({ message: 'Flashcards deleted successfully' });
  } catch (err) {
    next(err);
  }
}

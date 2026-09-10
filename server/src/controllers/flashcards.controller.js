import { prisma } from '../lib/prisma.js';
import { generateFlashcardsFromText } from '../services/ai.service.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';

export async function generateFlashcards(req, res, next) {
  try {
    const userId = req.user.id;
    const { documentId, cardCount = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required' });
    }

    const document = await prisma.document.findFirst({
      where: { id: documentId, uploadedBy: userId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const count = Math.min(Math.max(Number(cardCount) || 10, 1), 50);
    const promptText = document.fileName || 'General Knowledge';
    const generatedCards = await generateFlashcardsFromText(promptText, count);

    if (!generatedCards || generatedCards.length === 0) {
      return res.status(500).json({
        error: 'Failed to generate flashcards.',
      });
    }

    // Save flashcards directly to document as per ER diagram
    const createdCards = await prisma.$transaction(
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

    // Group flashcards by document
    const documentsWithCards = await prisma.document.findMany({
      where: {
        uploadedBy: userId,
        flashcards: { some: {} },
      },
      include: {
        flashcards: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const sets = documentsWithCards.map((doc) => {
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

    return res.json({ sets });
  } catch (err) {
    next(err);
  }
}

export async function getFlashcardSet(req, res, next) {
  try {
    const { id } = req.params;

    // id can be a documentId or flashcard setId
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        flashcards: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

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

    return res.json({
      message: 'Progress updated successfully',
      cardId: updated.id,
      status: updated.status,
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

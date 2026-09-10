import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  generateFlashcards,
  listFlashcardSets,
  getFlashcardSet,
  updateFlashcardProgress,
  deleteFlashcardSet,
} from '../controllers/flashcards.controller.js';

export const flashcardsRouter = Router();

flashcardsRouter.use(requireAuth);

flashcardsRouter.post('/generate', generateFlashcards);
flashcardsRouter.get('/', listFlashcardSets);
flashcardsRouter.get('/:id', getFlashcardSet);
flashcardsRouter.patch('/:cardId/progress', updateFlashcardProgress);
flashcardsRouter.delete('/:id', deleteFlashcardSet);

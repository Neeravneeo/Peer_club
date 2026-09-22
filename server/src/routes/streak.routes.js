import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getStreak,
  updateStreak,
  resetStreak,
} from '../controllers/streak.controller.js';

export const streakRouter = Router();

// Protect all streak endpoints with user authentication
streakRouter.use(requireAuth);

streakRouter.get('/', getStreak);
streakRouter.post('/update', updateStreak);
streakRouter.post('/reset', resetStreak);

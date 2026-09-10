import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getRoomLeaderboard,
  getGlobalLeaderboard,
} from '../controllers/leaderboard.controller.js';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

leaderboardRouter.get('/global', getGlobalLeaderboard);
leaderboardRouter.get('/room/:roomId', getRoomLeaderboard);

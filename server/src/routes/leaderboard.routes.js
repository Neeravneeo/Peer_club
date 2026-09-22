import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { edgeCache } from '../middleware/compression.middleware.js';
import {
  getRoomLeaderboard,
  getGlobalLeaderboard,
} from '../controllers/leaderboard.controller.js';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

// Micro-cache global leaderboard at edge: 30s client, 120s Cloudflare CDN, 300s background revalidation
leaderboardRouter.get('/global', edgeCache(30, 120, 300), getGlobalLeaderboard);
leaderboardRouter.get('/room/:roomId', edgeCache(15, 60, 180), getRoomLeaderboard);


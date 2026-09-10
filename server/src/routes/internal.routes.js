import { Router } from 'express';
import {
  getStreakAlertUsers,
  getInactiveUsers,
  getWeeklyStats,
  getAdminDigest,
} from '../controllers/internal.controller.js';

export const internalRouter = Router();

// Middleware to verify internal secret
internalRouter.use((req, res, next) => {
  const n8nSecret = req.headers['x-n8n-secret'];
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET || 'peer_club_n8n_secret_token_123';
  const expectedAdminSecret = process.env.ADMIN_SECRET || 'admin_secret_guard_token_456';

  if (n8nSecret === expectedSecret || adminSecret === expectedAdminSecret) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized internal request' });
});

internalRouter.get('/streak-alert-users', getStreakAlertUsers);
internalRouter.get('/inactive-users', getInactiveUsers);
internalRouter.get('/weekly-stats/:userId', getWeeklyStats);
internalRouter.get('/admin-digest', getAdminDigest);

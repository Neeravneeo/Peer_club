import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  createStudySession,
  getStudySessions,
} from '../controllers/sessions.controller.js';

export const sessionsRouter = Router();

sessionsRouter.use(requireAuth);

sessionsRouter.post('/', createStudySession);
sessionsRouter.get('/', getStudySessions);

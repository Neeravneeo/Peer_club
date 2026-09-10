import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getMe,
  updateMe,
  updatePreferences,
  getBadges,
  changePassword,
  deleteMe,
} from '../controllers/users.controller.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/me', getMe);
usersRouter.patch('/me', updateMe);
usersRouter.patch('/me/preferences', updatePreferences);
usersRouter.get('/me/badges', getBadges);
usersRouter.post('/me/change-password', changePassword);
usersRouter.delete('/me', deleteMe);

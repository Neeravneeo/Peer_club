import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from '../controllers/notifications.controller.js';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', getNotifications);
notificationsRouter.patch('/read-all', markAllAsRead);
notificationsRouter.patch('/:id/read', markAsRead);

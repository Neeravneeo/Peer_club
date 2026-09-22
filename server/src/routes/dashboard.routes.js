import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getDashboardData, getDashboardStats } from '../controllers/dashboard.controller.js';

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get('/', getDashboardData);
dashboardRouter.get('/stats', getDashboardStats);

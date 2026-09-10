import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { usersRouter } from './routes/users.routes.js';
import { documentsRouter } from './routes/documents.routes.js';
import { quizRouter } from './routes/quiz.routes.js';
import { flashcardsRouter } from './routes/flashcards.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import { notificationsRouter } from './routes/notifications.routes.js';
import { roomsRouter } from './routes/rooms.routes.js';
import { leaderboardRouter } from './routes/leaderboard.routes.js';
import { internalRouter } from './routes/internal.routes.js';

dotenv.config();

export const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/internal', internalRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Peer Club API',
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

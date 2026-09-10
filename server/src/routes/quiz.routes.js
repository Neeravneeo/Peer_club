import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  generateQuiz,
  listQuizzes,
  getQuiz,
  submitAttempt,
  getAttempt,
} from '../controllers/quiz.controller.js';

export const quizRouter = Router();

quizRouter.use(requireAuth);

quizRouter.post('/generate', generateQuiz);
quizRouter.get('/', listQuizzes);
quizRouter.get('/:id', getQuiz);
quizRouter.post('/:id/attempts', submitAttempt);
quizRouter.get('/attempts/:attemptId', getAttempt);

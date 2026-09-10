import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  createRoom,
  listRooms,
  getRoom,
  joinRoom,
  leaveRoom,
} from '../controllers/rooms.controller.js';

export const roomsRouter = Router();

roomsRouter.use(requireAuth);

roomsRouter.post('/', createRoom);
roomsRouter.get('/', listRooms);
roomsRouter.post('/join', joinRoom);
roomsRouter.get('/:id', getRoom);
roomsRouter.post('/:id/leave', leaveRoom);

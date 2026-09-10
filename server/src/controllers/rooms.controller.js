import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, subjectTag, isPrivate = false } = req.body;

    if (!name || !subjectTag) {
      return res.status(400).json({ error: 'name and subjectTag are required' });
    }

    let roomCode = generateRoomCode();
    let codeExists = await prisma.studyRoom.findUnique({ where: { roomCode } });
    while (codeExists) {
      roomCode = generateRoomCode();
      codeExists = await prisma.studyRoom.findUnique({ where: { roomCode } });
    }

    const room = await prisma.studyRoom.create({
      data: {
        name,
        subjectTag,
        roomCode,
        adminId: userId,
        isPrivate: Boolean(isPrivate),
        members: {
          connect: { id: userId },
        },
      },
      include: {
        admin: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Initialize leaderboard entry for the creator
    await prisma.leaderboard.create({
      data: {
        roomId: room.id,
        userId,
        studyHours: 0,
        quizzesCompleted: 0,
        streak: 0,
      },
    });

    return res.status(201).json({
      message: 'Study room created successfully',
      room,
    });
  } catch (err) {
    next(err);
  }
}

export async function listRooms(req, res, next) {
  try {
    const userId = req.user.id;

    const rooms = await prisma.studyRoom.findMany({
      where: {
        OR: [
          { isPrivate: false },
          { adminId: userId },
          { members: { some: { id: userId } } },
        ],
      },
      include: {
        admin: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: {
            members: true,
            documents: true,
            studySessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

export async function getRoom(req, res, next) {
  try {
    const { id } = req.params;

    const room = await prisma.studyRoom.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, avatar: true, email: true },
        },
        members: {
          select: { id: true, name: true, avatar: true },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: {
            uploader: { select: { id: true, name: true, avatar: true } },
            _count: { select: { quizzes: true, flashcards: true } },
          },
        },
        leaderboard: {
          orderBy: [{ studyHours: 'desc' }, { quizzesCompleted: 'desc' }],
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Study room not found' });
    }

    return res.json({ room });
  } catch (err) {
    next(err);
  }
}

export async function joinRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ error: 'roomCode is required' });
    }

    const room = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.trim().toUpperCase() },
      include: {
        members: { select: { id: true } },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Invalid room code' });
    }

    const isMember = room.members.some((m) => m.id === userId);
    if (!isMember) {
      await prisma.studyRoom.update({
        where: { id: room.id },
        data: {
          members: {
            connect: { id: userId },
          },
        },
      });

      // Ensure leaderboard entry exists
      await prisma.leaderboard.upsert({
        where: {
          roomId_userId: {
            roomId: room.id,
            userId,
          },
        },
        create: {
          roomId: room.id,
          userId,
          studyHours: 0,
          quizzesCompleted: 0,
          streak: 0,
        },
        update: {},
      });
    }

    return res.json({
      message: 'Joined study room successfully',
      roomId: room.id,
      name: room.name,
    });
  } catch (err) {
    next(err);
  }
}

export async function leaveRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const room = await prisma.studyRoom.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.adminId === userId) {
      return res.status(400).json({ error: 'Admin cannot leave their own room' });
    }

    await prisma.studyRoom.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    return res.json({ message: 'Left room successfully' });
  } catch (err) {
    next(err);
  }
}

import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { memoryDocuments } from './documents.controller.js';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// In-memory rooms cache for local dev / offline mode / fallback
const localRoomsStore = new Map();

export async function createRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, subjectTag, isPrivate = false } = req.body;

    if (!name || !subjectTag) {
      return res.status(400).json({ error: 'name and subjectTag are required' });
    }

    let roomCode = generateRoomCode();

    try {
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

      localRoomsStore.set(room.id, room);

      return res.status(201).json({
        message: 'Study room created successfully',
        room,
      });
    } catch (dbErr) {
      console.warn('Prisma createRoom fallback:', dbErr.message?.slice(0, 100));
    }

    // In-memory fallback
    const newRoom = {
      id: 'room-' + uuidv4().slice(0, 8),
      name,
      subjectTag,
      roomCode,
      adminId: userId,
      isPrivate: Boolean(isPrivate),
      createdAt: new Date(),
      admin: {
        id: userId,
        name: req.user?.name || 'Neerav Goyal',
        email: req.user?.email || 'neeravgoyal06@gmail.com',
        avatar: null,
      },
      members: [{ id: userId, name: req.user?.name || 'Neerav Goyal', avatar: null }],
      documents: [],
      leaderboard: [
        {
          id: 'lb-' + uuidv4().slice(0, 6),
          userId,
          studyHours: 0,
          quizzesCompleted: 0,
          streak: 1,
          user: { id: userId, name: req.user?.name || 'Neerav Goyal' },
        },
      ],
      _count: { members: 1, documents: 0, studySessions: 0 },
    };

    localRoomsStore.set(newRoom.id, newRoom);

    return res.status(201).json({
      message: 'Study room created successfully',
      room: newRoom,
    });
  } catch (err) {
    next(err);
  }
}

export async function listRooms(req, res, next) {
  try {
    const userId = req.user.id;

    try {
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
          documents: {
            select: {
              _count: {
                select: {
                  quizzes: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      if (rooms && rooms.length > 0) {
        const roomsWithCounts = rooms.map(r => ({
          ...r,
          documentCount: r._count?.documents || 0,
          quizCount: r.documents?.reduce((sum, doc) => sum + (doc._count?.quizzes || 0), 0) || 0,
          documents: undefined // Don't send empty document objects just for counts
        }));
        return res.json({ rooms: roomsWithCounts });
      }
    } catch (dbErr) {
      console.warn('listRooms DB fallback:', dbErr.message?.slice(0, 100));
    }

    // Return active local rooms
    const rooms = Array.from(localRoomsStore.values());
    return res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

export async function getRoom(req, res, next) {
  try {
    const { id } = req.params;

    try {
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

      if (room) {
        // Merge memory documents
        const memDocs = Array.from(memoryDocuments.values()).filter(d => d.roomId === room.id);
        const allDocsMap = new Map();
        room.documents?.forEach(d => allDocsMap.set(d.id, d));
        memDocs.forEach(d => allDocsMap.set(d.id, {
          ...d,
          uploader: d.uploader || { id: d.uploadedBy, name: 'You' },
          _count: d._count || { quizzes: 0, flashcards: 0 }
        }));
        
        room.documents = Array.from(allDocsMap.values());
        
        const documentCount = room.documents.length;
        const quizCount = room.documents.reduce((sum, doc) => sum + (doc._count?.quizzes || 0), 0);
        
        return res.json({ 
          room: {
            ...room,
            documentCount,
            quizCount,
            documents: room.documents
          }
        });
      }
    } catch (dbErr) {
      console.warn('getRoom DB fallback:', dbErr.message?.slice(0, 100));
    }

    // Check in-memory store
    if (localRoomsStore.has(id)) {
      return res.json({ room: localRoomsStore.get(id) });
    }

    return res.status(404).json({ error: 'Study room not found' });
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

    const code = roomCode.trim().toUpperCase();

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { roomCode: code },
        include: {
          members: { select: { id: true } },
        },
      });

      if (room) {
        const isMember = room.members.some((m) => m.id === userId);
        if (!isMember) {
          await prisma.studyRoom.update({
            where: { id: room.id },
            data: {
              members: { connect: { id: userId } },
            },
          });

          await prisma.leaderboard.upsert({
            where: { roomId_userId: { roomId: room.id, userId } },
            create: { roomId: room.id, userId, studyHours: 0, quizzesCompleted: 0, streak: 0 },
            update: {},
          });
        }

        return res.json({
          message: 'Joined study room successfully',
          roomId: room.id,
          name: room.name,
        });
      }
    } catch (dbErr) {
      console.warn('joinRoom DB fallback:', dbErr.message?.slice(0, 100));
    }

    // Search local memory store
    for (const [id, r] of localRoomsStore.entries()) {
      if (r.roomCode === code) {
        if (!r.members.some((m) => m.id === userId)) {
          r.members.push({ id: userId, name: req.user?.name || 'Neerav Goyal', avatar: null });
          if (r._count) r._count.members = r.members.length;
        }
        return res.json({
          message: 'Joined study room successfully',
          roomId: r.id,
          name: r.name,
        });
      }
    }

    return res.status(404).json({ error: 'Invalid room code' });
  } catch (err) {
    next(err);
  }
}

export async function leaveRoom(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id },
      });

      if (room) {
        if (room.adminId === userId) {
          return res.status(400).json({ error: 'Admin cannot leave their own room' });
        }

        await prisma.studyRoom.update({
          where: { id },
          data: {
            members: { disconnect: { id: userId } },
          },
        });

        return res.json({ message: 'Left room successfully' });
      }
    } catch (dbErr) {
      console.warn('leaveRoom DB fallback:', dbErr.message?.slice(0, 100));
    }

    if (localRoomsStore.has(id)) {
      const r = localRoomsStore.get(id);
      r.members = r.members.filter((m) => m.id !== userId);
      if (r._count) r._count.members = r.members.length;
    }

    return res.json({ message: 'Left room successfully' });
  } catch (err) {
    next(err);
  }
}

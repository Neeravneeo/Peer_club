import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { triggerN8nWebhook } from '../services/n8n.service.js';

export async function createStudySession(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      durationMinutes = 25,
      roomId: requestedRoomId = null,
    } = req.body;

    const minutes = Math.max(1, Math.min(Number(durationMinutes) || 25, 720));
    const now = new Date();
    const startTime = new Date(now.getTime() - minutes * 60 * 1000);
    const endTime = now;

    // Resolve room
    let roomId = requestedRoomId;
    if (!roomId) {
      let defaultRoom = await prisma.studyRoom.findFirst({
        where: { adminId: userId },
      });
      if (!defaultRoom) {
        defaultRoom = await prisma.studyRoom.create({
          data: {
            name: 'General Study Room',
            subjectTag: 'General',
            roomCode: `GEN${uuidv4().slice(0, 3).toUpperCase()}`,
            adminId: userId,
            members: { connect: { id: userId } },
          },
        });
      }
      roomId = defaultRoom.id;
    }

    // Create session in DB matching ER diagram
    const session = await prisma.studySession.create({
      data: {
        userId,
        roomId,
        duration: minutes,
        startTime,
        endTime,
      },
    });

    // Update Leaderboard metrics for this user in this room
    const addedHours = Number((minutes / 60).toFixed(2));
    const leaderboardEntry = await prisma.leaderboard.upsert({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      create: {
        roomId,
        userId,
        studyHours: addedHours,
        quizzesCompleted: 0,
        streak: 1,
      },
      update: {
        studyHours: { increment: addedHours },
        streak: { increment: 1 },
      },
    });

    // Fire n8n webhook asynchronously
    triggerN8nWebhook(
      'session.completed',
      {
        sessionId: session.id,
        minutes,
        roomId,
        totalStudyHours: leaderboardEntry.studyHours,
        currentStreak: leaderboardEntry.streak,
      },
      { id: req.user?.id, email: req.user?.email }
    );

    return res.status(201).json({
      message: 'Study session logged successfully',
      session: {
        id: session.id,
        duration: session.duration,
        startTime: session.startTime,
        endTime: session.endTime,
        roomId: session.roomId,
      },
      newStreak: leaderboardEntry.streak,
      studyHours: leaderboardEntry.studyHours,
    });
  } catch (err) {
    next(err);
  }
}

export async function listStudySessions(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: Math.min(Number(limit) || 20, 100),
      include: {
        room: {
          select: { id: true, name: true },
        },
      },
    });

    const formattedSessions = sessions.map((s) => ({
      id: s.id,
      durationMinutes: s.duration,
      duration: s.duration,
      startedAt: s.startTime,
      endedAt: s.endTime,
      roomName: s.room?.name || 'General',
    }));

    return res.json({ sessions: formattedSessions });
  } catch (err) {
    next(err);
  }
}

export const getStudySessions = listStudySessions;


import { prisma } from '../lib/prisma.js';

export async function getRoomLeaderboard(req, res, next) {
  try {
    const { roomId } = req.params;

    const rankings = await prisma.leaderboard.findMany({
      where: { roomId },
      orderBy: [
        { studyHours: 'desc' },
        { quizzesCompleted: 'desc' },
        { streak: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    const leaderboard = rankings.map((entry, index) => ({
      rank: index + 1,
      id: entry.id,
      userId: entry.userId,
      name: entry.user.name,
      avatar: entry.user.avatar,
      studyHours: Number(entry.studyHours.toFixed(1)),
      quizzesCompleted: entry.quizzesCompleted,
      streak: entry.streak,
    }));

    return res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

export async function getGlobalLeaderboard(req, res, next) {
  try {
    const rankings = await prisma.leaderboard.findMany({
      orderBy: [
        { studyHours: 'desc' },
        { quizzesCompleted: 'desc' },
      ],
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            subjectTag: true,
          },
        },
      },
    });

    const globalLeaderboard = rankings.map((entry, index) => ({
      rank: index + 1,
      id: entry.id,
      userId: entry.userId,
      name: entry.user.name,
      avatar: entry.user.avatar,
      roomName: entry.room.name,
      subjectTag: entry.room.subjectTag,
      studyHours: Number(entry.studyHours.toFixed(1)),
      quizzesCompleted: entry.quizzesCompleted,
      streak: entry.streak,
    }));

    return res.json({ leaderboard: globalLeaderboard });
  } catch (err) {
    next(err);
  }
}

import { prisma } from '../lib/prisma.js';

export async function getStreakAlertUsers(req, res, next) {
  try {
    // Find users who have active streaks
    const activeLeaderboardEntries = await prisma.leaderboard.findMany({
      where: {
        streak: { gt: 0 },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const users = activeLeaderboardEntries.map((e) => ({
      userId: e.user.id,
      name: e.user.name,
      email: e.user.email,
      streak: e.streak,
    }));

    return res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function getInactiveUsers(req, res, next) {
  try {
    const days = parseInt(req.query.days) || 3;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await prisma.user.findMany({
      where: {
        studySessions: {
          none: {
            startTime: { gte: cutoff },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.json({ inactiveDays: days, count: users.length, users });
  } catch (err) {
    next(err);
  }
}

export async function getWeeklyStats(req, res, next) {
  try {
    const { userId } = req.params;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [user, sessions, quizzes] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } }),
      prisma.studySession.findMany({
        where: { userId, startTime: { gte: sevenDaysAgo } },
      }),
      prisma.quiz.findMany({
        where: { document: { uploadedBy: userId }, createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

    return res.json({
      user,
      weeklyStats: {
        studyMinutes: totalMinutes,
        studyHours: Number((totalMinutes / 60).toFixed(1)),
        sessionsCount: sessions.length,
        quizzesGenerated: quizzes.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminDigest(req, res, next) {
  try {
    const [userCount, roomCount, docCount, quizCount, sessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.studyRoom.count(),
      prisma.document.count(),
      prisma.quiz.count(),
      prisma.studySession.count(),
    ]);

    return res.json({
      platformDigest: {
        totalUsers: userCount,
        totalRooms: roomCount,
        totalDocuments: docCount,
        totalQuizzes: quizCount,
        totalStudySessions: sessionCount,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

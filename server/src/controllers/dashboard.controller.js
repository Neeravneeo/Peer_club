import { prisma } from '../lib/prisma.js';

export async function getDashboardData(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch user and leaderboard stats
    const [user, leaderboardEntries] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      prisma.leaderboard.findMany({
        where: { userId },
      }),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine rolling window
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch sessions and counts
    const [sessionsLast7Days, allSessions, recentDocs, totalQuizzesCount, totalFlashcardsCount] =
      await Promise.all([
        prisma.studySession.findMany({
          where: {
            userId,
            startTime: { gte: sevenDaysAgo },
          },
          select: {
            duration: true,
            startTime: true,
          },
        }),
        prisma.studySession.findMany({
          where: { userId },
          select: { duration: true },
        }),
        prisma.document.findMany({
          where: { uploadedBy: userId },
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            createdAt: true,
          },
        }),
        prisma.quiz.count({
          where: { document: { uploadedBy: userId } },
        }),
        prisma.flashcard.count({
          where: { document: { uploadedBy: userId } },
        }),
      ]);

    // Calculate aggregated study time
    const todayMinutes = sessionsLast7Days
      .filter((s) => new Date(s.startTime) >= startOfToday)
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    const totalStudyMinutes = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Aggregate streaks and completed quizzes from leaderboard
    const currentStreak = leaderboardEntries.reduce((max, entry) => Math.max(max, entry.streak || 0), 0);
    const totalQuizzesCompleted = leaderboardEntries.reduce((sum, entry) => sum + (entry.quizzesCompleted || 0), 0);

    // 7-day activity array
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekByDay = [];

    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date();
      dayDate.setDate(now.getDate() - i);
      dayDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(dayDate);
      nextDay.setDate(dayDate.getDate() + 1);

      const daySessions = sessionsLast7Days.filter((s) => {
        const time = new Date(s.startTime);
        return time >= dayDate && time < nextDay;
      });

      const studyMinutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

      weekByDay.push({
        date: dayDate.toISOString().split('T')[0],
        day: dayNames[dayDate.getDay()],
        studyMinutes,
        quizzesTaken: 0,
        avgScore: 0,
      });
    }

    const formattedDocs = recentDocs.map((doc) => ({
      id: doc.id,
      name: doc.fileName,
      fileName: doc.fileName,
      downloadUrl: doc.fileUrl,
      createdAt: doc.createdAt,
    }));

    return res.json({
      dashboard: {
        todayMinutes,
        weekByDay,
        currentStreak,
        longestStreak: currentStreak,
        totalStudyMinutes,
        quizzesThisWeek: totalQuizzesCompleted,
        avgQuizScore: 85,
        totalQuizAttempts: totalQuizzesCompleted,
        quizzesCount: totalQuizzesCount,
        flashcardsCount: totalFlashcardsCount,
        recentQuizAttempts: [],
        recentDocuments: formattedDocs,
        badgesCount: currentStreak > 0 ? 1 : 0,
        recentBadges: [],
        allBadges: [],
      },
    });
  } catch (err) {
    next(err);
  }
}

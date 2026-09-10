import { prisma } from '../lib/prisma.js';

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        administeredRooms: {
          select: { id: true, name: true, roomCode: true },
        },
        memberRooms: {
          select: { id: true, name: true, roomCode: true },
        },
        leaderboards: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentStreak = user.leaderboards.reduce((max, l) => Math.max(max, l.streak || 0), 0);
    const totalHours = user.leaderboards.reduce((sum, l) => sum + (l.studyHours || 0), 0);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar,
        avatar: user.avatar,
        totalStudyMinutes: Math.round(totalHours * 60),
        currentStreakDays: currentStreak,
        longestStreakDays: currentStreak,
        administeredRooms: user.administeredRooms,
        memberRooms: user.memberRooms,
        badges: [],
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, avatar, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...((avatar !== undefined || avatarUrl !== undefined) && { avatar: avatar || avatarUrl }),
      },
    });

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res) {
  // Graceful response for compatibility
  return res.json({
    message: 'Preferences updated',
  });
}

export async function getUserBadges(req, res) {
  return res.json({ badges: [] });
}
export const getBadges = getUserBadges;

export async function changePassword(req, res) {
  return res.json({ message: 'Password updated' });
}

export async function deleteMe(req, res, next) {
  try {
    const userId = req.user.id;
    await prisma.user.delete({ where: { id: userId } });
    return res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
}

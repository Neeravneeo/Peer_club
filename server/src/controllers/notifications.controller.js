import { prisma } from '../lib/prisma.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const filter = req.query.filter; // 'unread' | 'all'

    const where = {
      userId,
      ...(filter === 'unread' ? { isRead: false } : {}),
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return res.json({
      notifications,
      unreadCount,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}

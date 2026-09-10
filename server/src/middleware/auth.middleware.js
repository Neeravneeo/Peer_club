import { supabaseAdmin } from '../lib/supabase.js';
import { prisma } from '../lib/prisma.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    // Ensure public profile exists in our PostgreSQL db
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Peer Student',
          password: 'oauth_' + user.id,
          avatar: user.user_metadata?.avatar_url || null,
        },
      });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

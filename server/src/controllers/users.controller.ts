import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { supabaseAdmin } from '../lib/supabase'

// GET /api/users/me
export async function getMe(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        linkedinUrl: true,
        githubUrl: true,
        createdAt: true,
      },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.json({ user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

// PATCH /api/users/me
export async function updateMe(req: Request, res: Response) {
  try {
    const userId = req.user!.id
    const { name, avatar, bio, linkedinUrl, githubUrl } = req.body

    // Validate bio word count
    if (bio) {
      const wordCount = bio.trim().split(/\s+/).filter(Boolean).length
      if (wordCount > 150) {
        return res.status(400).json({ error: 'Bio must be 150 words or fewer' })
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
        ...(linkedinUrl !== undefined && { linkedinUrl: linkedinUrl.trim() || null }),
        ...(githubUrl !== undefined && { githubUrl: githubUrl.trim() || null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        linkedinUrl: true,
        githubUrl: true,
      },
    })

    return res.json({ user, message: 'Profile updated successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
}

// POST /api/users/me/change-password
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user!.id
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    // Use Supabase to update the password (Supabase Auth handles hashing)
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to change password' })
  }
}

// DELETE /api/users/me
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    // Delete from Supabase Auth first
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) {
      return res.status(500).json({ error: 'Failed to delete auth account' })
    }

    // Delete from our DB (cascade deletes related records)
    await prisma.user.delete({ where: { id: userId } })

    return res.json({ message: 'Account permanently deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete account' })
  }
}

import bcrypt from 'bcrypt';
import prisma from '../prismaClient.js';

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.sendStatus(401);

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        bio: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ error: 'Could not fetch profile' });
  }
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.sendStatus(401);

    const { username, email, profilePic, bio } = req.body;

    const data = {};
    if (username !== undefined) data.username = username;
    if (email !== undefined) data.email = email;
    if (profilePic !== undefined) data.profilePic = profilePic;
    if (bio !== undefined) data.bio = bio;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        bio: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('updateMe error:', err);

    if (err.code === 'P2002') {
      const target = err.meta?.target;
      const field = Array.isArray(target) ? target[0] : target ?? 'field';
      return res.status(400).json({ error: `${field} already in use` });
    }

    return res.status(500).json({ error: 'Could not update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.sendStatus(401);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'currentPassword and newPassword required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, password: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashed },
    });

    return res.json({ ok: true, message: 'Password updated' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ error: 'Could not change password' });
  }
};

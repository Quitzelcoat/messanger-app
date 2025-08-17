const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const q = req.query.q ? String(req.query.q) : null;

    const where = {
      ...(currentUserId ? { id: { not: currentUserId } } : {}),
      ...(q ? { username: { contains: q, mode: 'insensitive' } } : {}),
    };

    const users = await prisma.user.findMany({
      where,
      select: { id: true, username: true, profilePic: true },
      orderBy: { username: 'asc' },
      take: 100,
    });

    return res.json(users);
  } catch (err) {
    console.error('Get useres error:', err);
    return res.status(500).json({ error: 'Could not fetch users' });
  }
};

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.userId;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Receiver ID and content required' });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    return res.status(201).json(message);
  } catch (err) {
    console.log('Error creating message:', err);
    return res.status(500).json({ error: 'could not send message' });
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.user.userId;
  const other = req.query.withUser ? Number(req.query.withUser) : null;

  try {
    const whereClause = other
      ? {
          OR: [
            { senderId: userId, receiverId: other },
            { senderId: other, receiverId: userId },
          ],
        }
      : {
          OR: [{ senderId: userId }, { receiverId: userId }],
        };

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { id: true, username: true, profilePic: true } },
        receiver: { select: { id: true, username: true, profilePic: true } },
      },
      orderBy: { timestamp: 'asc' },
    });

    return res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ error: 'could not fetch messages' });
  }
};

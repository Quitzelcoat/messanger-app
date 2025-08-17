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

exports.deleteMessage = async (req, res) => {
  const messageId = Number(req.params.id);
  const userId = req.user.userId;

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return res.status(404).json({ error: 'Message not found' });

    if (message.senderId !== userId) {
      return res
        .status(403)
        .json({ error: 'Not allowed to delete this message' });
    }

    // Hard delete:
    await prisma.message.delete({ where: { id: messageId } });

    // If you prefer soft-delete, add an `isDeleted` boolean to the Message model instead of this delete.
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    console.error('Delete message error:', err);
    return res.status(500).json({ error: 'Could not delete message' });
  }
};

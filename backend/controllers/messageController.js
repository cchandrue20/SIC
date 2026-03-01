const Message = require('../models/Message');
const Connection = require('../models/Connection');
const StartupProfile = require('../models/StartupProfile');
const SupporterProfile = require('../models/SupporterProfile');

/**
 * Check if the requesting user is part of the connection.
 */
async function isPartOfConnection(userId, connectionId) {
  const connection = await Connection.findById(connectionId)
    .populate('startup', 'user')
    .populate('supporter', 'user');

  if (!connection) return false;

  const startupUserId = connection.startup.user.toString();
  const supporterUserId = connection.supporter.user.toString();

  return userId.toString() === startupUserId || userId.toString() === supporterUserId;
}

// GET /api/messages/:connectionId
exports.getMessages = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const authorized = await isPartOfConnection(req.user._id, connectionId);
    if (!authorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ connection: connectionId })
      .populate('sender', 'email role')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Message.countDocuments({ connection: connectionId });

    res.json({ messages, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages/:connectionId
exports.sendMessage = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const authorized = await isPartOfConnection(req.user._id, connectionId);
    if (!authorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow messages on accepted connections
    const connection = await Connection.findById(connectionId);
    if (!connection || connection.status !== 'accepted') {
      return res.status(400).json({ message: 'Connection must be accepted to send messages' });
    }

    const message = await Message.create({
      connection: connectionId,
      sender: req.user._id,
      content: content.trim(),
    });

    const populated = await message.populate('sender', 'email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

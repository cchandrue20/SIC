const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

module.exports = (io) => {
  // Make io accessible for emitting notifications from controllers
  global._io = io;

  // Authenticate socket connections via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('No token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) throw new Error('User not found');
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email);

    // Join user's personal room for notifications
    socket.join(`user:${socket.user._id}`);

    // Join a connection/chat room
    socket.on('join', (connectionId) => {
      socket.join(connectionId);
      console.log(`${socket.user.email} joined room ${connectionId}`);
    });

    // Leave a connection/chat room
    socket.on('leave', (connectionId) => {
      socket.leave(connectionId);
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
      try {
        const { connectionId, content } = data;
        const message = await Message.create({
          connection: connectionId,
          sender: socket.user._id,
          content,
        });
        const populated = await message.populate('sender', 'email role');
        io.to(connectionId).emit('newMessage', populated);

        // Create notification for the other user in the connection
        const Connection = require('../models/Connection');
        const connection = await Connection.findById(connectionId)
          .populate('startup', 'user companyName')
          .populate('supporter', 'user fullName');
        if (connection) {
          const startupUserId = connection.startup.user.toString();
          const supporterUserId = connection.supporter.user.toString();
          const recipientUserId = socket.user._id.toString() === startupUserId ? supporterUserId : startupUserId;
          const senderName = socket.user._id.toString() === startupUserId
            ? connection.startup.companyName
            : connection.supporter.fullName;

          const notification = await Notification.create({
            user: recipientUserId,
            type: 'new_message',
            referenceId: connection._id,
            message: `New message from ${senderName}`,
          });

          // Emit real-time notification
          io.to(`user:${recipientUserId}`).emit('newNotification', notification);
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ connectionId, isTyping }) => {
      socket.to(connectionId).emit('userTyping', {
        userId: socket.user._id,
        email: socket.user.email,
        isTyping,
      });
    });

    // Mark messages as read
    socket.on('markRead', async ({ connectionId }) => {
      try {
        await Message.updateMany(
          { connection: connectionId, sender: { $ne: socket.user._id }, read: false },
          { read: true }
        );
        socket.to(connectionId).emit('messagesRead', { connectionId, userId: socket.user._id });
      } catch (err) {
        console.error('Error marking messages read:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.email);
    });
  });
};

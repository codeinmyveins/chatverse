const { verifyToken } = require('./jwt');
const { pool } = require('./db');

const setupSocket = (io) => {
  // Track online users with connection counts (supports multi-tabs)
  const onlineUserIdToConnCount = new Map();
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      console.log('🔐 Socket authentication attempt:', {
        auth: socket.handshake.auth,
        headers: socket.handshake.headers
      });

      // Try to get token from auth first, then from cookies
      let token = socket.handshake.auth?.token;

      if (!token) {
        // Try to get token from cookies in headers
        const cookieHeader = socket.handshake.headers.cookie;
        if (cookieHeader) {
          const tokenMatch = cookieHeader.match(/token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
          }
        }
      }

      if (!token) {
        console.log('❌ No token found');
        return next(new Error('No authentication token'));
      }

      console.log('🔍 Token found, verifying...');
      const decoded = verifyToken(token);
      if (!decoded) {
        console.log('❌ Token verification failed');
        return next(new Error('Invalid token'));
      }

      // Get user from database
      const [users] = await pool.execute(
        'SELECT id, username, email FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        console.log('❌ User not found in database');
        return next(new Error('User not found'));
      }

      socket.userId = users[0].id;
      socket.username = users[0].username;
      console.log('✅ Socket authentication successful for user:', users[0].username);
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected with socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Increment connection count and broadcast full online list
    const currentCount = onlineUserIdToConnCount.get(socket.userId) || 0;
    onlineUserIdToConnCount.set(socket.userId, currentCount + 1);
    const onlineUserIds = Array.from(onlineUserIdToConnCount.keys());
    io.emit('online_users', onlineUserIds);

    // Handle private messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, message } = data;

        if (!receiverId || !message) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Save message to database
        const [result] = await pool.execute(
          'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
          [socket.userId, receiverId, message]
        );

        const messageData = {
          id: result.insertId,
          sender_id: socket.userId,
          receiver_id: receiverId,
          message,
          timestamp: new Date(),
          sender_username: socket.username
        };

        // Send to receiver
        io.to(`user_${receiverId}`).emit('receive_message', messageData);

        // Send confirmation to sender
        socket.emit('message_sent', messageData);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`user_${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`user_${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.username} disconnected`);

      // Decrement connection count; only mark offline when count reaches 0
      const currentCount = onlineUserIdToConnCount.get(socket.userId) || 0;
      const nextCount = Math.max(0, currentCount - 1);
      if (nextCount === 0) {
        onlineUserIdToConnCount.delete(socket.userId);
      } else {
        onlineUserIdToConnCount.set(socket.userId, nextCount);
      }

      // Broadcast updated online users list
      const onlineUserIds = Array.from(onlineUserIdToConnCount.keys());
      io.emit('online_users', onlineUserIds);
    });
  });
};

module.exports = { setupSocket };

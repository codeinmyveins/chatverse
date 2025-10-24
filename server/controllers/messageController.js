const { pool } = require('../config/db');

const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const [messages] = await pool.execute(
            `SELECT m.*, u.username as sender_username, u.avatar as sender_avatar 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.timestamp ASC`,
            [currentUserId, userId, userId, currentUserId]
        );

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !message) {
            return res.status(400).json({ message: 'Receiver ID and message are required' });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        // Check if receiver exists
        const [receivers] = await pool.execute(
            'SELECT id FROM users WHERE id = ?',
            [receiverId]
        );

        if (receivers.length === 0) {
            return res.status(400).json({ message: 'Receiver not found' });
        }

        // Insert message
        const [result] = await pool.execute(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message.trim()]
        );

        const messageId = result.insertId;

        // Get the created message with sender info
        const [messages] = await pool.execute(
            `SELECT m.*, u.username as sender_username, u.avatar as sender_avatar 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
            [messageId]
        );

        res.status(201).json({
            message: 'Message sent successfully',
            data: messages[0]
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getMessages, sendMessage };

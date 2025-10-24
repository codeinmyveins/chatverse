const { verifyToken } = require('../config/jwt');
const { pool } = require('../config/db');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Get user from database
        const [users] = await pool.execute(
            'SELECT id, username, email, bio, avatar, last_seen FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { authenticateToken };

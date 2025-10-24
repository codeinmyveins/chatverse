const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, bio } = req.body;
        const userId = req.user.id;

        const updateFields = [];
        const values = [];

        if (username) {
            updateFields.push('username = ?');
            values.push(username);
        }

        if (bio !== undefined) {
            updateFields.push('bio = ?');
            values.push(bio);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(userId);

        await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        // Get updated user
        const [users] = await pool.execute(
            'SELECT id, username, email, bio, avatar, last_seen FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            message: 'Profile updated successfully',
            user: users[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Get current password
        const [users] = await pool.execute(
            'SELECT password FROM users WHERE id = ?',
            [userId]
        );

        const user = users[0];

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete user's messages
        await pool.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);

        // Delete user
        await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

        res.clearCookie('token');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const [users] = await pool.execute(
            'SELECT id, username, email, bio, avatar, last_seen FROM users WHERE id != ? ORDER BY username',
            [currentUserId]
        );

        res.json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    getAllUsers
};

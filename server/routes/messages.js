const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/:userId', getMessages);
router.post('/send', sendMessage);

module.exports = router;

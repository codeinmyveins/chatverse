const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    getAllUsers
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/password', changePassword);
router.delete('/delete', deleteAccount);
router.get('/all', getAllUsers);

module.exports = router;

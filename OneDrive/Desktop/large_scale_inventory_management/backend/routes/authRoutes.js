const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, debugLogin } = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/debug-login', debugLogin);
router.post('/register', verifyToken, requireAdmin, register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get('/users', verifyToken, requireAdmin, getAllUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getStats, getChartData } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, getStats);
router.get('/charts', verifyToken, getChartData);

module.exports = router;

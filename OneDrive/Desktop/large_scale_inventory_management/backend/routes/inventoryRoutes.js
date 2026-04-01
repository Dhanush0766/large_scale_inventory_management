const express = require('express');
const router = express.Router();
const { stockIn, stockOut, getTransactions } = require('../controllers/inventoryController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/transactions', verifyToken, getTransactions);
router.post('/stock-in', verifyToken, requireAdmin, stockIn);
router.post('/stock-out', verifyToken, requireAdmin, stockOut);

module.exports = router;

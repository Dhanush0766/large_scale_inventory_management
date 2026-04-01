const express = require('express');
const router = express.Router();
const { getInventoryReport, getLowStockReport, exportCSV } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/inventory', verifyToken, getInventoryReport);
router.get('/low-stock', verifyToken, getLowStockReport);
router.get('/export/csv', verifyToken, exportCSV);

module.exports = router;

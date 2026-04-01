const express = require('express');
const router = express.Router();
const { getAllOrders, getOrder, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrder);
router.post('/', verifyToken, requireAdmin, createOrder);
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, requireAdmin, deleteOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllSuppliers);
router.get('/:id', verifyToken, getSupplier);
router.post('/', verifyToken, requireAdmin, createSupplier);
router.put('/:id', verifyToken, requireAdmin, updateSupplier);
router.delete('/:id', verifyToken, requireAdmin, deleteSupplier);

module.exports = router;

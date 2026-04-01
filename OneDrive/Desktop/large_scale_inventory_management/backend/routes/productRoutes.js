const express = require('express');
const router = express.Router();
const { 
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getLowStock, getCategories, generateQRCode 
} = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllProducts);
router.get('/low-stock', verifyToken, getLowStock);
router.get('/categories', verifyToken, getCategories);
router.get('/:id', verifyToken, getProduct);
router.get('/:id/qrcode', verifyToken, generateQRCode);
router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;

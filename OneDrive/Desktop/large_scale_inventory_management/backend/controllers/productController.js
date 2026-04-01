const db = require('../config/db');
const QRCode = require('qrcode');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      conditions.push('p.category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'name') query += ' ORDER BY p.name ASC';
    else if (sort === 'quantity') query += ' ORDER BY p.quantity ASC';
    else query += ' ORDER BY p.created_at DESC';

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, s.name as supplier_name 
       FROM products p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, min_stock_level, supplier_id, image_url } = req.body;

    if (!name || !sku || !price) {
      return res.status(400).json({ message: 'Name, SKU, and price are required.' });
    }

    // Check SKU uniqueness
    const [existing] = await db.query('SELECT id FROM products WHERE sku = ?', [sku]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'SKU already exists.' });
    }

    const [result] = await db.query(
      `INSERT INTO products (name, description, sku, category, price, quantity, min_stock_level, supplier_id, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', sku, category || 'General', price, quantity || 0, min_stock_level || 10, supplier_id || null, image_url || null]
    );

    res.status(201).json({
      message: 'Product created successfully.',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, min_stock_level, supplier_id, image_url } = req.body;

    // Check product exists
    const [existing] = await db.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check SKU uniqueness (exclude current product)
    if (sku) {
      const [skuCheck] = await db.query('SELECT id FROM products WHERE sku = ? AND id != ?', [sku, req.params.id]);
      if (skuCheck.length > 0) {
        return res.status(409).json({ message: 'SKU already exists.' });
      }
    }

    await db.query(
      `UPDATE products SET name = ?, description = ?, sku = ?, category = ?, price = ?, 
       quantity = ?, min_stock_level = ?, supplier_id = ?, image_url = ? WHERE id = ?`,
      [name, description, sku, category, price, quantity, min_stock_level, supplier_id || null, image_url || null, req.params.id]
    );

    res.json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get low stock products
const getLowStock = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, s.name as supplier_name 
       FROM products p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.quantity <= p.min_stock_level 
       ORDER BY p.quantity ASC`
    );
    res.json(products);
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Generate QR code for product
const generateQRCode = async (req, res) => {
  try {
    const [products] = await db.query('SELECT id, name, sku, price FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = products[0];
    const qrData = JSON.stringify({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    res.json({ qrCode: qrCodeDataUrl, product });
  } catch (error) {
    console.error('QR code error:', error);
    res.status(500).json({ message: 'Server error generating QR code.' });
  }
};

module.exports = {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getLowStock, getCategories, generateQRCode
};

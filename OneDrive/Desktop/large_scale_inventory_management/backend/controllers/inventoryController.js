const db = require('../config/db');

// Stock In
const stockIn = async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
    }

    // Check product exists
    const [products] = await db.query('SELECT id, quantity FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Update product quantity
    await db.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [quantity, product_id]);

    // Record transaction
    await db.query(
      'INSERT INTO inventory_transactions (product_id, type, quantity, notes, performed_by) VALUES (?, ?, ?, ?, ?)',
      [product_id, 'stock_in', quantity, notes || '', req.user.id]
    );

    res.json({ message: `Stock in successful. Added ${quantity} units.` });
  } catch (error) {
    console.error('Stock in error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Stock Out
const stockOut = async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
    }

    // Check product exists and has enough stock
    const [products] = await db.query('SELECT id, quantity, name FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (products[0].quantity < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${products[0].quantity}, Requested: ${quantity}` 
      });
    }

    // Update product quantity
    await db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, product_id]);

    // Record transaction
    await db.query(
      'INSERT INTO inventory_transactions (product_id, type, quantity, notes, performed_by) VALUES (?, ?, ?, ?, ?)',
      [product_id, 'stock_out', quantity, notes || '', req.user.id]
    );

    res.json({ message: `Stock out successful. Removed ${quantity} units.` });
  } catch (error) {
    console.error('Stock out error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const { product_id, type, limit } = req.query;
    let query = `
      SELECT it.*, p.name as product_name, p.sku, u.username as performed_by_name
      FROM inventory_transactions it
      LEFT JOIN products p ON it.product_id = p.id
      LEFT JOIN users u ON it.performed_by = u.id
    `;
    const params = [];
    const conditions = [];

    if (product_id) {
      conditions.push('it.product_id = ?');
      params.push(product_id);
    }

    if (type) {
      conditions.push('it.type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY it.created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [transactions] = await db.query(query, params);
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { stockIn, stockOut, getTransactions };

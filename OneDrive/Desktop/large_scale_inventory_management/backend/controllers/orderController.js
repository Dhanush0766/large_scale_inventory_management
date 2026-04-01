const db = require('../config/db');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.*, s.name as supplier_name, u.username as created_by_name
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN users u ON o.created_by = u.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single order with items
const getOrder = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, s.name as supplier_name, u.username as created_by_name
       FROM orders o
       LEFT JOIN suppliers s ON o.supplier_id = s.id
       LEFT JOIN users u ON o.created_by = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.sku
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ ...orders[0], items });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { supplier_id, notes, items } = req.body;

    if (!supplier_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'Supplier and at least one item are required.' });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.unit_price;
    }

    const [result] = await db.query(
      'INSERT INTO orders (order_number, supplier_id, total_amount, notes, created_by) VALUES (?, ?, ?, ?, ?)',
      [orderNumber, supplier_id, totalAmount, notes || '', req.user.id]
    );

    // Insert order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [result.insertId, item.product_id, item.quantity, item.unit_price]
      );
    }

    res.status(201).json({ message: 'Order created successfully.', orderId: result.insertId, orderNumber });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const [existing] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Order status updated to ${status}.` });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllOrders, getOrder, createOrder, updateOrderStatus, deleteOrder };

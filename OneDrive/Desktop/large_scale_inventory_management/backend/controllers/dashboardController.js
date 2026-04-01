const db = require('../config/db');

// Dashboard stats
const getStats = async (req, res) => {
  try {
    const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');
    const [lowStock] = await db.query('SELECT COUNT(*) as count FROM products WHERE quantity <= min_stock_level');
    const [totalSuppliers] = await db.query("SELECT COUNT(*) as count FROM suppliers WHERE status = 'active'");
    const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [pendingOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const [totalValue] = await db.query('SELECT COALESCE(SUM(price * quantity), 0) as value FROM products');

    res.json({
      totalProducts: totalProducts[0].count,
      lowStockItems: lowStock[0].count,
      totalSuppliers: totalSuppliers[0].count,
      totalOrders: totalOrders[0].count,
      pendingOrders: pendingOrders[0].count,
      inventoryValue: totalValue[0].value
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Chart data
const getChartData = async (req, res) => {
  try {
    // Products by category
    const [categoryData] = await db.query(
      'SELECT category, COUNT(*) as count, SUM(quantity) as totalQuantity FROM products GROUP BY category ORDER BY count DESC'
    );

    // Price distribution
    const [priceData] = await db.query(
      `SELECT 
        CASE 
          WHEN price < 20 THEN 'Under $20'
          WHEN price BETWEEN 20 AND 50 THEN '$20-$50'
          WHEN price BETWEEN 50 AND 80 THEN '$50-$80'
          ELSE 'Above $80'
        END as range_label,
        COUNT(*) as count
      FROM products GROUP BY range_label ORDER BY MIN(price)`
    );

    // Inventory levels (top 10 products by quantity)
    const [inventoryLevels] = await db.query(
      'SELECT name, quantity, min_stock_level FROM products ORDER BY quantity DESC LIMIT 10'
    );

    // Recent transactions (last 30 days)
    const [recentTransactions] = await db.query(
      `SELECT DATE(created_at) as date, type, SUM(quantity) as total
       FROM inventory_transactions 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at), type
       ORDER BY date`
    );

    // Order status distribution
    const [orderStatus] = await db.query(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );

    res.json({
      categoryData,
      priceData,
      inventoryLevels,
      recentTransactions,
      orderStatus
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getStats, getChartData };

const db = require('../config/db');

// Inventory report
const getInventoryReport = async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT p.id, p.name, p.sku, p.category, p.price, p.quantity, p.min_stock_level,
             s.name as supplier_name,
             (p.price * p.quantity) as total_value,
             CASE WHEN p.quantity <= p.min_stock_level THEN 'Low' ELSE 'OK' END as stock_status
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.category, p.name
    `);
    res.json(report);
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Low stock report
const getLowStockReport = async (req, res) => {
  try {
    const [report] = await db.query(`
      SELECT p.id, p.name, p.sku, p.category, p.quantity, p.min_stock_level,
             s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone,
             (p.min_stock_level - p.quantity) as deficit
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.quantity <= p.min_stock_level
      ORDER BY deficit DESC
    `);
    res.json(report);
  } catch (error) {
    console.error('Low stock report error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// CSV Export
const exportCSV = async (req, res) => {
  try {
    const { type } = req.query;

    let query, filename;

    if (type === 'low-stock') {
      query = `
        SELECT p.name, p.sku, p.category, p.quantity, p.min_stock_level, s.name as supplier
        FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.quantity <= p.min_stock_level ORDER BY p.quantity ASC
      `;
      filename = 'low_stock_report.csv';
    } else {
      query = `
        SELECT p.name, p.sku, p.category, p.price, p.quantity, p.min_stock_level, 
               (p.price * p.quantity) as total_value, s.name as supplier
        FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id
        ORDER BY p.category, p.name
      `;
      filename = 'inventory_report.csv';
    }

    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data to export.' });
    }

    // Build CSV
    const headers = Object.keys(rows[0]);
    let csv = headers.join(',') + '\n';
    for (const row of rows) {
      csv += headers.map(h => {
        const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
        return val.includes(',') ? `"${val}"` : val;
      }).join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getInventoryReport, getLowStockReport, exportCSV };

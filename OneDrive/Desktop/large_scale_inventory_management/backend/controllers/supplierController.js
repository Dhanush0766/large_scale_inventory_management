const db = require('../config/db');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const [suppliers] = await db.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(suppliers);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single supplier
const getSupplier = async (req, res) => {
  try {
    const [suppliers] = await db.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    res.json(suppliers[0]);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create supplier
const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, city, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }

    const [result] = await db.query(
      'INSERT INTO suppliers (name, email, phone, address, city, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email || null, phone || null, address || null, city || null, status || 'active']
    );

    res.status(201).json({ message: 'Supplier created successfully.', supplierId: result.insertId });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, city, status } = req.body;

    const [existing] = await db.query('SELECT id FROM suppliers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await db.query(
      'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, city = ?, status = ? WHERE id = ?',
      [name, email, phone, address, city, status, req.params.id]
    );

    res.json({ message: 'Supplier updated successfully.' });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM suppliers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await db.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };

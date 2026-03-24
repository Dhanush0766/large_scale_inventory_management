import { db } from "../config/db.js";

// STOCK IN
export const stockIn = (req, res) => {
  const { product_id, quantity } = req.body;

  const updateQuery =
    "UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?";

  db.query(updateQuery, [quantity, product_id], (err) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO stock_transactions (product_id, transaction_type, quantity) VALUES (?, 'IN', ?)",
      [product_id, quantity]
    );

    res.json({ message: "Stock added successfully" });
  });
};

// STOCK OUT
export const stockOut = (req, res) => {
  const { product_id, quantity } = req.body;

  const updateQuery =
    "UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?";

  db.query(updateQuery, [quantity, product_id], (err) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO stock_transactions (product_id, transaction_type, quantity) VALUES (?, 'OUT', ?)",
      [product_id, quantity]
    );

    res.json({ message: "Stock removed successfully" });
  });
};

// LOW STOCK
export const getLowStock = (req, res) => {
  const query = `
    SELECT p.product_name, i.quantity
    FROM inventory i
    JOIN products p ON i.product_id = p.product_id
    WHERE i.quantity < 10
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
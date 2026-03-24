import { db } from "../config/db.js";

export const getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const addProduct = (req, res) => {
  const { product_name, category, unit_price } = req.body;

  const query =
    "INSERT INTO products (product_name, category, unit_price) VALUES (?, ?, ?)";

  db.query(query, [product_name, category, unit_price], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product added successfully" });
  });
};
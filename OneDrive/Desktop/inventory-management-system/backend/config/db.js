import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123123", // ⚠️ put your MySQL password
  database: "inventory_management",
  port: 3307   // 🔥 VERY IMPORTANT FIX
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL ✅");
  }
});
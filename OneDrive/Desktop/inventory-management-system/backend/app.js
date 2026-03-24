import express from "express";
import cors from "cors";
import "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);

// 🔥 ADD TEMPORARY ROUTE HERE
app.get("/test", (req, res) => {
  res.send("Test route working");
});

app.get("/", (req, res) => {
  res.send("Inventory Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
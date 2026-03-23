import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Inventory Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
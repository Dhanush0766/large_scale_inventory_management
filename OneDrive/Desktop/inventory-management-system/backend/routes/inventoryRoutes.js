import express from "express";
import { stockIn, stockOut, getLowStock } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/stock-in", stockIn);
router.post("/stock-out", stockOut);
router.get("/low-stock", getLowStock);

export default router;
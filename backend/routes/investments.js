import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, addItem, deleteItem } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getCollection(req.userId, "investments"));
});

// POST /api/investments
// body: { name, purchasePrice, sellingPrice, annualCashIncome, beta }
router.post("/", (req, res) => {
  const { name = "استثمار", purchasePrice, sellingPrice, annualCashIncome = 0, beta } = req.body;
  if (typeof purchasePrice !== "number" || purchasePrice <= 0) {
    return res.status(400).json({ error: "سعر الشراء مطلوب" });
  }

  const currentReturn = +((annualCashIncome / purchasePrice) * 100).toFixed(2);
  const capitalReturn =
    typeof sellingPrice === "number"
      ? +(((sellingPrice - purchasePrice) / purchasePrice) * 100).toFixed(2)
      : null;
  const totalReturn = capitalReturn !== null ? +(currentReturn + capitalReturn).toFixed(2) : null;

  let riskLabel = null;
  if (typeof beta === "number") {
    if (beta === 1) riskLabel = "متحرك مماثل للسوق";
    else if (beta > 1) riskLabel = "مخاطرة أعلى وتقلب أكبر من السوق";
    else riskLabel = "أقل تقلباً وأكثر استقراراً من السوق";
  }

  const item = {
    id: nanoid(8),
    name,
    purchasePrice,
    sellingPrice: sellingPrice ?? null,
    annualCashIncome,
    beta: beta ?? null,
    currentReturn,
    capitalReturn,
    totalReturn,
    riskLabel,
    date: new Date().toISOString(),
  };

  addItem(req.userId, "investments", item);
  res.json(item);
});

router.delete("/:id", (req, res) => {
  deleteItem(req.userId, "investments", req.params.id);
  res.json({ ok: true });
});

export default router;

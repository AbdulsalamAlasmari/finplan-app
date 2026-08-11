import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, addItem, deleteItem } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getCollection(req.userId, "properties"));
});

// POST /api/realestate
// body: { name, potentialIncome, vacancyLossPct, operatingExpenses, equity, annualDebtService }
router.post("/", (req, res) => {
  const {
    name = "عقار",
    potentialIncome,
    vacancyLossPct = 0,
    operatingExpenses = 0,
    equity = 0,
    annualDebtService = 0,
  } = req.body;

  if (typeof potentialIncome !== "number" || potentialIncome <= 0) {
    return res.status(400).json({ error: "مجمل الدخل المتوقع مطلوب" });
  }

  const vacancyLosses = +((potentialIncome * vacancyLossPct) / 100).toFixed(2);
  const egi = +(potentialIncome - vacancyLosses).toFixed(2); // Effective Gross Income
  const noi = +(egi - operatingExpenses).toFixed(2); // Net Operating Income
  const oer = egi > 0 ? +((operatingExpenses / egi) * 100).toFixed(2) : null; // Operating Expense Ratio
  const cashOnCash = equity > 0 ? +(((noi - annualDebtService) / equity) * 100).toFixed(2) : null;
  const breakEvenRatio = egi > 0 ? +(((operatingExpenses + annualDebtService) / egi) * 100).toFixed(2) : null;

  const item = {
    id: nanoid(8),
    name,
    potentialIncome,
    vacancyLossPct,
    operatingExpenses,
    equity,
    annualDebtService,
    vacancyLosses,
    egi,
    noi,
    oer,
    cashOnCash,
    breakEvenRatio,
    date: new Date().toISOString(),
  };

  addItem(req.userId, "properties", item);
  res.json(item);
});

router.delete("/:id", (req, res) => {
  deleteItem(req.userId, "properties", req.params.id);
  res.json({ ok: true });
});

export default router;

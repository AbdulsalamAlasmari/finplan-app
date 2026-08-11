import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, addItem, deleteItem } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getCollection(req.userId, "loanChecks"));
});

// POST /api/loans/check
// body: { salary, isRetired, housingCost, otherDebts }
router.post("/check", (req, res) => {
  const { salary, isRetired = false, housingCost = 0, otherDebts = 0 } = req.body;
  if (typeof salary !== "number" || salary <= 0) {
    return res.status(400).json({ error: "الراتب مطلوب" });
  }

  const debtRatio = isRetired ? 0.25 : 0.3333;
  const maxPersonalPayment = +(salary * debtRatio).toFixed(2);

  const maxHousingCost = +(salary * 0.28).toFixed(2);
  const maxTotalObligations = +(salary * 0.36).toFixed(2);
  const currentTotal = +(Number(housingCost) + Number(otherDebts)).toFixed(2);

  const passes2836 = housingCost <= maxHousingCost && currentTotal <= maxTotalObligations;

  const result = {
    id: nanoid(8),
    salary,
    isRetired,
    housingCost,
    otherDebts,
    maxPersonalPayment,
    maxHousingCost,
    maxTotalObligations,
    currentTotal,
    passes2836,
    remainingCapacity: +(maxTotalObligations - currentTotal).toFixed(2),
    date: new Date().toISOString(),
  };

  addItem(req.userId, "loanChecks", result);
  res.json(result);
});

router.delete("/:id", (req, res) => {
  deleteItem(req.userId, "loanChecks", req.params.id);
  res.json({ ok: true });
});

export default router;

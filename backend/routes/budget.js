import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, replaceLatest } from "../db.js";

const router = Router();

// GET /api/budget  -> آخر ميزانية محفوظة + السجل
router.get("/", (req, res) => {
  const list = getCollection(req.userId, "budgets");
  res.json({ latest: list[0] || null, history: list });
});

// POST /api/budget  { income }
router.post("/", (req, res) => {
  const { income } = req.body;
  if (typeof income !== "number" || income <= 0) {
    return res.status(400).json({ error: "الدخل الشهري مطلوب ويجب أن يكون رقماً أكبر من صفر" });
  }
  const necessities = +(income * 0.5).toFixed(2);
  const wants = +(income * 0.3).toFixed(2);
  const savings = +(income * 0.2).toFixed(2);
  const emergencyFundMin = +(necessities * 3).toFixed(2);
  const emergencyFundMax = +(necessities * 6).toFixed(2);

  const item = {
    id: nanoid(8),
    income,
    necessities,
    wants,
    savings,
    emergencyFundMin,
    emergencyFundMax,
    date: new Date().toISOString(),
  };
  replaceLatest(req.userId, "budgets", item, 12);
  res.json(item);
});

export default router;

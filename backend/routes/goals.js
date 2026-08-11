import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, addItem, deleteItem } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getCollection(req.userId, "goals"));
});

// POST /api/goals  { title, targetAmount, currentAmount, targetDate }
router.post("/", (req, res) => {
  const { title, targetAmount, currentAmount = 0, targetDate = null } = req.body;
  if (!title || typeof targetAmount !== "number" || targetAmount <= 0) {
    return res.status(400).json({ error: "اسم الهدف والمبلغ المستهدف مطلوبان" });
  }
  const progress = +((currentAmount / targetAmount) * 100).toFixed(1);
  const item = {
    id: nanoid(8),
    title,
    targetAmount,
    currentAmount,
    targetDate,
    progress,
    date: new Date().toISOString(),
  };
  addItem(req.userId, "goals", item);
  res.json(item);
});

router.delete("/:id", (req, res) => {
  deleteItem(req.userId, "goals", req.params.id);
  res.json({ ok: true });
});

export default router;

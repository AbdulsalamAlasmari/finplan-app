import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, addItem, deleteItem } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getCollection(req.userId, "tvmHistory"));
});

// POST /api/tvm  { label, mode, inputs, result }
// mode: 'fv' | 'pv' | 'fv-pmt' | 'pv-pmt' | 'simple' | 'compound'
router.post("/", (req, res) => {
  const { label = "حساب", mode, inputs = {}, result } = req.body;
  if (!mode || result === undefined) {
    return res.status(400).json({ error: "بيانات الحساب غير مكتملة" });
  }
  const item = { id: nanoid(8), label, mode, inputs, result, date: new Date().toISOString() };
  addItem(req.userId, "tvmHistory", item);
  res.json(item);
});

router.delete("/:id", (req, res) => {
  deleteItem(req.userId, "tvmHistory", req.params.id);
  res.json({ ok: true });
});

export default router;

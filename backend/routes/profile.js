import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, replaceLatest } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const list = getCollection(req.userId, "profile");
  res.json({ latest: list[0] || null });
});

router.post("/", (req, res) => {
  const { answers = {}, profileType, emergencyReady, primaryGoal } = req.body;
  if (!profileType) {
    return res.status(400).json({ error: "بيانات التصنيف غير مكتملة" });
  }
  const item = {
    id: nanoid(8),
    answers,
    profileType,
    emergencyReady,
    primaryGoal,
    date: new Date().toISOString(),
  };
  replaceLatest(req.userId, "profile", item, 5);
  res.json(item);
});

export default router;

import { Router } from "express";
import { nanoid } from "nanoid";
import { getCollection, replaceLatest } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const list = getCollection(req.userId, "networth");
  res.json({ latest: list[0] || null, history: list });
});

// POST /api/networth { assets: {cash, cars, realestate, other}, liabilities: {loans, cards, other} }
router.post("/", (req, res) => {
  const { assets = {}, liabilities = {} } = req.body;
  const totalAssets = Object.values(assets).reduce((s, v) => s + (Number(v) || 0), 0);
  const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + (Number(v) || 0), 0);
  const netWorth = +(totalAssets - totalLiabilities).toFixed(2);

  const item = {
    id: nanoid(8),
    assets,
    liabilities,
    totalAssets: +totalAssets.toFixed(2),
    totalLiabilities: +totalLiabilities.toFixed(2),
    netWorth,
    date: new Date().toISOString(),
  };
  replaceLatest(req.userId, "networth", item, 24);
  res.json(item);
});

export default router;

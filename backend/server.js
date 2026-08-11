import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ensureUser } from "./db.js";

import budgetRoutes from "./routes/budget.js";
import networthRoutes from "./routes/networth.js";
import loanRoutes from "./routes/loans.js";
import investmentRoutes from "./routes/investments.js";
import realestateRoutes from "./routes/realestate.js";
import goalsRoutes from "./routes/goals.js";
import tvmRoutes from "./routes/tvm.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// كل مستخدم في المتصفح يحصل على معرّف عشوائي يُخزَّن في localStorage
// ويُرسَل مع كل طلب عبر الترويسة x-user-id، فتُحفظ بياناته منفصلة عن غيره
// دون الحاجة لتسجيل دخول كامل. يمكن استبدال هذا لاحقاً بنظام مصادقة حقيقي.
app.use((req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(400).json({ error: "missing x-user-id header" });
  }
  req.userId = userId;
  ensureUser(userId);
  next();
});

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/budget", budgetRoutes);
app.use("/api/networth", networthRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/realestate", realestateRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/tvm", tvmRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "خطأ داخلي في الخادم" });
});

app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});

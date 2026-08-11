import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { NumberField, Stat, fmt } from "../components/ui.jsx";
import { api } from "../api.js";

const COLORS = ["#2554ff", "#7a9bff", "#c7d6ff"];

export default function Budget() {
  return (
    <div className="page-content">
      <div className="section-title">الميزانية الشخصية وصافي الثروة</div>
      <div className="section-desc">
        التخطيط المالي عملية منهجية لموازنة الإنفاق والادخار والاستثمار لتحقيق أهدافك — وليس "تخطيط بس
        للأغنياء".
      </div>
      <BudgetTool />
      <NetWorthTool />
    </div>
  );
}

function BudgetTool() {
  const [income, setIncome] = useState(10000);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/budget")
      .then((r) => {
        if (r.latest) {
          setIncome(r.latest.income);
          setResult(r.latest);
        }
      })
      .catch(() => {});
  }, []);

  async function handleCalc() {
    if (!income || income <= 0) return;
    setSaving(true);
    try {
      const item = await api.post("/budget", { income });
      setResult(item);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const chartData = result
    ? [
        { name: "ضروريات (50%)", value: result.necessities },
        { name: "كماليات (30%)", value: result.wants },
        { name: "ادخار وديون (20%)", value: result.savings },
      ]
    : [];

  return (
    <div className="card">
      <div className="section-title" style={{ marginBottom: 4 }}>
        قاعدة الميزانية 50 / 30 / 20
      </div>
      <div className="section-desc">وزّع دخلك الشهري تلقائياً بين الضروريات، الكماليات، والادخار.</div>

      <div className="grid-2">
        <div>
          <NumberField label="الدخل الشهري الإجمالي" value={income} onChange={setIncome} suffix="ريال" />
          <button className="btn btn-primary" onClick={handleCalc} disabled={saving}>
            {saving ? "جارٍ الحساب..." : "احسب وموّزع الميزانية"}
          </button>

          {result && (
            <div style={{ marginTop: 20 }}>
              <Stat label="صندوق الطوارئ الموصى به (3-6 أشهر ضروريات)" value={`${fmt(result.emergencyFundMin)} — ${fmt(result.emergencyFundMax)}`} unit="ريال" />
            </div>
          )}
        </div>

        <div>
          {result ? (
            <>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v) + " ريال"} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid-3" style={{ marginTop: 12 }}>
                <Stat label="ضروريات" value={fmt(result.necessities)} unit="ريال" />
                <Stat label="كماليات" value={fmt(result.wants)} unit="ريال" />
                <Stat label="ادخار وديون" value={fmt(result.savings)} unit="ريال" tone="green" />
              </div>
            </>
          ) : (
            <div className="empty-state">أدخل دخلك الشهري لعرض توزيع الميزانية</div>
          )}
        </div>
      </div>
    </div>
  );
}

function NetWorthTool() {
  const [assets, setAssets] = useState({ cash: 0, cars: 0, realestate: 0, other: 0 });
  const [liabilities, setLiabilities] = useState({ loans: 0, cards: 0, other: 0 });
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/networth")
      .then((r) => {
        if (r.latest) {
          setAssets(r.latest.assets);
          setLiabilities(r.latest.liabilities);
          setResult(r.latest);
        }
      })
      .catch(() => {});
  }, []);

  async function handleCalc() {
    setSaving(true);
    try {
      const item = await api.post("/networth", { assets, liabilities });
      setResult(item);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title" style={{ marginBottom: 4 }}>
        مقياس صافي الثروة
      </div>
      <div className="section-desc">صافي الثروة = مجموع الأصول − مجموع الخصوم</div>

      <div className="grid-2">
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10, color: "var(--blue-700)" }}>الأصول</div>
          <NumberField label="كاش وحسابات بنكية" value={assets.cash} onChange={(v) => setAssets({ ...assets, cash: v })} suffix="ريال" />
          <NumberField label="سيارات" value={assets.cars} onChange={(v) => setAssets({ ...assets, cars: v })} suffix="ريال" />
          <NumberField label="عقارات" value={assets.realestate} onChange={(v) => setAssets({ ...assets, realestate: v })} suffix="ريال" />
          <NumberField label="أصول أخرى" value={assets.other} onChange={(v) => setAssets({ ...assets, other: v })} suffix="ريال" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10, color: "var(--red-500)" }}>الخصوم</div>
          <NumberField label="قروض" value={liabilities.loans} onChange={(v) => setLiabilities({ ...liabilities, loans: v })} suffix="ريال" />
          <NumberField label="بطاقات ائتمان" value={liabilities.cards} onChange={(v) => setLiabilities({ ...liabilities, cards: v })} suffix="ريال" />
          <NumberField label="خصوم أخرى" value={liabilities.other} onChange={(v) => setLiabilities({ ...liabilities, other: v })} suffix="ريال" />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleCalc} disabled={saving} style={{ marginTop: 8 }}>
        {saving ? "جارٍ الحساب..." : "احسب صافي الثروة"}
      </button>

      {result && (
        <div className="grid-3" style={{ marginTop: 20 }}>
          <Stat label="إجمالي الأصول" value={fmt(result.totalAssets)} unit="ريال" tone="green" />
          <Stat label="إجمالي الخصوم" value={fmt(result.totalLiabilities)} unit="ريال" tone="red" />
          <Stat label="صافي الثروة" value={fmt(result.netWorth)} unit="ريال" />
        </div>
      )}
    </div>
  );
}

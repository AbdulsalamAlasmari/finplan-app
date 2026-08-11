import { useEffect, useState } from "react";
import { NumberField, Field, Stat, fmt } from "../components/ui.jsx";
import { IconTrash } from "../components/icons.jsx";
import { api } from "../api.js";

export default function RealEstate() {
  const [name, setName] = useState("");
  const [potentialIncome, setPotentialIncome] = useState(700000);
  const [vacancyLossPct, setVacancyLossPct] = useState(10);
  const [operatingExpenses, setOperatingExpenses] = useState(30000);
  const [equity, setEquity] = useState(500000);
  const [annualDebtService, setAnnualDebtService] = useState(120000);
  const [list, setList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/realestate").then(setList).catch(() => {});
  }, []);

  async function handleCalc() {
    if (!potentialIncome || potentialIncome <= 0) return;
    setSaving(true);
    try {
      const item = await api.post("/realestate", {
        name: name || "عقار",
        potentialIncome,
        vacancyLossPct: vacancyLossPct || 0,
        operatingExpenses: operatingExpenses || 0,
        equity: equity || 0,
        annualDebtService: annualDebtService || 0,
      });
      setList((l) => [item, ...l]);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await api.del(`/realestate/${id}`);
    setList((l) => l.filter((i) => i.id !== id));
  }

  const latest = list[0];

  return (
    <div className="page-content">
      <div className="section-title">التحليل العقاري الاستثماري</div>
      <div className="section-desc">
        شخّص الأداء المالي لعقارك: صافي الدخل التشغيلي، نسبة المصاريف، العائد النقدي على النقد، ونقطة
        التعادل في الإشغال.
      </div>

      <div className="card">
        <div className="grid-2">
          <div>
            <Field label="اسم العقار" hint="اختياري">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: عمارة سكنية - حي النرجس" />
            </Field>
            <NumberField label="مجمل الدخل المتوقع" hint="الإيجار السنوي × عدد الوحدات" value={potentialIncome} onChange={setPotentialIncome} suffix="ريال" />
            <NumberField label="نسبة الشواغر والتعثر" value={vacancyLossPct} onChange={setVacancyLossPct} suffix="%" />
            <NumberField label="المصاريف التشغيلية السنوية" value={operatingExpenses} onChange={setOperatingExpenses} suffix="ريال" />
            <NumberField label="المبلغ الذاتي (Equity)" value={equity} onChange={setEquity} suffix="ريال" />
            <NumberField label="خدمة الدين السنوية (الأقساط)" value={annualDebtService} onChange={setAnnualDebtService} suffix="ريال" />
            <button className="btn btn-primary" onClick={handleCalc} disabled={saving}>
              {saving ? "جارٍ الحساب..." : "احسب مؤشرات العقار"}
            </button>
          </div>

          <div>
            {latest ? (
              <div className="grid-2">
                <Stat label="مجمل الدخل الفعلي (EGI)" value={fmt(latest.egi)} unit="ريال" />
                <Stat label="صافي الدخل التشغيلي (NOI)" value={fmt(latest.noi)} unit="ريال" tone="green" />
                <Stat label="نسبة المصاريف التشغيلية" value={latest.oer !== null ? fmt(latest.oer) : "—"} unit="%" />
                <Stat
                  label="العائد النقدي على النقد"
                  value={latest.cashOnCash !== null ? fmt(latest.cashOnCash) : "—"}
                  unit="%"
                  tone={latest.cashOnCash >= 0 ? "green" : "red"}
                />
                <Stat
                  label="نقطة التعادل (نسبة الإشغال المطلوبة)"
                  value={latest.breakEvenRatio !== null ? fmt(latest.breakEvenRatio) : "—"}
                  unit="%"
                  tone="amber"
                />
              </div>
            ) : (
              <div className="empty-state">أدخل بيانات العقار لعرض المؤشرات</div>
            )}
          </div>
        </div>
      </div>

      {list.length > 0 && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            عقاراتي المحفوظة
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>NOI</th>
                <th>العائد النقدي</th>
                <th>نقطة التعادل</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="num">{fmt(p.noi)} ريال</td>
                  <td className="num">{p.cashOnCash !== null ? fmt(p.cashOnCash) + "%" : "—"}</td>
                  <td className="num">{p.breakEvenRatio !== null ? fmt(p.breakEvenRatio) + "%" : "—"}</td>
                  <td>
                    <button className="btn btn-danger-ghost" onClick={() => handleDelete(p.id)}>
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

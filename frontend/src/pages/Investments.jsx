import { useEffect, useState } from "react";
import { NumberField, Field, Stat, fmt } from "../components/ui.jsx";
import { IconTrash } from "../components/icons.jsx";
import { api } from "../api.js";

export default function Investments() {
  const [name, setName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(110);
  const [annualCashIncome, setAnnualCashIncome] = useState(5);
  const [beta, setBeta] = useState(1.2);
  const [list, setList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/investments").then(setList).catch(() => {});
  }, []);

  async function handleCalc() {
    if (!purchasePrice || purchasePrice <= 0) return;
    setSaving(true);
    try {
      const item = await api.post("/investments", {
        name: name || "استثمار",
        purchasePrice,
        sellingPrice: sellingPrice || undefined,
        annualCashIncome: annualCashIncome || 0,
        beta: beta === "" ? undefined : beta,
      });
      setList((l) => [item, ...l]);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await api.del(`/investments/${id}`);
    setList((l) => l.filter((i) => i.id !== id));
  }

  const latest = list[0];

  return (
    <div className="page-content">
      <div className="section-title">عائد الاستثمار ومعامل بيتا</div>
      <div className="section-desc">
        العائد الكلي = العائد الجاري (الدخل النقدي السنوي) + العائد الرأسمالي (فرق سعر البيع والشراء).
      </div>

      <div className="card">
        <div className="grid-2">
          <div>
            <Field label="اسم الاستثمار" hint="اختياري">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: سهم شركة أ" />
            </Field>
            <NumberField label="سعر الشراء" value={purchasePrice} onChange={setPurchasePrice} suffix="ريال" />
            <NumberField label="سعر البيع الحالي/المتوقع" hint="اختياري" value={sellingPrice} onChange={setSellingPrice} suffix="ريال" />
            <NumberField label="الدخل النقدي السنوي" hint="أرباح موزعة أو إيجار" value={annualCashIncome} onChange={setAnnualCashIncome} suffix="ريال" />
            <NumberField label="معامل بيتا (β)" hint="اختياري" value={beta} onChange={setBeta} />
            <button className="btn btn-primary" onClick={handleCalc} disabled={saving}>
              {saving ? "جارٍ الحساب..." : "احسب العائد"}
            </button>
          </div>

          <div>
            {latest ? (
              <>
                <div className="grid-2">
                  <Stat label="العائد الجاري" value={fmt(latest.currentReturn)} unit="%" tone="green" />
                  <Stat
                    label="العائد الرأسمالي"
                    value={latest.capitalReturn !== null ? fmt(latest.capitalReturn) : "—"}
                    unit="%"
                    tone={latest.capitalReturn >= 0 ? "green" : "red"}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Stat label="العائد الكلي" value={latest.totalReturn !== null ? fmt(latest.totalReturn) : "—"} unit="%" />
                </div>
                {latest.riskLabel && (
                  <div className="pill blue" style={{ marginTop: 14 }}>
                    بيتا {latest.beta}: {latest.riskLabel}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">أدخل بيانات الاستثمار لعرض التحليل</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>دليل معامل بيتا (β)</div>
        <div className="grid-3">
          <Stat label="β = 1" value="مماثل" unit="للمؤشر" />
          <Stat label="β > 1" value="أعلى" unit="مخاطرة وتقلب" tone="amber" />
          <Stat label="β < 1" value="أقل" unit="تقلباً واستقراراً" tone="green" />
        </div>
      </div>

      {list.length > 0 && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            استثماراتي المحفوظة
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>العائد الكلي</th>
                <th>بيتا</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td className="num">{i.totalReturn !== null ? fmt(i.totalReturn) + "%" : "—"}</td>
                  <td className="num">{i.beta ?? "—"}</td>
                  <td>
                    <button className="btn btn-danger-ghost" onClick={() => handleDelete(i.id)}>
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

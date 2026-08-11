import { useEffect, useState } from "react";
import { NumberField, Stat, fmt } from "../components/ui.jsx";
import { IconTrash } from "../components/icons.jsx";
import { api } from "../api.js";

export default function Loans() {
  const [salary, setSalary] = useState(12000);
  const [isRetired, setIsRetired] = useState(false);
  const [housingCost, setHousingCost] = useState(3000);
  const [otherDebts, setOtherDebts] = useState(800);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/loans").then(setHistory).catch(() => {});
  }, []);

  async function handleCheck() {
    if (!salary || salary <= 0) return;
    setLoading(true);
    try {
      const item = await api.post("/loans/check", {
        salary,
        isRetired,
        housingCost: housingCost || 0,
        otherDebts: otherDebts || 0,
      });
      setResult(item);
      setHistory((h) => [item, ...h].slice(0, 8));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await api.del(`/loans/${id}`);
    setHistory((h) => h.filter((i) => i.id !== id));
  }

  return (
    <div className="page-content">
      <div className="section-title">فحص شروط التمويل وضوابط ساما</div>
      <div className="section-desc">
        اعرف أقصى مبلغ تمويل يمكنك الحصول عليه، وتحقق من قدرتك على تحمل أعباء السكن وفق قاعدة 28/36.
      </div>

      <div className="card">
        <div className="grid-2">
          <div>
            <NumberField label="الراتب الشهري" value={salary} onChange={setSalary} suffix="ريال" />

            <div className="field">
              <label>الحالة الوظيفية</label>
              <div className="tabs" style={{ marginBottom: 0 }}>
                <button className={`tab ${!isRetired ? "active" : ""}`} onClick={() => setIsRetired(false)}>
                  موظف (33.33%)
                </button>
                <button className={`tab ${isRetired ? "active" : ""}`} onClick={() => setIsRetired(true)}>
                  متقاعد (25%)
                </button>
              </div>
            </div>

            <NumberField label="قسط السكن الحالي أو المتوقع" value={housingCost} onChange={setHousingCost} suffix="ريال" />
            <NumberField label="التزامات أخرى (سيارة، بطاقات)" value={otherDebts} onChange={setOtherDebts} suffix="ريال" />

            <button className="btn btn-primary" onClick={handleCheck} disabled={loading}>
              {loading ? "جارٍ الفحص..." : "افحص أهليتي"}
            </button>
          </div>

          <div>
            {result ? (
              <>
                <div
                  className={`pill ${result.passes2836 ? "green" : "red"}`}
                  style={{ marginBottom: 16 }}
                >
                  {result.passes2836 ? "ضمن الحدود الآمنة لقاعدة 28/36" : "تتجاوز حدود قاعدة 28/36"}
                </div>
                <div className="grid-2">
                  <Stat label="أقصى استقطاع شخصي شهري" value={fmt(result.maxPersonalPayment)} unit="ريال" />
                  <Stat label="أقصى مصاريف سكن (28%)" value={fmt(result.maxHousingCost)} unit="ريال" />
                  <Stat label="أقصى إجمالي التزامات (36%)" value={fmt(result.maxTotalObligations)} unit="ريال" />
                  <Stat
                    label="القدرة المتبقية للاقتراض"
                    value={fmt(result.remainingCapacity)}
                    unit="ريال"
                    tone={result.remainingCapacity >= 0 ? "green" : "red"}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state">أدخل بياناتك واضغط "افحص أهليتي" لعرض النتيجة</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 6 }}>سجل سمة (SIMAH) — للعلم</div>
        <p style={{ fontSize: 13.5 }}>
          تُحدَّث البيانات الائتمانية أسبوعياً، وتبقى المعلومات السلبية محفوظة في تقريرك لمدة 5 سنوات، أما
          حالات الإفلاس فتبقى لمدة 10 سنوات — وهذا يؤثر مباشرة على قرار البنك بمنح التمويل.
        </p>
      </div>

      {history.length > 0 && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            الفحوصات السابقة
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>الراتب</th>
                <th>النتيجة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="num">{fmt(h.salary)} ريال</td>
                  <td>
                    <span className={`pill ${h.passes2836 ? "green" : "red"}`}>
                      {h.passes2836 ? "مقبول" : "متجاوز"}
                    </span>
                  </td>
                  <td>{new Date(h.date).toLocaleDateString("ar-SA")}</td>
                  <td>
                    <button className="btn btn-danger-ghost" onClick={() => handleDelete(h.id)}>
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

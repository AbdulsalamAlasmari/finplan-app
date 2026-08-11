import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { NumberField, Stat, Tabs, fmt } from "../components/ui.jsx";
import { api } from "../api.js";

const TABS = [
  { value: "fv", label: "القيمة المستقبلية" },
  { value: "pv", label: "القيمة الحالية" },
  { value: "annuity", label: "الدفعات الدورية" },
  { value: "compare", label: "بسيطة مقابل مركبة" },
];

export default function Tvm() {
  const [tab, setTab] = useState("fv");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/tvm").then(setHistory).catch(() => {});
  }, []);

  async function saveToHistory(label, mode, inputs, result) {
    try {
      const item = await api.post("/tvm", { label, mode, inputs, result });
      setHistory((h) => [item, ...h].slice(0, 8));
    } catch {
      /* تجاهل صامت إن تعذّر الحفظ */
    }
  }

  return (
    <div className="page-content">
      <div className="section-title">محرك القيمة الزمنية للنقود</div>
      <div className="section-desc">
        الريال اليوم يساوي أكثر من ريال بكرة — بسبب فرص الاستثمار والتضخم. استخدم الأدوات التالية لحساب
        النمو المستقبلي أو القيمة الحالية لأموالك.
      </div>

      <Tabs options={TABS} value={tab} onChange={setTab} />

      {tab === "fv" && <FvCalc onSave={saveToHistory} />}
      {tab === "pv" && <PvCalc onSave={saveToHistory} />}
      {tab === "annuity" && <AnnuityCalc onSave={saveToHistory} />}
      {tab === "compare" && <CompareCalc />}

      {history.length > 0 && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            آخر الحسابات المحفوظة
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>النوع</th>
                <th>النتيجة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{h.label}</td>
                  <td className="num">{fmt(h.result)} ريال</td>
                  <td>{new Date(h.date).toLocaleDateString("ar-SA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FvCalc({ onSave }) {
  const [pv, setPv] = useState(2000);
  const [r, setR] = useState(5);
  const [n, setN] = useState(3);
  const [m, setM] = useState(1);

  const fv = useMemo(() => {
    if (!pv || r === "" || !n) return null;
    const rate = r / 100;
    return pv * Math.pow(1 + rate / m, m * n);
  }, [pv, r, n, m]);

  return (
    <div className="card">
      <div className="grid-2">
        <div>
          <NumberField label="المبلغ المستثمر اليوم (PV)" value={pv} onChange={setPv} suffix="ريال" />
          <NumberField label="معدل الفائدة السنوي (r)" value={r} onChange={setR} suffix="%" />
          <div className="grid-2">
            <NumberField label="عدد السنوات (n)" value={n} onChange={setN} />
            <NumberField
              label="مرات التراكم في السنة (m)"
              hint="سنوي 1، نصف سنوي 2، ربع سنوي 4، شهري 12"
              value={m}
              onChange={setM}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <Stat label="القيمة المستقبلية (FV)" value={fv !== null ? fmt(fv) : "—"} unit="ريال" />
          <button
            className="btn btn-ghost"
            disabled={fv === null}
            onClick={() => onSave("قيمة مستقبلية", "fv", { pv, r, n, m }, +fv.toFixed(2))}
          >
            حفظ هذا الحساب
          </button>
        </div>
      </div>
    </div>
  );
}

function PvCalc({ onSave }) {
  const [fv, setFv] = useState(2100);
  const [r, setR] = useState(5);
  const [n, setN] = useState(1);

  const pv = useMemo(() => {
    if (!fv || r === "" || !n) return null;
    return fv / Math.pow(1 + r / 100, n);
  }, [fv, r, n]);

  return (
    <div className="card">
      <div className="grid-2">
        <div>
          <NumberField label="المبلغ المستقبلي (FV)" value={fv} onChange={setFv} suffix="ريال" />
          <NumberField label="معدل الفائدة السنوي (r)" value={r} onChange={setR} suffix="%" />
          <NumberField label="عدد السنوات (n)" value={n} onChange={setN} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <Stat label="القيمة الحالية (PV)" value={pv !== null ? fmt(pv) : "—"} unit="ريال" />
          <button
            className="btn btn-ghost"
            disabled={pv === null}
            onClick={() => onSave("قيمة حالية", "pv", { fv, r, n }, +pv.toFixed(2))}
          >
            حفظ هذا الحساب
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnuityCalc({ onSave }) {
  const [mode, setMode] = useState("fv");
  const [pmt, setPmt] = useState(2000);
  const [r, setR] = useState(5);
  const [n, setN] = useState(10);

  const result = useMemo(() => {
    if (!pmt || r === "" || !n) return null;
    const rate = r / 100;
    if (mode === "fv") return pmt * ((Math.pow(1 + rate, n) - 1) / rate);
    return pmt * ((1 - Math.pow(1 + rate, -n)) / rate);
  }, [mode, pmt, r, n]);

  return (
    <div className="card">
      <div className="grid-2">
        <div>
          <div className="field">
            <label>نوع القيمة المطلوبة</label>
          </div>
          <Tabs
            options={[
              { value: "fv", label: "القيمة المستقبلية للدفعات" },
              { value: "pv", label: "القيمة الحالية للدفعات" },
            ]}
            value={mode}
            onChange={setMode}
          />
          <NumberField label="قيمة الدفعة الدورية (PMT)" value={pmt} onChange={setPmt} suffix="ريال" />
          <NumberField label="معدل الفائدة السنوي (r)" value={r} onChange={setR} suffix="%" />
          <NumberField label="عدد الدفعات/السنوات (n)" value={n} onChange={setN} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <Stat
            label={mode === "fv" ? "القيمة المستقبلية للدفعات" : "القيمة الحالية للدفعات"}
            value={result !== null ? fmt(result) : "—"}
            unit="ريال"
          />
          <button
            className="btn btn-ghost"
            disabled={result === null}
            onClick={() =>
              onSave(
                mode === "fv" ? "قيمة مستقبلية لدفعات" : "قيمة حالية لدفعات",
                mode === "fv" ? "fv-pmt" : "pv-pmt",
                { pmt, r, n },
                +result.toFixed(2)
              )
            }
          >
            حفظ هذا الحساب
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareCalc() {
  const [pv, setPv] = useState(2000);
  const [r, setR] = useState(5);
  const [years, setYears] = useState(15);

  const data = useMemo(() => {
    const rate = r / 100;
    const rows = [];
    for (let y = 0; y <= years; y++) {
      rows.push({
        year: y,
        بسيطة: +(pv + pv * rate * y).toFixed(2),
        مركبة: +(pv * Math.pow(1 + rate, y)).toFixed(2),
      });
    }
    return rows;
  }, [pv, r, years]);

  const last = data[data.length - 1];

  return (
    <div className="card">
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <NumberField label="رأس المال" value={pv} onChange={setPv} suffix="ريال" />
        <NumberField label="معدل الفائدة السنوي" value={r} onChange={setR} suffix="%" />
        <NumberField label="عدد السنوات" value={years} onChange={setYears} />
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#eef1fa" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={70} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Legend />
            <Line type="monotone" dataKey="بسيطة" stroke="#8895b3" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="مركبة" stroke="#2554ff" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {last && (
        <div className="grid-2" style={{ marginTop: 20 }}>
          <Stat label={`بعد ${years} سنة — فائدة بسيطة`} value={fmt(last["بسيطة"])} unit="ريال" />
          <Stat label={`بعد ${years} سنة — فائدة مركبة`} value={fmt(last["مركبة"])} unit="ريال" tone="green" />
        </div>
      )}
    </div>
  );
}

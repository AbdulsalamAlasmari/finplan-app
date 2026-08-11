import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

const Q1_OPTIONS = [
  { value: "emergency", label: "تكوين صندوق طوارئ" },
  { value: "short", label: "ادخار لهدف قريب (1-3 سنوات)" },
  { value: "long", label: "بناء ثروة على المدى الطويل" },
  { value: "grow", label: "تنمية أموال موجودة فعلاً" },
];

const Q2_OPTIONS = [
  { value: "yes", label: "نعم، جاهز" },
  { value: "no", label: "لا" },
  { value: "unsure", label: "مو متأكد" },
];

const Q3_OPTIONS = [
  { value: 1, label: "أبيع فوراً عشان أوقف الخسارة" },
  { value: 2, label: "أقلق، لكن أنتظر وما أتصرف" },
  { value: 3, label: "ما يهزني، أتحمل تقلب أعلى مقابل عائد أفضل" },
];

const Q4_OPTIONS = [
  { value: 1, label: "أقل من سنة" },
  { value: 2, label: "1 – 3 سنوات" },
  { value: 3, label: "3 – 10 سنوات" },
  { value: 4, label: "أكثر من 10 سنوات" },
];

const ALLOCATIONS = {
  conservative: {
    title: "متحفّظ",
    desc: "الأولوية عندك الأمان والاستقرار على العائد المرتفع. تناسبك الأدوات منخفضة التقلب.",
    rows: [
      { label: "نقد وصندوق طوارئ", value: 25 },
      { label: "صكوك وأذونات خزينة", value: 50 },
      { label: "أسهم وصناديق", value: 15 },
      { label: "عقار", value: 10 },
    ],
    tools: [
      { to: "/tvm", label: "احسب نمو مدخراتك بأمان" },
      { to: "/budget", label: "نظّم ميزانيتك وصندوق الطوارئ" },
    ],
  },
  balanced: {
    title: "متوازن",
    desc: "تقدر تتحمل بعض التقلب مقابل عائد أفضل، مع الحفاظ على جزء آمن من محفظتك.",
    rows: [
      { label: "نقد وصندوق طوارئ", value: 10 },
      { label: "صكوك وأذونات خزينة", value: 30 },
      { label: "أسهم وصناديق", value: 35 },
      { label: "عقار", value: 25 },
    ],
    tools: [
      { to: "/investments", label: "قيّم عائد استثماراتك الحالية" },
      { to: "/realestate", label: "حلّل فرصة عقارية" },
    ],
  },
  aggressive: {
    title: "مغامر",
    desc: "أفقك الزمني طويل وتتحمل تقلبات أعلى بحثاً عن نمو أكبر لرأس المال.",
    rows: [
      { label: "نقد وصندوق طوارئ", value: 5 },
      { label: "صكوك وأذونات خزينة", value: 15 },
      { label: "أسهم وصناديق", value: 55 },
      { label: "عقار", value: 25 },
    ],
    tools: [
      { to: "/investments", label: "احسب العائد الكلي ومعامل بيتا" },
      { to: "/realestate", label: "حلّل فرصة عقارية" },
    ],
  },
};

function OptionGroup({ options, value, onChange }) {
  return (
    <div className="option-list">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`option-btn ${value === opt.value ? "selected" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Guide() {
  const [goal, setGoal] = useState(null);
  const [emergencyReady, setEmergencyReady] = useState(null);
  const [riskReaction, setRiskReaction] = useState(null);
  const [horizon, setHorizon] = useState(null);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const allAnswered = goal && emergencyReady && riskReaction && horizon;

  async function handleSubmit() {
    const needsEmergencyFund = goal === "emergency" || emergencyReady !== "yes";
    let profileType;
    if (needsEmergencyFund) {
      profileType = "needsEmergency";
    } else {
      const score = riskReaction + horizon;
      if (score <= 3) profileType = "conservative";
      else if (score <= 5) profileType = "balanced";
      else profileType = "aggressive";
    }

    setResult({ profileType });

    setSaving(true);
    try {
      await api.post("/profile", {
        answers: { goal, emergencyReady, riskReaction, horizon },
        profileType,
        emergencyReady: emergencyReady === "yes",
        primaryGoal: goal,
      });
    } catch {
      /* تجاهل صامت إن تعذّر الحفظ */
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-content">
      <div className="section-title">المرشد الذكي — وين أبدأ؟</div>
      <div className="section-desc">
        أربعة أسئلة سريعة تحدد لك نوعك الاستثماري وأنسب نقطة بداية بين أدوات الادخار والاستثمار.
      </div>

      <div className="card">
        <div className="quiz-question">
          <div className="quiz-question-title">1. وش هدفك الأساسي الحين؟</div>
          <OptionGroup options={Q1_OPTIONS} value={goal} onChange={setGoal} />
        </div>

        <div className="quiz-question">
          <div className="quiz-question-title">2. عندك صندوق طوارئ يغطي 3-6 أشهر من مصاريفك؟</div>
          <OptionGroup options={Q2_OPTIONS} value={emergencyReady} onChange={setEmergencyReady} />
        </div>

        <div className="quiz-question">
          <div className="quiz-question-title">3. لو انخفضت قيمة استثمارك 15% فجأة، وش ردة فعلك الطبيعية؟</div>
          <OptionGroup options={Q3_OPTIONS} value={riskReaction} onChange={setRiskReaction} />
        </div>

        <div className="quiz-question" style={{ marginBottom: 6 }}>
          <div className="quiz-question-title">4. متى بتحتاج هالفلوس؟</div>
          <OptionGroup options={Q4_OPTIONS} value={horizon} onChange={setHorizon} />
        </div>

        <button className="btn btn-primary" disabled={!allAnswered || saving} onClick={handleSubmit}>
          {saving ? "جارٍ التحديد..." : "حدد لي نقطة البداية"}
        </button>
      </div>

      {result && result.profileType === "needsEmergency" && (
        <div className="card">
          <div className="profile-banner" style={{ background: "linear-gradient(155deg, #d98a1f, #b8730f)" }}>
            <div>
              <div className="profile-banner-label">توصيتنا لك</div>
              <div className="profile-banner-type">ابدأ بصندوق الطوارئ أولاً</div>
            </div>
          </div>
          <p style={{ marginTop: 16 }}>
            قبل التفكير بالاستثمار، الأولوية دائماً تكوين صندوق طوارئ يغطي 3 إلى 6 أشهر من مصاريفك
            الضرورية — هذا يحميك من بيع استثماراتك بخسارة عند أي طارئ. استخدم أداة الميزانية لتحديد
            المبلغ المطلوب والبدء بتجميعه.
          </p>
          <Link to="/budget" className="btn btn-ghost" style={{ marginTop: 14 }}>
            روح لأداة الميزانية وصندوق الطوارئ
          </Link>
        </div>
      )}

      {result && result.profileType !== "needsEmergency" && (
        <ResultCard profile={ALLOCATIONS[result.profileType]} />
      )}
    </div>
  );
}

function ResultCard({ profile }) {
  return (
    <div className="card">
      <div className="profile-banner">
        <div>
          <div className="profile-banner-label">تصنيفك الاستثماري</div>
          <div className="profile-banner-type">{profile.title}</div>
        </div>
      </div>
      <p style={{ marginTop: 16, marginBottom: 20 }}>{profile.desc}</p>

      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 14 }}>توزيع تقريبي مقترح للمحفظة</div>
      {profile.rows.map((r) => (
        <div className="allocation-row" key={r.label}>
          <div className="allocation-label">{r.label}</div>
          <div className="allocation-track">
            <div className="allocation-fill" style={{ width: `${r.value}%` }} />
          </div>
          <div className="allocation-value num">{r.value}%</div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        {profile.tools.map((t) => (
          <Link to={t.to} key={t.to} className="btn btn-ghost">
            {t.label}
          </Link>
        ))}
      </div>

      <div className="disclaimer">
        هذا دليل تعليمي لمساعدتك على فهم نوعك الاستثماري بشكل عام، وليس استشارة مالية مرخّصة ولا توصية
        بشراء أصل معين. لأي قرار استثماري كبير، يُفضّل استشارة مستشار مالي مرخّص.
      </div>
    </div>
  );
}

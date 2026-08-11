import { Link } from "react-router-dom";
import { IconClock, IconPie, IconBank, IconChart, IconBuilding, IconCompass, IconArrow } from "../components/icons.jsx";

const TOOLS = [
  {
    to: "/guide",
    icon: IconCompass,
    title: "المرشد الذكي — وين أبدأ؟",
    desc: "أربعة أسئلة تحدد نوعك الاستثماري وتوجهك لأنسب أداة تبدأ فيها.",
  },
  {
    to: "/tvm",
    icon: IconClock,
    title: "القيمة الزمنية للنقود",
    desc: "احسب القيمة المستقبلية والحالية، وقارن بين الفائدة البسيطة والمركبة بيانياً.",
  },
  {
    to: "/budget",
    icon: IconPie,
    title: "الميزانية وصافي الثروة",
    desc: "وزّع دخلك الشهري وفق قاعدة 50/30/20 واحسب صافي ثروتك الحالي.",
  },
  {
    to: "/loans",
    icon: IconBank,
    title: "القروض والتمويل",
    desc: "تحقق من حدود الاستقطاع وفق ضوابط ساما وقاعدة 28/36 لتحمل أعباء السكن.",
  },
  {
    to: "/investments",
    icon: IconChart,
    title: "الاستثمار والعائد",
    desc: "احسب العائد الجاري والرأسمالي والكلي، وقيّم المخاطرة عبر معامل بيتا.",
  },
  {
    to: "/realestate",
    icon: IconBuilding,
    title: "الاستثمار العقاري",
    desc: "صافي الدخل التشغيلي، نسبة المصاريف، العائد النقدي، ونقطة التعادل.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">رؤية 2030 · رفع نسبة الادخار الأسري من 6% إلى 10%</div>
        <h1>خطّط أموالك بثقة، خطوة بخطوة</h1>
        <p>
          أدوات تفاعلية دقيقة للقيمة الزمنية للنقود، الميزانية، القروض، الاستثمار، والعقار — كل أداة في
          مكانها الخاص، بدون تعقيد.
        </p>
        <Link to="/guide" className="btn btn-primary" style={{ marginTop: 22 }}>
          ما تدري وين تبدأ؟ جرّب المرشد الذكي
        </Link>
      </div>

      <div className="page-content" style={{ paddingTop: 8 }}>
        <div className="section-title">الأدوات</div>
        <div className="section-desc">كل أداة مستقلة بصفحتها الخاصة، وتُحفظ بياناتك تلقائياً في حسابك.</div>

        <div className="tool-grid">
          {TOOLS.map((t) => (
            <Link to={t.to} className="tool-card" key={t.to}>
              <div className="tool-icon">
                <t.icon width={22} height={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{t.title}</div>
              <p style={{ fontSize: 13.5 }}>{t.desc}</p>
              <div style={{ marginTop: "auto", color: "var(--blue-600)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                فتح الأداة <IconArrow style={{ transform: "rotate(180deg)" }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

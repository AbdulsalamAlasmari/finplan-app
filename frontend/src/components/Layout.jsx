import { NavLink, Outlet, useLocation } from "react-router-dom";
import { IconHome, IconClock, IconPie, IconBank, IconChart, IconBuilding, IconCompass } from "./icons.jsx";

const NAV = [
  { to: "/", label: "الرئيسية", icon: IconHome, end: true },
  { to: "/guide", label: "المرشد الذكي — وين أبدأ؟", icon: IconCompass },
  { to: "/tvm", label: "القيمة الزمنية للنقود", icon: IconClock },
  { to: "/budget", label: "الميزانية والثروة", icon: IconPie },
  { to: "/loans", label: "القروض والتمويل", icon: IconBank },
  { to: "/investments", label: "الاستثمار والعائد", icon: IconChart },
  { to: "/realestate", label: "الاستثمار العقاري", icon: IconBuilding },
];

const TITLES = {
  "/": ["نظرة عامة", "لوحة التحكم"],
  "/guide": ["الأدوات", "المرشد الذكي"],
  "/tvm": ["الأدوات", "القيمة الزمنية للنقود"],
  "/budget": ["الأدوات", "الميزانية وصافي الثروة"],
  "/loans": ["الأدوات", "فحص القروض وقواعد ساما"],
  "/investments": ["الأدوات", "عائد الاستثمار ومعامل بيتا"],
  "/realestate": ["الأدوات", "التحليل العقاري"],
};

export default function Layout() {
  const location = useLocation();
  const [eyebrow, title] = TITLES[location.pathname] || ["الأدوات", ""];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 17 10 10l4 3 6-8" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="brand-name">مستقبلي المالي</div>
            <div className="brand-sub">تخطيط مالي شخصي</div>
          </div>
        </div>

        <div>
          <div className="nav-group-label">القوائم</div>
          <ul className="nav-list">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
                >
                  <item.icon />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "auto", padding: "12px 10px", fontSize: 11.5, color: "var(--ink-faint)" }}>
          مبني على قواعد SAMA ومحتوى مهارات التخطيط المالي — رؤية 2030
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="page-eyebrow">{eyebrow}</div>
            <div className="page-title">{title}</div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

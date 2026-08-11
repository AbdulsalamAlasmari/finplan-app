const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconHome = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-6h4v6" />
  </svg>
);

export const IconClock = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconPie = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <path d="M12 3.5v8.5h8.5A8.5 8.5 0 1 1 12 3.5Z" />
    <path d="M14.5 3.8A8.5 8.5 0 0 1 20.2 9.5H14.5V3.8Z" />
  </svg>
);

export const IconBank = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <path d="M4 10 12 4l8 6" />
    <path d="M5 10.5v8M9.5 10.5v8M14.5 10.5v8M19 10.5v8" />
    <path d="M3.5 21h17" />
  </svg>
);

export const IconChart = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
  </svg>
);

export const IconBuilding = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <rect x="5" y="3.5" width="10" height="17" rx="1" />
    <path d="M15 9h4v11.5H15" />
    <path d="M8 7h1M11 7h1M8 10.5h1M11 10.5h1M8 14h1M11 14h1" />
  </svg>
);

export const IconCompass = (p) => (
  <svg viewBox="0 0 24 24" className="nav-icon" {...common} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M15 9l-2 6-4-2 2-6z" />
  </svg>
);

export const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" width="15" height="15" {...common} {...p}>
    <path d="M4.5 6.5h15" />
    <path d="M9 6.5V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
  </svg>
);

export const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...common} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...common} {...p}>
    <path d="M15 6 9 12l6 6" />
  </svg>
);

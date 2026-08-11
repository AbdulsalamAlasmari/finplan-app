export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>
        {label} {hint && <span className="hint">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function NumberField({ label, hint, value, onChange, placeholder, min }) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        value={value}
        min={min}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    </Field>
  );
}

export function Stat({ label, value, unit, tone }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${tone || ""}`}>
        {value} {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
}

export function Tabs({ options, value, onChange }) {
  return (
    <div className="tabs">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`tab ${value === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function fmt(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("ar-SA", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

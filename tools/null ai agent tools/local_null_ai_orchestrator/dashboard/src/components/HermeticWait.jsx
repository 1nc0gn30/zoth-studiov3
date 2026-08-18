import { useEffect, useState } from "react";

const PHASES = [
  "Reading the thread",
  "Routing the model",
  "Gathering tools",
  "Writing the reply",
];

export default function HermeticWait({ visual = "seal", motion = "orbit", showStatus = true }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!showStatus || visual === "off") return;
    const iv = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 1600);
    return () => clearInterval(iv);
  }, [showStatus, visual]);

  if (visual === "off") {
    return <p className="muted thinking">Working…</p>;
  }

  return (
    <div className={`hwait motion-${motion} vis-${visual}`} role="status" aria-live="polite">
      <div className="hwait-stage" aria-hidden="true">
        {(visual === "seal" || visual === "ring") && (
          <svg className="hwait-seal" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" />
            <circle cx="60" cy="60" r="44" />
            <path d="M60 16 L98 84 H22 Z" />
            <path d="M60 104 L22 36 H98 Z" />
            <path d="M46 48 H60 L54 56 H74" />
            <circle className="hwait-spark" cx="60" cy="16" r="2.2" />
          </svg>
        )}
        {visual === "bar" && (
          <div className="hwait-bar">
            <span />
          </div>
        )}
        {visual === "constellation" && (
          <svg className="hwait-stars" viewBox="0 0 160 56">
            {[12, 40, 68, 96, 124, 148].map((x, i) => (
              <circle key={x} className={`star s${i}`} cx={x} cy={20 + (i % 3) * 10} r="2.4" />
            ))}
            <path d="M12 28 L40 20 L68 30 L96 18 L124 26 L148 22" />
          </svg>
        )}
      </div>
      {showStatus && <p className="hwait-phase">{PHASES[phase]}</p>}
    </div>
  );
}

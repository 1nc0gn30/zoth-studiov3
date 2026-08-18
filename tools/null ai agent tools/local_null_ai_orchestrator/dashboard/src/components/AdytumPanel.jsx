import { useRef, useState } from "react";

function readAdytum(win) {
  if (!win) return null;
  try {
    const log = JSON.parse(win.localStorage.getItem("adytum_session_log") || "[]");
    const progress = JSON.parse(win.localStorage.getItem("adytum_progress_state") || "{}");
    return { log, progress };
  } catch {
    return null;
  }
}

function slugName(text) {
  const slug = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "adytum-brief";
}

function briefFromSession(data) {
  const log = Array.isArray(data?.log) ? data.log : [];
  const users = log.filter((m) => m?.role === "user" && m.content).map((m) => String(m.content).trim());
  const assistants = log.filter((m) => m?.role === "assistant" && m.content).map((m) => String(m.content).trim());
  const lastUser = users.slice(-3).join("\n\n");
  const lastAssist = String(assistants.at(-1) || "")
    .replace(/[#*_`]/g, "")
    .slice(0, 700);
  const cards = data?.progress?.cards || {};
  const touched = Object.values(cards).filter((c) => c && (c.gatesOpened || c.completed || c.lessonsOpened)).length;
  const cycles = Number(data?.progress?.totalCyclesCompleted || 0);
  return {
    name: slugName(users[0]),
    inferred: true,
    site_type: "landing",
    tone: "dark-mode",
    frameworks: ["astro"],
    css_framework: "tailwind",
    pages: "home, about, contact",
    keywords: "hermetic, purpose, dark",
    step: 1,
    instructions: [
      `Purpose drafted in Adytum before build. Keys touched: ${touched}/22. Cycles: ${cycles}.`,
      lastUser ? `Aspirant notes:\n${lastUser}` : "No reflections saved yet — hold the rite, then pour again.",
      lastAssist ? `Guide synthesis:\n${lastAssist}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

export default function AdytumPanel({ onBrief }) {
  const frame = useRef(null);
  const [note, setNote] = useState("");

  function pour() {
    const data = readAdytum(frame.current?.contentWindow);
    if (!data) {
      setNote("Could not read the rite yet. Stay on this origin and try again.");
      return;
    }
    const preset = briefFromSession(data);
    setNote("Poured into Studio.");
    onBrief?.(preset);
  }

  return (
    <div className="adytum-panel">
      <div className="adytum-toolbar">
        <p className="muted">
          Walk the keys. When the purpose is clear, pour the notes into Studio.
        </p>
        <button type="button" className="composer-send" onClick={pour}>
          Pour into Studio
        </button>
        {note ? <small className="muted">{note}</small> : null}
      </div>
      <iframe
        ref={frame}
        className="deck-frame adytum-frame"
        title="Adytum"
        src="/adytum/"
        style={{ minHeight: "680px" }}
      />
    </div>
  );
}

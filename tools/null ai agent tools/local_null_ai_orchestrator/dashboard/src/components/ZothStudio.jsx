import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAstroThemes,
  getAstroSites,
  startAstroPreview,
  stopAstroPreview,
  getAstroPreviewStatus,
  buildAstroSite,
  generateAstroAgent,
  getStudioFrameworks,
  generateStudioProject,
  getStudioProjects,
  studioBuild,
  studioDeploy,
  studioGeneratePrompt,
  getStudioAgentStatus,
} from "../api";

// ── Constants ──

const FRAMEWORKS = [
  { id: "astro", label: "Astro", icon: "🚀", desc: "Static-first, island architecture, SEO-optimized", color: "#FF5D01" },
  { id: "react", label: "React + Vite", icon: "⚛️", desc: "Component-driven SPA with Vite bundler", color: "#61DAFB" },
  { id: "vite", label: "Vite", icon: "⚡", desc: "Blazing fast vanilla JS / React build tool", color: "#646CFF" },
  { id: "html", label: "Vanilla HTML/CSS", icon: "📄", desc: "Lightweight static site, zero framework", color: "#E34F26" },
  { id: "python", label: "Python (Flask/FastAPI)", icon: "🐍", desc: "Server-side apps with templating", color: "#3776AB" },
  { id: "vue", label: "Vue + Vite", icon: "💚", desc: "Progressive JS framework with Vite", color: "#42B883" },
  { id: "angular", label: "Angular", icon: "🅰️", desc: "Enterprise TypeScript framework", color: "#DD0031" },
  { id: "svelte", label: "Svelte", icon: "🔥", desc: "Compile-time reactive framework", color: "#FF3E00" },
];

const CSS_FRAMEWORKS = [
  { id: "tailwind", label: "Tailwind CSS", icon: "🎨", desc: "Utility-first, rapid styling" },
  { id: "vanilla-css", label: "Vanilla CSS", icon: "🖌️", desc: "Hand-written, no dependencies" },
  { id: "css-modules", label: "CSS Modules", icon: "🧩", desc: "Scoped styles per component" },
  { id: "sass", label: "SASS/SCSS", icon: "💎", desc: "Preprocessor with variables & nesting" },
  { id: "unocss", label: "UnoCSS", icon: "⚡", desc: "Instant on-demand atomic CSS" },
  { id: "panda", label: "Panda CSS", icon: "🐼", desc: "Type-safe CSS-in-JS at build time" },
];

const TONES = [
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "minimal", label: "Minimal", icon: "✨" },
  { id: "bold", label: "Bold", icon: "⚡" },
  { id: "playful", label: "Playful", icon: "🎮" },
  { id: "corporate", label: "Corporate", icon: "🏢" },
  { id: "dark-mode", label: "Dark UI", icon: "🌑" },
];

const SITE_TYPES = [
  { id: "landing", label: "Landing Page", icon: "🎯" },
  { id: "saas", label: "SaaS Product", icon: "💎" },
  { id: "portfolio", label: "Portfolio", icon: "👤" },
  { id: "ecommerce", label: "E-Commerce", icon: "🛒" },
  { id: "blog", label: "Blog / CMS", icon: "📝" },
  { id: "dashboard", label: "Dashboard / App", icon: "📊" },
  { id: "docs", label: "Documentation", icon: "📖" },
  { id: "agency", label: "Agency / Studio", icon: "✦" },
];

const FEATURES = [
  { id: "seo", label: "SEO Optimized", icon: "🔍" },
  { id: "responsive", label: "Responsive", icon: "📱" },
  { id: "dark-mode", label: "Dark Mode", icon: "🌑" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "auth", label: "Authentication", icon: "🔐" },
  { id: "cms", label: "CMS / Blog", icon: "📰" },
  { id: "forms", label: "Contact Forms", icon: "✉️" },
  { id: "animations", label: "Animations", icon: "✨" },
  { id: "a11y", label: "Accessibility", icon: "♿" },
  { id: "pwa", label: "PWA Ready", icon: "📲" },
  { id: "i18n", label: "i18n / Multi-lang", icon: "🌍" },
  { id: "api", label: "API Integration", icon: "🔌" },
  { id: "netlify", label: "Netlify Ready", icon: "🌐" },
  { id: "sitemap", label: "Sitemap / Robots", icon: "🗺️" },
  { id: "og-assets", label: "OG / Brand Assets", icon: "🖼️" },
  { id: "content-depth", label: "Deep Copy", icon: "✍️" },
];

const DEPTH_OPTIONS = [
  { id: "launch-ready", label: "Launch Ready", icon: "🚀" },
  { id: "content-heavy", label: "Content Heavy", icon: "📚" },
  { id: "conversion", label: "Conversion Flow", icon: "🎯" },
  { id: "tool-app", label: "Usable Tool/App", icon: "🧰" },
];

const DEPLOY_TARGETS = [
  { id: "netlify", label: "Netlify", icon: "🌐", desc: "Static hosting with serverless functions" },
  { id: "vercel", label: "Vercel", icon: "▲", desc: "Edge-first deployment platform" },
  { id: "cloudflare", label: "Cloudflare Pages", icon: "☁️", desc: "Global edge network" },
  { id: "self-hosted", label: "Self-Hosted", icon: "🖥️", desc: "Docker, VPS, or bare metal" },
  { id: "local-only", label: "Local Only", icon: "📁", desc: "Build and run locally" },
];

const DATA_SOURCES = [
  { id: "static-json", label: "Static JSON", icon: "📄", desc: "Local JSON data files" },
  { id: "supabase", label: "Supabase", icon: "⚡", desc: "Postgres + auth + storage" },
  { id: "airtable", label: "Airtable", icon: "📊", desc: "Spreadsheet-style CMS" },
  { id: "mdx", label: "MDX Content", icon: "✍️", desc: "Markdown + JSX components" },
  { id: "api-fetch", label: "External API", icon: "🔌", desc: "Fetch from REST/GraphQL endpoint" },
  { id: "none", label: "No Data Layer", icon: "∅", desc: "Hardcoded / no backend" },
];

const A11Y_LEVELS = [
  { id: "wcag-a", label: "WCAG A", icon: "♿", desc: "Minimum accessibility" },
  { id: "wcag-aa", label: "WCAG AA", icon: "♿", desc: "Industry standard compliance" },
  { id: "wcag-aaa", label: "WCAG AAA", icon: "♿", desc: "Enhanced accessibility" },
];

const STEPS = [
  { num: 1, label: "Brief" },
  { num: 2, label: "Config" },
  { num: 3, label: "Review" },
  { num: 4, label: "Build" },
];

const AGENT_MODELS = [
  { id: "codex", label: "Codex (local)", icon: "⌘" },
  { id: "o3", label: "o3 (OpenAI)", icon: "🧠" },
  { id: "ollama", label: "Ollama (local)", icon: "🦙" },
  { id: "kimi-k2.6:cloud", label: "Kimi K2.6 Cloud", icon: "☁️" },
];

// ── Helpers ──

function toSafeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ── Sub-Components ──

function StepIndicator({ currentStep }) {
  return (
    <div className="zs-steps">
      {STEPS.map((s) => (
        <div key={s.num} className={`zs-step ${currentStep === s.num ? "active" : ""} ${currentStep > s.num ? "done" : ""}`}>
          <span className="zs-step-num">{currentStep > s.num ? "✓" : s.num}</span>
          <span className="zs-step-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function ChipSelector({ items, selected, onToggle, multiple = true }) {
  return (
    <div className="zs-chip-grid">
      {items.map((item) => {
        const isSelected = multiple ? selected.includes(item.id) : selected === item.id;
        return (
          <button key={item.id} className={`zs-chip ${isSelected ? "selected" : ""}`}
            onClick={() => { if (multiple) { onToggle(isSelected ? selected.filter((s) => s !== item.id) : [...selected, item.id]); } else { onToggle(isSelected ? null : item.id); } }}
            style={isSelected && item.color ? { borderColor: item.color, boxShadow: `0 0 8px ${item.color}44` } : {}}>
            <span className="zs-chip-icon">{item.icon}</span>
            <span className="zs-chip-label">{item.label}</span>
            {item.desc && <span className="zs-chip-desc">{item.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

function ThemeGallery({ themes, selected, onSelect }) {
  const [filter, setFilter] = useState("");
  const filtered = filter ? themes.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase())) : themes;
  return (
    <div className="zs-theme-gallery">
      <input className="zs-input" type="text" placeholder="Filter themes..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <div className="zs-theme-grid">
        {filtered.map((theme) => {
          const p = theme.preview || {};
          const isActive = selected === theme.name;
          return (
            <button key={theme.name} className={`zs-theme-card ${isActive ? "selected" : ""}`} onClick={() => onSelect(theme.name)}
              style={{ background: `linear-gradient(135deg, ${p.bg || "#1a1f2c"}, ${p.bg2 || p.bg || "#12121e"})` }}>
              <div className="zs-theme-preview">
                <span className="zs-theme-accent" style={{ background: p.accent || "#3b82f6" }} />
                <span className="zs-theme-swatch" style={{ background: p.accentSecondary || p.accent || "#6366f1" }} />
              </div>
              <div className="zs-theme-info">
                <span className="zs-theme-name">{theme.name}</span>
                {p.font && <span className="zs-theme-font">{p.font}</span>}
              </div>
              {isActive && <span className="zs-theme-check">✓</span>}
            </button>
          );
        })}
        {filtered.length === 0 && <p className="zs-empty">No themes match.</p>}
      </div>
    </div>
  );
}

function AgentAssignment({ availableAgents, assigned, onAssign, onRemove }) {
  return (
    <div className="zs-agent-assign">
      <div className="zs-agent-pool">
        <span className="zs-agent-pool-label">Available</span>
        {availableAgents.filter((a) => !assigned.find((as) => as.id === a.id)).map((a) => (
          <button key={a.id} className="zs-agent-chip" onClick={() => onAssign(a)}>
            <span>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
      <div className="zs-agent-chain">
        <span className="zs-agent-pool-label">Agent Chain →</span>
        {assigned.length === 0 && <span className="zs-agent-empty">Click agents above to add them</span>}
        {assigned.map((a, i) => (
          <div key={a.id} className="zs-agent-chain-item">
            {i > 0 && <span className="zs-agent-arrow">→</span>}
            <div className="zs-agent-chain-card">
              <span className="zs-agent-chain-icon">{a.icon}</span>
              <div className="zs-agent-chain-info">
                <span className="zs-agent-chain-name">{a.label}</span>
                <span className="zs-agent-chain-step">Step {i + 1}</span>
              </div>
              <button className="zs-agent-remove" onClick={() => onRemove(a.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MasterPromptPreview({ prompt, onApprove, onEdit, editing }) {
  return (
    <div className="zs-master-prompt">
      <div className="zs-master-header">
        <span className="zs-master-label">Master prompt</span>
        <button className="zs-btn zs-btn-ghost" onClick={() => onEdit(!editing)}>{editing ? "Done" : "Edit"}</button>
      </div>
      {editing ? (
        <textarea className="zs-textarea zs-prompt-textarea" value={prompt} onChange={(e) => onEdit(true, e.target.value)} rows={12} />
      ) : (
        <div className="zs-master-content">
          {prompt.split("\n").map((line, i) => (
            <p key={i} className={line.startsWith("#") ? "zs-master-heading" : line.startsWith("-") ? "zs-master-bullet" : "zs-master-line"}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function LogLine({ text, severity }) {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const cls = severity === "error" ? "zs-log-err" : severity === "warn" ? "zs-log-warn" : severity === "success" ? "zs-log-ok" : "zs-log-dim";
  const icon = severity === "error" ? "✖" : severity === "warn" ? "⚠" : severity === "success" ? "✔" : "›";
  return (
    <div className={`zs-log-line ${cls}`}>
      <span className="zs-log-ts">{ts}</span>
      <span className="zs-log-icon">{icon}</span>
      <span className="zs-log-msg">{text}</span>
    </div>
  );
}

function AgentLog({ logs, stdout, stderr, lastMessage }) {
  const logRef = useRef(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs, stdout, stderr, lastMessage]);

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const parseLines = (raw) => {
    if (!raw) return [];
    return String(raw).split("\n").map((line) => {
      const l = line.toLowerCase();
      if (l.includes("error") || l.includes("fail") || l.includes("exception") || l.includes("traceback")) return { text: line, severity: "error" };
      if (l.includes("warn") || l.includes("deprecated") || l.includes("caution")) return { text: line, severity: "warn" };
      if (l.includes("success") || l.includes("complete") || l.includes("done") || l.includes("built")) return { text: line, severity: "success" };
      return { text: line, severity: "info" };
    });
  };

  const allLines = [
    ...parseLines(lastMessage ? `✦ ${lastMessage}` : ""),
    ...parseLines(logs),
    ...parseLines(stdout),
    ...parseLines(stderr ? `ERR: ${stderr}` : ""),
  ].filter((l) => l.text);

  const combinedText = [lastMessage, logs, stdout, stderr].filter(Boolean).join("\n---\n");

  return (
    <div className="zs-agent-log">
      <div className="zs-log-toolbar">
        <span className="zs-log-toolbar-label">📋 Agent Output</span>
        <span className="zs-log-line-count">{allLines.length} lines</span>
        {combinedText && (
          <button className="zs-log-copy-btn" onClick={() => handleCopy(combinedText, "all")}>
            {copied === "all" ? "✔ Copied" : "⧉ Copy All"}
          </button>
        )}
      </div>
      <div className="zs-log-scroll" ref={logRef}>
        {allLines.length === 0 && <div className="zs-log-line zs-log-dim"><span className="zs-log-msg">Local scaffold finished — no remote agent log.</span></div>}
        {allLines.map((line, i) => <LogLine key={i} text={line.text} severity={line.severity} />)}
      </div>
      <details className="zs-log-raw-details">
        <summary className="zs-log-raw-toggle">Raw output channels</summary>
        <div className="zs-log-raw-grid">
          {lastMessage && (
            <div className="zs-log-raw-section">
              <div className="zs-log-raw-header"><span>✦ Output</span><button className="zs-log-copy-btn" onClick={() => handleCopy(lastMessage, "output")}>{copied === "output" ? "✔" : "⧉"}</button></div>
              <pre className="zs-log-raw-pre">{lastMessage}</pre>
            </div>
          )}
          {logs && (
            <div className="zs-log-raw-section">
              <div className="zs-log-raw-header"><span>📋 Log</span><button className="zs-log-copy-btn" onClick={() => handleCopy(logs, "log")}>{copied === "log" ? "✔" : "⧉"}</button></div>
              <pre className="zs-log-raw-pre">{logs}</pre>
            </div>
          )}
          {stdout && (
            <div className="zs-log-raw-section">
              <div className="zs-log-raw-header"><span>📤 stdout</span><button className="zs-log-copy-btn" onClick={() => handleCopy(stdout, "stdout")}>{copied === "stdout" ? "✔" : "⧉"}</button></div>
              <pre className="zs-log-raw-pre">{stdout}</pre>
            </div>
          )}
          {stderr && (
            <div className="zs-log-raw-section">
              <div className="zs-log-raw-header"><span>⚠ stderr</span><button className="zs-log-copy-btn" onClick={() => handleCopy(stderr, "stderr")}>{copied === "stderr" ? "✔" : "⧉"}</button></div>
              <pre className="zs-log-raw-pre zs-log-err">{stderr}</pre>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}


// ── Main Component ──

const SHAPE_SKIP = /30-?days|100-websites|boilerplate|boilertemplate|university|mastery|linux|python-math|freecodecamp|numberguess|salonappointment/i;

const SHAPE_MAP = {
  landing: {
    cats: ["Client Services", "Web Apps & SaaS"],
    keys: ["lawn", "care", "business", "single-page", "shop", "home", "repair", "fence", "paint"],
  },
  saas: {
    cats: ["Web Apps & SaaS"],
    keys: ["saas", "app", "tracker", "crm", "dashboard"],
  },
  portfolio: {
    cats: ["Portfolio & Agency"],
    keys: ["portfolio", "resume", "hacker", "single-page"],
  },
  ecommerce: {
    cats: ["Client Services", "Web Apps & SaaS"],
    keys: ["shop", "store", "wares", "skate", "gas"],
  },
  blog: {
    cats: ["Web Apps & SaaS", "Creative & Media"],
    keys: ["blog", "gazette", "chronicle"],
  },
  dashboard: {
    cats: ["Web Apps & SaaS"],
    keys: ["admin", "dashboard", "panel"],
  },
  docs: {
    cats: ["Learning & Courses"],
    keys: ["docs", "guide", "playbook", "security"],
  },
  agency: {
    cats: ["Portfolio & Agency", "Creative & Media"],
    keys: ["agency", "studio", "media", "design"],
  },
};

function prettyTemplateName(id, name) {
  const raw = String(name || id || "").replace(/[-_]+/g, " ").trim();
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

function templatesForType(all, siteType) {
  const spec = SHAPE_MAP[siteType] || { cats: ["Client Services", "Portfolio & Agency"], keys: ["single-page", "portfolio", "business", "lawn"] };
  const scored = (all || [])
    .filter((t) => (t.kind || "template") === "template")
    .filter((t) => !SHAPE_SKIP.test(`${t.id} ${t.name}`))
    .map((t) => {
      const blob = `${t.id} ${t.name}`.toLowerCase();
      const cat = t.category || "";
      let score = 0;
      if (spec.cats.includes(cat)) score += 3;
      score += spec.keys.reduce((n, k) => n + (blob.includes(k) ? 2 : 0), 0);
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((x) => x.t);
}

export default function ZothStudio({ preset = null, templates = [], onPlanInAdytum }) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [keywords, setKeywords] = useState("");
  const [siteType, setSiteType] = useState(null);
  const [tone, setTone] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [features, setFeatures] = useState([]);
  const [depth, setDepth] = useState(["launch-ready", "content-heavy"]);
  const [pages, setPages] = useState("home, about, contact");
  const [logoUrl, setLogoUrl] = useState("");
  const [masterPrompt, setMasterPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildStages, setBuildStages] = useState([]);
  const [buildResult, setBuildResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("create");
  const [agentModel, setAgentModel] = useState("codex");
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [agentStatus, setAgentStatus] = useState(null);
  const [cssFramework, setCssFramework] = useState("tailwind");
  const [deployTarget, setDeployTarget] = useState("netlify");
  const [dataSource, setDataSource] = useState("static-json");
  const [a11yLevel, setA11yLevel] = useState("wcag-aa");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [logAutoScroll, setLogAutoScroll] = useState(true);
  const [templateId, setTemplateId] = useState("");
  const pollRef = useRef(null);
  const waitForAgentRef = useRef(false);

  const availableAgents = [
    { id: "zoth-architect", label: "Z0TH Architect", icon: "🏗️", role: "Plans architecture, generates master prompt" },
    { id: "frontend-designer", label: "Frontend Designer", icon: "🎨", role: "Generates UI components, layouts, and styling" },
    { id: "backend-engineer", label: "Backend Engineer", icon: "⚙️", role: "Creates API routes, data models, server logic" },
    { id: "seo-specialist", label: "SEO Specialist", icon: "🔍", role: "Optimizes metadata, sitemap, canonicals, a11y" },
    { id: "security-auditor", label: "Security Auditor", icon: "🔒", role: "Scans for vulnerabilities, secrets, misconfigs" },
    { id: "devops", label: "DevOps Deploy", icon: "🚀", role: "Builds, tests, and deploys to production" },
  ];

  useEffect(() => {
    if (!preset) return;
    if (preset.name) setProjectName(preset.name);
    if (preset.instructions) setInstructions(preset.instructions);
    if (preset.site_type) setSiteType(preset.site_type);
    if (preset.tone) setTone(preset.tone);
    if (Array.isArray(preset.frameworks) && preset.frameworks.length) setFrameworks(preset.frameworks);
    if (preset.css_framework) setCssFramework(preset.css_framework);
    if (Array.isArray(preset.features) && preset.features.length) setFeatures(preset.features);
    if (preset.deploy_target) setDeployTarget(preset.deploy_target);
    if (preset.pages) setPages(preset.pages);
    if (preset.theme) setSelectedTheme(preset.theme);
    if (preset.template_id) setTemplateId(preset.template_id);
    if (preset.depth) setDepth(Array.isArray(preset.depth) ? preset.depth : [preset.depth]);
    setMode("create");
    setStep(Math.min(4, Math.max(1, preset.step || 2)));
  }, [preset]);

  // Load themes, projects, previews
  useEffect(() => {
    getAstroThemes().then((data) => {
      const list = data.themes || data || [];
      setThemes(Array.isArray(list) ? list : []);
    }).catch(() => {
      setThemes([
        { name: "midnight-neon", preview: { bg: "#0a0a1a", accent: "#3b82f6", accentSecondary: "#6366f1" } },
        { name: "aurora-dream", preview: { bg: "#0f172a", accent: "#22d3ee", accentSecondary: "#a78bfa" } },
        { name: "ember", preview: { bg: "#1a0a0a", accent: "#ef4444", accentSecondary: "#f59e0b" } },
        { name: "forest-mist", preview: { bg: "#0a1a0a", accent: "#22c55e", accentSecondary: "#14b8a6" } },
        { name: "celestial-violet", preview: { bg: "#0f0a1a", accent: "#a855f7", accentSecondary: "#ec4899" } },
        { name: "neon-circuit", preview: { bg: "#0a0a14", accent: "#00ff88", accentSecondary: "#00d4ff" } },
        { name: "brutalist-ink", preview: { bg: "#ffffff", accent: "#18181b", accentSecondary: "#71717a" } },
        { name: "solar-flare", preview: { bg: "#1a0f0a", accent: "#f59e0b", accentSecondary: "#ef4444" } },
        { name: "oceanic-noir", preview: { bg: "#0a1628", accent: "#0ea5e9", accentSecondary: "#06b6d4" } },
      ]);
    });
    getStudioProjects().then((d) => setProjects(d.projects || [])).catch(() => {});
    getAstroPreviewStatus().then((d) => setPreviews(d.running || [])).catch(() => {});
  }, []);

  // Agent status polling — scaffold builds finish locally and never wait here
  useEffect(() => {
    if (!building || !projectName || !waitForAgentRef.current) return;
    const safe = toSafeName(projectName);
    pollRef.current = setInterval(async () => {
      try {
        const status = await getStudioAgentStatus(safe);
        setAgentStatus(status);
        const stage = status.status?.stage;
        const scaffoldDone = status.agent_mode === "scaffold" || stage === "complete" || stage === "completed" || stage === "scaffold";
        const finished = status.process_alive === false && (!status.status?.running || scaffoldDone);
        if (finished) {
          waitForAgentRef.current = false;
          clearInterval(pollRef.current);
          setBuilding(false);
          setBuildStages((prev) => prev.map((s) => ({ ...s, active: false, done: true })));
          if (stage === "build_failed") {
            setBuildResult({ site: safe, results: [{ framework: "html", status: "error", error: status.status.message }] });
          } else {
            setBuildResult({ site: safe, results: [{ framework: "html", status: "ok" }], output: status.last_message || "Local scaffold ready", preview_url: status.preview_url, agent_mode: status.agent_mode || "scaffold" });
            if (status.preview_url) setPreviewUrl(status.preview_url);
          }
        }
      } catch {}
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [building, projectName]);

  // Generate master prompt
  const handleGeneratePrompt = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await studioGeneratePrompt({
        name: projectName, instructions, frameworks, theme: selectedTheme,
        site_type: siteType, tone, features, keywords, logo_url: logoUrl, agents: assignedAgents,
        depth, pages, css_framework: cssFramework, deploy_target: deployTarget,
        data_source: dataSource, supabase_url: supabaseUrl, a11y_level: a11yLevel,
      });
      setMasterPrompt(result.prompt || "");
    } catch {
      const fwStr = frameworks.map((f) => FRAMEWORKS.find((fw) => fw.id === f)?.label).join(", ") || "Auto-select";
      const cssLabel = CSS_FRAMEWORKS.find((c) => c.id === cssFramework)?.label || cssFramework;
      const deployLabel = DEPLOY_TARGETS.find((d) => d.id === deployTarget)?.label || deployTarget;
      const dataLabel = DATA_SOURCES.find((d) => d.id === dataSource)?.label || dataSource;
      const a11yLabel = A11Y_LEVELS.find((a) => a.id === a11yLevel)?.label || a11yLevel;
      setMasterPrompt(`# Project: ${projectName}\n\n## Overview\n${instructions}\n\n## Configuration\n- Type: ${siteType || "Not specified"}\n- Tone: ${tone || "Not specified"}\n- Frameworks: ${fwStr}\n- CSS: ${cssLabel}\n- Theme: ${selectedTheme || "Auto-select"}\n- Data: ${dataLabel}${dataSource === "supabase" && supabaseUrl ? " — " + supabaseUrl : ""}\n- Deploy: ${deployLabel}\n- A11y: ${a11yLabel}\n- Pages: ${pages || "home"}\n- Depth: ${depth.join(", ") || "launch-ready"}\n\n## Build Instructions\n1. Analyze requirements and select architecture\n2. Use ${cssLabel} for all styling — maintain dark UI consistency\n3. Create a complete usable experience, not a placeholder shell\n4. Implement unique page metadata, sitemap.xml, robots.txt, accessible forms, and OG image fallback\n5. Write specific content for the requested audience and workflows\n6. Ensure ${a11yLabel} accessibility compliance\n7. Validate with production build and document deployment to ${deployLabel}`);
    }
    setGenerating(false);
    setStep(3);
  }, [projectName, instructions, frameworks, selectedTheme, siteType, tone, features, keywords, logoUrl, assignedAgents, depth, pages]);

  // Build — local scaffold + preview only
  const handleBuild = useCallback(async () => {
    waitForAgentRef.current = false;
    setBuilding(true);
    setError(null);
    setBuildResult(null);
    setAgentStatus(null);

    const stages = [
      { label: "Scaffolding project directory", detail: `projects/${toSafeName(projectName)}/`, active: true },
      { label: "Writing local pages and copy", detail: "HTML/CSS preview site" },
      { label: "Starting preview server", detail: "detached http.server" },
      { label: "Ready for preview", detail: "Open the local URL" },
    ];
    setBuildStages(stages);

    try {
      await generateStudioProject({
        name: projectName, instructions, frameworks, theme: selectedTheme,
        site_type: siteType, tone, features, keywords, logo_url: logoUrl,
        depth, pages, css_framework: cssFramework, deploy_target: deployTarget,
        data_source: dataSource, supabase_url: supabaseUrl, a11y_level: a11yLevel,
      });
      setBuildStages((prev) => prev.map((s, i) => ({ ...s, done: i === 0, active: i === 1 })));

      const buildRes = await studioBuild(projectName, agentModel);
      setBuildResult(buildRes);

      const mode = buildRes.agent_mode || "scaffold";
      const waitingOnAgent = !buildRes.preview_url && (mode === "codex" || mode === "agent-runner" || mode === "ollama");
      waitForAgentRef.current = waitingOnAgent;
      if (waitingOnAgent) {
        setBuildStages((prev) => prev.map((s, i) => ({ ...s, done: i < 2, active: i === 2 })));
      } else {
        setBuildStages((prev) => prev.map((s) => ({ ...s, done: true, active: false })));
        setBuilding(false);
        setAgentStatus({
          process_alive: false,
          last_message: buildRes.output || "Local scaffold written. Preview is ready.",
          logs: buildRes.output || "",
          stdout: "",
          stderr: "",
          agent_mode: mode,
        });
      }

      let nextPreview = buildRes.preview_url;
      if (!nextPreview) {
        const preview = await startAstroPreview(toSafeName(projectName));
        nextPreview = preview.url;
      }
      if (!nextPreview) throw new Error("Preview server did not return a URL");
      setPreviewUrl(nextPreview);

      try { const d = await getStudioProjects(); setProjects(d.projects || []); } catch {}
    } catch (e) {
      waitForAgentRef.current = false;
      setError(e.message);
      setBuilding(false);
    }
  }, [projectName, instructions, frameworks, selectedTheme, siteType, tone, features, keywords, logoUrl, agentModel, depth, pages]);

  const handleAssignAgent = (agent) => setAssignedAgents((prev) => [...prev, agent]);
  const handleRemoveAgent = (id) => setAssignedAgents((prev) => prev.filter((a) => a.id !== id));

  const resetWizard = () => {
    setStep(1); setProjectName(""); setInstructions(""); setKeywords(""); setSiteType(null); setTone(null);
    setFrameworks([]); setSelectedTheme(""); setFeatures([]); setDepth(["launch-ready", "content-heavy"]); setPages("home, about, contact"); setLogoUrl(""); setMasterPrompt("");
    setEditingPrompt(false); setAssignedAgents([]); setBuildStages([]); setBuildResult(null);
    setPreviewUrl(null); setError(null); setAgentStatus(null); setBuilding(false); waitForAgentRef.current = false;
    setCssFramework("tailwind"); setDeployTarget("netlify"); setDataSource("static-json"); setA11yLevel("wcag-aa");
    setTemplateId("");
    setSupabaseUrl(""); setSupabaseKey(""); setLogAutoScroll(true);
  };

  return (
    <section className="zs-container">
      <div className="zs-header">
        <div className="zs-header-left">
          <span className="zs-brand">Zoth Studio</span>
          <span className="zs-subtitle">A NullAI studio · multi-framework builder</span>
        </div>
        <div className="zs-header-right">
          <button className={`zs-btn ${mode === "create" ? "zs-btn-primary" : "zs-btn-secondary"}`} onClick={() => setMode("create")}>Create</button>
          <button className={`zs-btn ${mode === "browse" ? "zs-btn-primary" : "zs-btn-secondary"}`} onClick={() => { setMode("browse"); getStudioProjects().then((d) => setProjects(d.projects || [])).catch(() => {}); }}>Projects</button>
          {onPlanInAdytum && (
            <button type="button" className="zs-btn zs-btn-secondary" onClick={onPlanInAdytum}>
              Plan in Adytum
            </button>
          )}
        </div>
      </div>

      {mode === "browse" ? (
        <div className="zs-browse">
          {projects.length === 0 ? (
            <div className="card as-card" style={{ textAlign: "center", padding: 30 }}>
              <p style={{ color: "var(--text-muted)" }}>No projects yet. Create one to get started.</p>
              <button className="zs-btn zs-btn-primary" style={{ marginTop: 12 }} onClick={() => setMode("create")}>New project</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
              {projects.map((p) => (
                <div key={p.id || p.name} className="card as-card" style={{ cursor: "pointer", borderLeft: `3px solid ${p.status === "built" ? "var(--accent-green)" : p.status === "building" ? "var(--accent-amber)" : "var(--accent-cyan)"}` }}
                  onClick={() => { setProjectName(p.name); setInstructions(p.instructions || ""); setFrameworks(p.frameworks || []); setSelectedTheme(p.theme || ""); setSiteType(p.site_type || null); setTone(p.tone || null); setFeatures(p.features || []); setDepth(p.depth || ["launch-ready", "content-heavy"]); setPages(p.pages || "home, about, contact"); setLogoUrl(p.logo_url || ""); setMode("create"); setStep(3); }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</span>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{p.frameworks?.join(", ")} · {p.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <StepIndicator currentStep={step} />

          {step === 1 && (
            <div className="zs-step-content">
              <h2 className="zs-section-title">Project brief</h2>
              <p className="zs-section-desc">Describe the product, audience, pages, conversion path, and content expectations. This becomes the agent brief.</p>
              <div className="zs-form-group">
                <label className="zs-label">Project Name</label>
                <input className="zs-input" type="text" placeholder="e.g. the-sauce-kit" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Site Type</label>
                <ChipSelector items={SITE_TYPES} selected={siteType} onToggle={setSiteType} multiple={false} />
              </div>
              {templatesForType(templates, siteType).length > 0 && (
                <div className="zs-form-group">
                  <label className="zs-label">
                    Starting shape <span className="zs-label-hint">(optional template)</span>
                  </label>
                  <div className="zs-template-row">
                    {templatesForType(templates, siteType).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`zs-template-chip${templateId === t.id ? " on" : ""}`}
                        onClick={() => {
                          setTemplateId(t.id);
                          if (!projectName) setProjectName(String(t.id).slice(0, 40));
                          setInstructions((prev) =>
                            prev
                              ? prev
                              : `Start from the “${prettyTemplateName(t.id, t.name)}” template. Keep the structure, rewrite copy for this brief.`
                          );
                        }}
                      >
                        <b>{prettyTemplateName(t.id, t.name)}</b>
                        <small>{t.category}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="zs-form-group">
                <label className="zs-label">Instructions</label>
                <textarea className="zs-textarea" placeholder="Describe your project in detail — what it does, who it's for, pages, vibe..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={5} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Keywords <span className="zs-label-hint">(comma separated)</span></label>
                <input className="zs-input" type="text" placeholder="saas, landing page, dark mode" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Pages / Routes</label>
                <input className="zs-input" type="text" placeholder="home, pricing, docs, contact" value={pages} onChange={(e) => setPages(e.target.value)} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Tone / Style</label>
                <ChipSelector items={TONES} selected={tone} onToggle={setTone} multiple={false} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Logo URL <span className="zs-label-hint">(optional)</span></label>
                <input className="zs-input" type="text" placeholder="https://example.com/logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
              </div>
              <div className="zs-actions">
                <button className="zs-btn zs-btn-primary" disabled={!projectName || !instructions} onClick={() => setStep(2)}>Next: Configure →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="zs-step-content">
              <h2 className="zs-section-title">Configuration</h2>
              <p className="zs-section-desc">Pick frameworks, theme, features, and which AI agent builds your project.</p>
              <div className="zs-form-group">
                <label className="zs-label">Frameworks</label>
                <ChipSelector items={FRAMEWORKS} selected={frameworks} onToggle={setFrameworks} multiple={true} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Theme</label>
                <ThemeGallery themes={themes} selected={selectedTheme} onSelect={setSelectedTheme} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Features</label>
                <ChipSelector items={FEATURES} selected={features} onToggle={setFeatures} multiple={true} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Build Depth</label>
                <ChipSelector items={DEPTH_OPTIONS} selected={depth} onToggle={setDepth} multiple={true} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">AI Agent / Model</label>
                <p className="zs-section-desc" style={{ marginTop: -8 }}>This model will be launched inside your project directory to build the site.</p>
                <ChipSelector items={AGENT_MODELS} selected={agentModel} onToggle={setAgentModel} multiple={false} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">CSS Framework</label>
                <ChipSelector items={CSS_FRAMEWORKS} selected={cssFramework} onToggle={setCssFramework} multiple={false} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Data Source</label>
                <ChipSelector items={DATA_SOURCES} selected={dataSource} onToggle={setDataSource} multiple={false} />
                {dataSource === "supabase" && (
                  <div className="zs-sub-form">
                    <input className="zs-input" type="text" placeholder="Supabase project URL" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} />
                    <input className="zs-input" type="password" placeholder="Supabase anon key" value={supabaseKey} onChange={(e) => setSupabaseKey(e.target.value)} style={{ marginTop: 6 }} />
                    <p className="zs-label-hint" style={{ marginTop: 4 }}>Keys stay client-side only — use RLS policies for security.</p>
                  </div>
                )}
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Deploy Target</label>
                <ChipSelector items={DEPLOY_TARGETS} selected={deployTarget} onToggle={setDeployTarget} multiple={false} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Accessibility Level</label>
                <ChipSelector items={A11Y_LEVELS} selected={a11yLevel} onToggle={setA11yLevel} multiple={false} />
              </div>
              <div className="zs-form-group">
                <label className="zs-label">Agent Pipeline <span className="zs-label-hint">(optional chaining)</span></label>
                <AgentAssignment availableAgents={availableAgents} assigned={assignedAgents} onAssign={handleAssignAgent} onRemove={handleRemoveAgent} />
              </div>
              <div className="zs-actions">
                <button className="zs-btn zs-btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="zs-btn zs-btn-primary" disabled={frameworks.length === 0} onClick={handleGeneratePrompt}>
                  {generating ? "Generating..." : "Generate Master Prompt →"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="zs-step-content">
              <h2 className="zs-section-title">Review & approve</h2>
              <p className="zs-section-desc">This prompt will be written to <code>INSTRUCTIONS.md</code> inside the project directory and fed to the AI agent.</p>
              <div className="zs-config-summary">
                <div className="zs-summary-row"><span className="zs-summary-label">Project</span><span className="zs-summary-value">{projectName}</span></div>
                {templateId && <div className="zs-summary-row"><span className="zs-summary-label">Template</span><span className="zs-summary-value">{templateId}</span></div>}
                <div className="zs-summary-row"><span className="zs-summary-label">Type</span><span className="zs-summary-value">{SITE_TYPES.find((s) => s.id === siteType)?.label || "—"}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Frameworks</span><span className="zs-summary-value">{frameworks.map((f) => FRAMEWORKS.find((fw) => fw.id === f)?.label).join(", ")}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Theme</span><span className="zs-summary-value">{selectedTheme || "Auto"}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Pages</span><span className="zs-summary-value">{pages || "home"}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Depth</span><span className="zs-summary-value">{depth.join(", ") || "launch-ready"}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Agent</span><span className="zs-summary-value">{AGENT_MODELS.find((m) => m.id === agentModel)?.label || agentModel}</span></div>
                <div className="zs-summary-row"><span className="zs-summary-label">Directory</span><span className="zs-summary-value" style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>projects/{toSafeName(projectName)}/</span></div>
              </div>
              <MasterPromptPreview prompt={masterPrompt} onApprove={() => setStep(4)}
                onEdit={(val, isTextarea) => { if (isTextarea === true) setMasterPrompt(val); else setEditingPrompt(val); }} editing={editingPrompt} />
              {assignedAgents.length > 0 && (
                <div className="zs-pipeline-preview">
                  <h3 className="zs-card-title">Agent Pipeline</h3>
                  <div className="zs-pipeline-flow">
                    {assignedAgents.map((a, i) => (
                      <div key={a.id} className="zs-pipeline-step">
                        {i > 0 && <span className="zs-pipeline-arrow">→</span>}
                        <div className="zs-pipeline-card"><span className="zs-pipeline-icon">{a.icon}</span><div><span className="zs-pipeline-name">{a.label}</span><span className="zs-pipeline-role">{a.role}</span></div></div>
                      </div>
                    ))}
                    <span className="zs-pipeline-arrow">→</span>
                    <div className="zs-pipeline-card zs-pipeline-done"><span className="zs-pipeline-icon">✅</span><div><span className="zs-pipeline-name">Production</span><span className="zs-pipeline-role">Ship it</span></div></div>
                  </div>
                </div>
              )}
              <div className="zs-actions">
                <button className="zs-btn zs-btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="zs-btn zs-btn-primary" onClick={() => setStep(4)}>Approve & Build →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="zs-step-content">
              <h2 className="zs-section-title">Build & deploy</h2>
              <p className="zs-section-desc">
                Directory: <code style={{ fontSize: "0.78rem" }}>projects/{toSafeName(projectName)}/</code> — Local scaffold + preview
              </p>

              {error && <div className="error-banner"><span>⚠ {error}</span><button className="retry-btn" onClick={() => setError(null)}>Dismiss</button></div>}

              <div className="zs-build-progress">
                {buildStages.map((stage, i) => (
                  <div key={i} className={`zs-build-stage ${stage.done ? "done" : ""} ${stage.active ? "active" : ""}`}>
                    <span className="zs-build-marker">{stage.done ? "✓" : stage.active ? "◉" : "○"}</span>
                    <span className="zs-build-detail">{stage.label}</span>
                  </div>
                ))}
              </div>

              {!building && buildStages.length === 0 && (
                <div className="zs-build-start">
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
                      Ready to build <strong style={{ color: "var(--accent-cyan)" }}>{projectName}</strong>
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      A directory will be created, local pages written, and a preview server started. No remote agent.
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <button className="zs-btn zs-btn-primary zs-btn-large" onClick={handleBuild}>▶ Build &amp; Preview</button>
                  </div>
                </div>
              )}

              {building && (
                <div className="zs-build-active">
                  <p style={{ color: "var(--accent-cyan)", textAlign: "center", fontSize: "0.85rem" }}>
                    Writing the site into <code>projects/{toSafeName(projectName)}/</code> and starting preview.
                  </p>
                </div>
              )}

              {projectName && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button
                    className="zs-btn zs-btn-primary"
                    disabled={!projectName}
                    onClick={async () => {
                      try {
                        setError(null);
                        const preview = await startAstroPreview(toSafeName(projectName));
                        if (!preview?.url) throw new Error(preview?.error || "Preview server did not return a URL");
                        setPreviewUrl(preview.url);
                        window.open(preview.url, "_blank", "noopener,noreferrer");
                      } catch (e) {
                        setError(e.message);
                      }
                    }}
                  >
                    ▶ Preview
                  </button>
                </div>
              )}

              {agentStatus && (agentStatus.process_alive || agentStatus.logs || agentStatus.stdout || agentStatus.last_message) && (
                <AgentLog
                  logs={agentStatus.logs}
                  stdout={agentStatus.stdout}
                  stderr={agentStatus.stderr}
                  lastMessage={agentStatus.last_message}
                />
              )}

              {buildResult && (
                <div className="zs-build-result">
                  <div className="card as-card" style={{ borderLeft: buildResult.error ? "3px solid var(--accent-red)" : "3px solid var(--accent-green)" }}>
                    <h3 className="as-card-title">{buildResult.error ? "Build issues" : "Build complete"}</h3>
                    <div className="as-ai-plan" style={{ marginTop: 8 }}>
                      {buildResult.site && <div className="as-ai-plan-row"><span>Site</span><strong>{buildResult.site}</strong></div>}
                      {buildResult.dir && <div className="as-ai-plan-row"><span>Directory</span><code style={{ fontSize: "0.72rem" }}>{buildResult.dir}</code></div>}
                      {buildResult.agent_mode && <div className="as-ai-plan-row"><span>Agent</span><strong>{buildResult.agent_mode}</strong></div>}
                      {buildResult.results?.map((r, i) => (
                        <div key={i} className="as-ai-plan-row">
                          <span>{r.framework}</span>
                          <strong style={{ color: r.status === "ok" ? "var(--accent-green)" : r.status === "error" ? "var(--accent-red)" : "var(--text-muted)" }}>{r.status}</strong>
                        </div>
                      ))}
                    </div>
                    <button className="zs-btn zs-btn-primary" style={{ marginTop: 12 }} onClick={async () => {
                      try {
                        setError(null);
                        const safe = toSafeName(projectName);
                        const preview = await startAstroPreview(safe);
                        if (!preview?.url) throw new Error(preview?.error || preview?.message || "Preview server did not return a URL");
                        setPreviewUrl(preview.url);
                        window.open(preview.url, "_blank", "noopener,noreferrer");
                      } catch (e) { setError(e.message); }
                    }}>▶ Preview</button>
                  </div>
                </div>
              )}

              {previewUrl && (
                <div className="as-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="as-card-title" style={{ margin: 0 }}>Live Preview</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={previewUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "var(--accent-cyan)" }}>Open →</a>
                      <button className="zs-btn zs-btn-ghost" onClick={async () => {
                        try { await stopAstroPreview(toSafeName(projectName)); } catch {}
                        setPreviewUrl(null);
                      }}>⏹ Stop</button>
                    </div>
                  </div>
                  <iframe title="preview" src={previewUrl} style={{ width: "100%", height: 420, border: "none", background: "var(--bg-deep)" }} />
                </div>
              )}

              <div className="zs-actions" style={{ marginTop: 20 }}>
                <button className="zs-btn zs-btn-secondary" onClick={() => { setStep(3); setBuildStages([]); setAgentStatus(null); }}>← Back</button>
                <button className="zs-btn zs-btn-secondary" onClick={resetWizard}>↻ New Project</button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}


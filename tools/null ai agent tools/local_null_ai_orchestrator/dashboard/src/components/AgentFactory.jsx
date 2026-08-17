import { useState, useEffect, useCallback } from "react";
import { getAgents, createAgent, updateAgent, deleteAgent, getAgentSkills } from "../api";

// ── Skill Definitions ──

const SKILL_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "🎨",
    skills: [
      { id: "react", label: "React", icon: "⚛️" },
      { id: "astro", label: "Astro", icon: "🚀" },
      { id: "vue", label: "Vue", icon: "💚" },
      { id: "svelte", label: "Svelte", icon: "🔥" },
      { id: "angular", label: "Angular", icon: "🅰️" },
      { id: "html-css", label: "HTML/CSS", icon: "📄" },
      { id: "tailwind", label: "Tailwind", icon: "🌊" },
      { id: "responsive", label: "Responsive Design", icon: "📱" },
      { id: "animations", label: "Animations", icon: "✨" },
      { id: "accessibility", label: "Accessibility", icon: "♿" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "⚙️",
    skills: [
      { id: "node", label: "Node.js", icon: "🟢" },
      { id: "python", label: "Python", icon: "🐍" },
      { id: "flask", label: "Flask", icon: "🌶️" },
      { id: "fastapi", label: "FastAPI", icon: "⚡" },
      { id: "databases", label: "Databases", icon: "🗄️" },
      { id: "api-design", label: "API Design", icon: "🔌" },
      { id: "auth", label: "Auth / Security", icon: "🔐" },
      { id: "serverless", label: "Serverless", icon: "☁️" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Deploy",
    icon: "🚀",
    skills: [
      { id: "docker", label: "Docker", icon: "🐳" },
      { id: "netlify", label: "Netlify", icon: "🌐" },
      { id: "ci-cd", label: "CI/CD", icon: "🔄" },
      { id: "monitoring", label: "Monitoring", icon: "📊" },
      { id: "ssl", label: "SSL / HTTPS", icon: "🔒" },
    ],
  },
  {
    id: "seo",
    label: "SEO & Content",
    icon: "🔍",
    skills: [
      { id: "seo", label: "SEO Optimization", icon: "🔍" },
      { id: "meta-tags", label: "Meta Tags", icon: "🏷️" },
      { id: "sitemap", label: "Sitemap / Robots", icon: "🗺️" },
      { id: "analytics", label: "Analytics", icon: "📈" },
      { id: "copywriting", label: "Copywriting", icon: "✍️" },
    ],
  },
  {
    id: "ai",
    label: "AI & Agents",
    icon: "🤖",
    skills: [
      { id: "prompt-eng", label: "Prompt Engineering", icon: "💬" },
      { id: "rag", label: "RAG Pipelines", icon: "📚" },
      { id: "agents", label: "Agent Design", icon: "🧠" },
      { id: "fine-tuning", label: "Fine-Tuning", icon: "🎯" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "🔒",
    skills: [
      { id: "pentest", label: "Pentesting", icon: "⚔️" },
      { id: "audit", label: "Code Audit", icon: "🔍" },
      { id: "secrets", label: "Secrets Mgmt", icon: "🔑" },
      { id: "hardening", label: "Hardening", icon: "🛡️" },
    ],
  },
];

const PERSONALITIES = [
  { id: "precise", label: "Precise", icon: "🎯", desc: "Minimal, exact, no fluff" },
  { id: "creative", label: "Creative", icon: "🎨", desc: "Inventive, expressive, bold" },
  { id: "thorough", label: "Thorough", icon: "📋", desc: "Exhaustive, detailed, careful" },
  { id: "fast", label: "Fast", icon: "⚡", desc: "Quick iterations, MVP-first" },
  { id: "mentor", label: "Mentor", icon: "🎓", desc: "Explains decisions, educates" },
];

const DEFAULT_AGENTS = [
  { id: "zoth-architect", name: "Z0TH Architect", icon: "🏗️", personality: "thorough", skills: ["react", "astro", "html-css", "tailwind", "seo", "api-design"], role: "Plans architecture and selects optimal stack", builtin: true },
  { id: "frontend-designer", name: "Frontend Designer", icon: "🎨", personality: "creative", skills: ["react", "astro", "html-css", "tailwind", "responsive", "animations", "accessibility"], role: "Generates UI components, layouts, and styling", builtin: true },
  { id: "backend-engineer", name: "Backend Engineer", icon: "⚙️", personality: "precise", skills: ["node", "python", "fastapi", "databases", "api-design", "auth"], role: "Creates API routes, data models, server logic", builtin: true },
  { id: "seo-specialist", name: "SEO Specialist", icon: "🔍", personality: "thorough", skills: ["seo", "meta-tags", "sitemap", "analytics", "copywriting"], role: "Optimizes metadata, sitemap, canonicals, a11y", builtin: true },
  { id: "security-auditor", name: "Security Auditor", icon: "🔒", personality: "precise", skills: ["audit", "secrets", "pentest", "hardening"], role: "Scans for vulnerabilities, secrets, misconfigs", builtin: true },
  { id: "devops", name: "DevOps Deploy", icon: "🚀", personality: "fast", skills: ["docker", "netlify", "ci-cd", "ssl", "monitoring"], role: "Builds, tests, and deploys to production", builtin: true },
];

// ── Components ──

function SkillPicker({ selected, onToggle }) {
  return (
    <div className="af-skills">
      {SKILL_CATEGORIES.map((cat) => (
        <div key={cat.id} className="af-skill-category">
          <div className="af-skill-cat-label">
            <span>{cat.icon}</span> {cat.label}
          </div>
          <div className="af-skill-chips">
            {cat.skills.map((skill) => {
              const isActive = selected.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  className={`af-skill-chip ${isActive ? "active" : ""}`}
                  onClick={() => onToggle(isActive ? selected.filter((s) => s !== skill.id) : [...selected, skill.id])}
                >
                  <span>{skill.icon}</span> {skill.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentCard({ agent, onEdit, onDuplicate, onDelete }) {
  return (
    <div className="af-agent-card">
      <div className="af-agent-icon">{agent.icon}</div>
      <div className="af-agent-body">
        <div className="af-agent-name">
          {agent.name}
          {agent.builtin && <span className="af-agent-badge">Built-in</span>}
          {agent.custom && !agent.builtin && <span className="af-agent-badge af-badge-custom">Custom</span>}
        </div>
        <div className="af-agent-role">{agent.role}</div>
        <div className="af-agent-personality">
          Personality: <strong>{PERSONALITIES.find((p) => p.id === agent.personality)?.label || agent.personality}</strong>
        </div>
        <div className="af-agent-skills">
          {agent.skills?.map((sid) => {
            const allSkills = SKILL_CATEGORIES.flatMap((c) => c.skills);
            const skill = allSkills.find((s) => s.id === sid);
            return skill ? (
              <span key={sid} className="af-skill-tag">{skill.icon} {skill.label}</span>
            ) : null;
          })}
        </div>
      </div>
      <div className="af-agent-actions">
        {onEdit && <button className="af-btn af-btn-small" onClick={() => onEdit(agent)}>✎ Edit</button>}
        {onDuplicate && <button className="af-btn af-btn-small" onClick={() => onDuplicate(agent)}>⧉ Dup</button>}
        {onDelete && !agent.builtin && <button className="af-btn af-btn-danger-small" onClick={() => onDelete(agent.id)}>✕</button>}
      </div>
    </div>
  );
}

// ── Main Component ──

export default function AgentFactory() {
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [mode, setMode] = useState("browse"); // browse | create | edit
  const [editAgent, setEditAgent] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [serverSynced, setServerSynced] = useState(false);

  // Create/edit form state
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("🤖");
  const [formRole, setFormRole] = useState("");
  const [formPersonality, setFormPersonality] = useState("precise");
  const [formSkills, setFormSkills] = useState([]);
  const [formModel, setFormModel] = useState("codex");
  const [saving, setSaving] = useState(false);

  // Load agents from server on mount
  useEffect(() => {
    getAgents()
      .then((data) => {
        const serverAgents = data.agents || [];
        if (serverAgents.length > 0) {
          // Merge server agents with built-in defaults
          const serverIds = new Set(serverAgents.map((a) => a.id));
          const merged = [...DEFAULT_AGENTS, ...serverAgents.filter((a) => !DEFAULT_AGENTS.find((d) => d.id === a.id))];
          setAgents(merged);
          setServerSynced(true);
        }
      })
      .catch(() => {
        // Server not available — use local state only
      });
  }, []);

  const resetForm = useCallback(() => {
    setFormName("");
    setFormIcon("🤖");
    setFormRole("");
    setFormPersonality("precise");
    setFormSkills([]);
    setFormModel("codex");
    setEditAgent(null);
  }, []);

  const handleEdit = (agent) => {
    setEditAgent(agent);
    setFormName(agent.name);
    setFormIcon(agent.icon);
    setFormRole(agent.role);
    setFormPersonality(agent.personality);
    setFormSkills(agent.skills || []);
    setMode("edit");
  };

  const handleDuplicate = (agent) => {
    const newAgent = {
      ...agent,
      id: `${agent.id}-copy-${Date.now()}`,
      name: `${agent.name} (Copy)`,
      builtin: false,
      custom: true,
    };
    setAgents((prev) => [...prev, newAgent]);
    // Sync to server
    createAgent(newAgent).catch(() => {});
  };

  const handleDelete = async (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAgent(id);
    } catch {}
  };

  const handleSave = async () => {
    if (!formName || formSkills.length === 0) return;
    setSaving(true);

    const agentData = {
      id: editAgent?.id || `custom-${Date.now()}`,
      name: formName,
      icon: formIcon,
      role: formRole || `Custom agent with ${formSkills.length} skills`,
      personality: formPersonality,
      skills: formSkills,
      model: formModel,
      builtin: false,
      custom: true,
    };

    if (editAgent) {
      setAgents((prev) => prev.map((a) => (a.id === editAgent.id ? agentData : a)));
      try { await updateAgent(agentData.id, agentData); } catch {}
    } else {
      setAgents((prev) => [...prev, agentData]);
      try { await createAgent(agentData); } catch {}
    }

    resetForm();
    setMode("browse");
    setSaving(false);
  };

  const ICON_OPTIONS = ["🤖", "🏗️", "🎨", "⚙️", "🔍", "🔒", "🚀", "🧠", "💬", "🛡️", "📊", "🐍", "⚛️", "💚", "🔥", "🅰️", "⚡", "🎯"];

  const filteredAgents = agents.filter((a) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      (a.role && a.role.toLowerCase().includes(q)) ||
      (a.skills && a.skills.some((s) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <section className="af-container">
      {/* Header */}
      <div className="af-header">
        <div className="af-header-left">
          <span className="af-brand">Agent Factory</span>
          <span className="af-subtitle">A NullAI studio · design and deploy agents</span>
        </div>
        <div className="af-header-right">
          <input
            className="af-input af-search"
            type="text"
            placeholder="Search agents..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <button className="af-btn af-btn-primary" onClick={() => { resetForm(); setMode("create"); }}>
            + New Agent
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="af-stats">
        <div className="af-stat">
          <span className="af-stat-value">{agents.length}</span>
          <span className="af-stat-label">Total</span>
        </div>
        <div className="af-stat">
          <span className="af-stat-value">{agents.filter((a) => a.builtin).length}</span>
          <span className="af-stat-label">Built-in</span>
        </div>
        <div className="af-stat">
          <span className="af-stat-value">{agents.filter((a) => a.custom && !a.builtin).length}</span>
          <span className="af-stat-label">Custom</span>
        </div>
        <div className="af-stat">
          <span className="af-stat-value">{new Set(agents.flatMap((a) => a.skills || [])).size}</span>
          <span className="af-stat-label">Unique Skills</span>
        </div>
        {serverSynced && (
          <div className="af-stat">
            <span className="af-stat-value" style={{ color: "var(--accent-green)" }}>●</span>
            <span className="af-stat-label">Synced</span>
          </div>
        )}
      </div>

      {/* Browse mode */}
      {mode === "browse" && (
        <div className="af-grid">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
          {filteredAgents.length === 0 && (
            <div className="af-empty">
              <p>No agents match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit mode */}
      {(mode === "create" || mode === "edit") && (
        <div className="af-editor">
          <h2 className="af-editor-title">
            {mode === "edit" ? `Edit ${editAgent?.name}` : "Create new agent"}
          </h2>

          <div className="af-form-grid">
            {/* Left: Basic info */}
            <div className="af-form-section">
              <div className="af-form-group">
                <label className="af-label">Agent Name</label>
                <input
                  className="af-input"
                  type="text"
                  placeholder="e.g. Frontend Designer"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="af-form-group">
                <label className="af-label">Icon</label>
                <div className="af-icon-picker">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      className={`af-icon-option ${formIcon === icon ? "selected" : ""}`}
                      onClick={() => setFormIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="af-form-group">
                <label className="af-label">Role Description</label>
                <textarea
                  className="af-textarea"
                  placeholder="What does this agent do? What is it responsible for?"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="af-form-group">
                <label className="af-label">Personality</label>
                <div className="af-personality-grid">
                  {PERSONALITIES.map((p) => (
                    <button
                      key={p.id}
                      className={`af-personality-card ${formPersonality === p.id ? "selected" : ""}`}
                      onClick={() => setFormPersonality(p.id)}
                    >
                      <span className="af-personality-icon">{p.icon}</span>
                      <span className="af-personality-label">{p.label}</span>
                      <span className="af-personality-desc">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="af-form-group">
                <label className="af-label">Preferred Model</label>
                <select className="af-select" value={formModel} onChange={(e) => setFormModel(e.target.value)}>
                  <option value="codex">Codex</option>
                  <option value="gpt4">GPT-4</option>
                  <option value="ollama">Ollama (local)</option>
                  <option value="hermes">Hermes</option>
                  <option value="openclaw">OpenClaw</option>
                </select>
              </div>
            </div>

            {/* Right: Skills */}
            <div className="af-form-section">
              <div className="af-form-group">
                <label className="af-label">Skills <span className="af-label-hint">({formSkills.length} selected)</span></label>
                <SkillPicker selected={formSkills} onToggle={setFormSkills} />
              </div>
            </div>
          </div>

          {/* Preview */}
          {formName && (
            <div className="af-preview">
              <h3 className="af-preview-title">Preview</h3>
              <AgentCard
                agent={{
                  id: "preview",
                  name: formName,
                  icon: formIcon,
                  role: formRole || "Custom agent",
                  personality: formPersonality,
                  skills: formSkills,
                  custom: true,
                }}
              />
            </div>
          )}

          <div className="af-form-actions">
            <button className="af-btn af-btn-secondary" onClick={() => { resetForm(); setMode("browse"); }}>
              Cancel
            </button>
            <button className="af-btn af-btn-primary" disabled={saving || !formName || formSkills.length === 0} onClick={handleSave}>
              {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Agent"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

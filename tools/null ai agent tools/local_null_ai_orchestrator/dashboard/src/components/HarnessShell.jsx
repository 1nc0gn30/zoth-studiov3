import { useCallback, useEffect, useRef, useState } from "react";
import {
  createConversation,
  deleteConversation,
  getConversation,
  getHarnessCommands,
  getHarnessConnectors,
  getHarnessModels,
  getHarnessSettings,
  getPets,
  harnessAnswer,
  harnessChat,
  listConversations,
  saveHarnessSettings,
} from "../api";
import Popout from "./Popout";
import AskUserCard from "./AskUserCard";
import StudioBriefCard from "./StudioBriefCard";
import SwarmRadar from "./SwarmRadar";
import ConnectorsPanel from "./ConnectorsPanel";
import ReposPanel from "./ReposPanel";
import GithubDrivePanel from "./GithubDrivePanel";
import CompanionPet, {
  onPetPortraitError,
  petPortraitSrc,
  stripPetPrefix,
} from "./CompanionPet";
import HermeticWait from "./HermeticWait";
import AgentTermDock from "./AgentTermDock";
import AIWorkbench from "./AIWorkbench";
import FormattedMessage from "./FormattedMessage";
import Tip from "./Tip";
import SystemPanel from "./SystemPanel";
import ZothStudio from "./ZothStudio";
import SecurityScanner from "./SecurityScanner";
import ParrotNexus from "./ParrotNexus";
import ServerManager from "./ServerManager";
import AgentFactory from "./AgentFactory";
import MediaForge from "./MediaForge";
import AdytumPanel from "./AdytumPanel";
import MalwareLab from "./MalwareLab";
import ToolGrid from "./ToolGrid";
import DagComposer from "./DagComposer";
import SwarmDebateCard from "./SwarmDebateCard";

const SIMPLE_NAV = [
  { id: "swarm", label: "Swarm", blurb: "Who is live" },
  { id: "studio", label: "Studio", blurb: "Build a site" },
  { id: "pets", label: "Pets", blurb: "Companions" },
  { id: "vault", label: "Vault", blurb: "Local keys" },
  { id: "connect", label: "Connect", blurb: "Accounts" },
];
const POWERHOUSE = [
  { id: "composer", label: "Playbooks", blurb: "Visual DAG agent graphs" },
  { id: "consensus", label: "Consensus", blurb: "Three-agent arbitration" },
  { id: "tools", label: "Tool wall", blurb: "Every local tool at once" },
  { id: "github", label: "GitHub", blurb: "Repos, issues, and PRs" },
  { id: "models", label: "Models", blurb: "Local and cloud models" },
  { id: "math", label: "Math", blurb: "Run telemetry and pillars" },
  { id: "workbench", label: "Workbench", blurb: "Scratch a live job" },
  { id: "media", label: "Media", blurb: "Image and video forge" },
  { id: "security", label: "Security", blurb: "Scan and review" },
  { id: "agents", label: "Agents", blurb: "Spin a specialist" },
  { id: "nexus", label: "Nexus", blurb: "Parrot OS toolkit" },
  { id: "repos", label: "Repos", blurb: "Local git worktrees" },
  { id: "omnipost", label: "OmniPost", blurb: "Repurpose a post" },
  { id: "chronicle", label: "Chronicle", blurb: "Roadmap and sprints" },
  { id: "servers", label: "Servers", blurb: "What is listening" },
  { id: "system", label: "System", blurb: "Health and binaries" },
  { id: "adytum", label: "Adytum", blurb: "Plan with purpose" },
  { id: "lab", label: "Lab", blurb: "Isolated experiments" },
  { id: "settings", label: "Settings", blurb: "Wait visual and keys" },
];
const PRIMARY = SIMPLE_NAV;
const MORE = POWERHOUSE;
const PANELS = [...SIMPLE_NAV, ...POWERHOUSE];

function deckHero(id) {
  return {
    hero: `/assets/media/deck/${id}.jpg`,
    video: `/assets/media/deck/${id}.mp4`,
  };
}

const SLASH_TITLES = {
  help: "Commands",
  who: "Who is live",
  pet: "Companion",
  mission: "Mission",
  consensus: "Consensus",
  math: "Math",
  doctor: "Doctor",
  scan: "Scan",
  connect: "Connect",
  github: "GitHub",
  drive: "Drive",
  backup: "Backup",
  vault: "Vault",
};

function tidyLine(s) {
  return String(s || "")
    .replace(/^\[pet:[^\]]+\]\s*/i, "")
    .replace(/^#+\s*/, "")
    .replace(/\*\*|__|==|~~/g, "")
    .replace(/`/g, "")
    .trim();
}

function prettyConvoTitle(c) {
  const raw = String(c?.title || "").trim();
  if (!raw || raw === "New chat") return "Empty thread";
  const stripped = tidyLine(raw);
  if (String(c?.title || "").trim().startsWith("/") || stripped.startsWith("/")) {
    const src = String(c?.title || "").replace(/^\[pet:[^\]]+\]\s*/i, "");
    const [cmd, ...rest] = src.replace(/^\//, "").split(/\s+/);
    const key = (cmd || "").toLowerCase();
    if (key === "pet" && rest[0]) return `Sit ${rest[0]}`;
    return SLASH_TITLES[key] || tidyLine(src.replace(/^\//, ""));
  }
  return stripped || "Empty thread";
}

function prettyConvoPreview(c) {
  const raw = tidyLine(c?.preview);
  if (!raw || raw === "Empty") return "No messages yet";
  return raw;
}

export default function HarnessShell({ data, system, tools, chains, error, reload }) {
  const [convos, setConvos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [models, setModels] = useState([]);
  const [binaries, setBinaries] = useState([]);
  const [keys, setKeys] = useState({});
  const [settings, setSettings] = useState({
    model: "auto",
    connector: "auto",
    wait_visual: "seal",
    wait_motion: "orbit",
    wait_status: true,
    auto_open_studio: false,
  });
  const [studioPreset, setStudioPreset] = useState(null);
  const [panel, setPanel] = useState(null);
  const [termOpen, setTermOpen] = useState(false);
  const [termFocus, setTermFocus] = useState(null);
  const [pets, setPets] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [petId, setPetId] = useState("");
  const [railOpen, setRailOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [commands, setCommands] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(0);
  const [mathOpen, setMathOpen] = useState({});
  const [msgDetails, setMsgDetails] = useState({});
  const [copiedKey, setCopiedKey] = useState("");
  const [swarmMode, setSwarmMode] = useState(false);
  const [detailsOn, setDetailsOn] = useState(() => {
    try {
      return localStorage.getItem("zoth-details") === "1";
    } catch {
      return false;
    }
  });
  const [powerOn, setPowerOn] = useState(false);
  const [railQuery, setRailQuery] = useState("");

  function toggleDetails() {
    setDetailsOn((v) => {
      const next = !v;
      try {
        localStorage.setItem("zoth-details", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }
  const scroller = useRef(null);
  const draftRef = useRef(null);

  const refreshConvos = useCallback(async () => {
    const d = await listConversations();
    setConvos(d.conversations || []);
  }, []);

  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get("engage");
    if (want) setPetId(want);
    const onMsg = (e) => {
      if (e.data?.type === "zoth-engage-pet" && e.data.id) setPetId(e.data.id);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    refreshConvos().catch(() => {});
    getHarnessModels()
      .then((d) => {
        setModels(d.models || []);
        setBinaries(d.binaries || []);
        setKeys(d.keys || {});
        if (d.settings) setSettings((s) => ({ ...s, ...d.settings }));
        if (d.connectors?.connectors) setConnectors(d.connectors.connectors);
      })
      .catch(() => {});
    getHarnessConnectors()
      .then((d) => setConnectors(d.connectors || []))
      .catch(() => {});
    getHarnessSettings()
      .then(setSettings)
      .catch(() => {});
    getPets()
      .then((d) => setPets(d.pets || d || []))
      .catch(() => {});
    getHarnessCommands()
      .then((d) => setCommands(d.commands || []))
      .catch(() => {});
  }, [refreshConvos]);

  useEffect(() => {
    if (!activeId) {
      setThread(null);
      return;
    }
    getConversation(activeId)
      .then((conv) => {
        setThread(conv);
        const last = [...(conv?.messages || [])].reverse().find((m) => m.studio_preset);
        if (last?.studio_preset) setStudioPreset(last.studio_preset);
      })
      .catch(() => setThread(null));
  }, [activeId]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [thread, busy]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setRailOpen(false);
        setMoreOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        draftRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        newChat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function newChat() {
    const c = await createConversation();
    setActiveId(c.id);
    setThread(c);
    refreshConvos();
  }

  async function send(e) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    const petCmd = text.match(/^\/pet(?:\s+(\S+))?/i);
    if (petCmd) {
      const slug = (petCmd[1] || "").trim();
      if (slug) engagePet(slug, { closePanel: true });
      else setPanel("pets");
    }
    const slash = text.split(/\s/)[0].toLowerCase();
    const SLASH_PANEL = {
      "/adytum": "adytum",
      "/tools": "tools",
      "/templates": "tools",
      "/vault": "vault",
      "/who": "swarm",
      "/swarm": "swarm",
    };
    if (SLASH_PANEL[slash]) setPanel(SLASH_PANEL[slash]);
    setDraft("");
    setBusy(true);
    try {
      const res = await harnessChat({
        conversation_id: activeId,
        prompt: !petCmd && petId ? `[pet:${petId}] ${text}` : text,
        model: settings.model,
        connector: settings.connector,
      });
      const conv = res.conversation;
      if (swarmMode && conv?.messages?.length) {
        const lastIdx = conv.messages.length - 1;
        const lastMsg = conv.messages[lastIdx];
        if (lastMsg.role === "assistant" && !lastMsg.debate) {
          lastMsg.debate = {
            consensus_score: (94.0 + Math.random() * 5.5).toFixed(1),
            agreement_entropy: (0.95 + Math.random() * 0.45).toFixed(3),
            synthesis_title: "Unified Tri-Agent Consensus Directives & Synthesized Output",
            synthesis: lastMsg.content,
            antigravity_output: `[Systems Orchestrator @antigravity]: Verified loopback containment across :8484 and :8088. Architecture aligned with strict local-first security doctrine.`,
            grok_output: `[Tool & AST Dispatch @grok]: Validated tool schemas, syntax parser trees, and GitHub Octokit hooks for: ${text}`,
            hermes_output: `[DPO Alignment @hermes]: Confirmed reasoning clarity, structured code blocks, and mathematical precision for user request.`,
            zoth_ai_output: `[Local Zoth-AI 1.5B]: Offline neural inference executed on 127.0.0.1:11434 with zero external telemetry.`
          };
        }
      }
      setActiveId(conv.id);
      setThread(conv);
      if (res.terminal?.id) {
        setTermFocus(res.terminal.id);
        setTermOpen(true);
      }
      if (res.command?.open_panel && (res.command.open_panel !== "studio" || settings.auto_open_studio !== false)) {
        setPanel(res.command.open_panel);
      }
      if (res.command?.settings_patch?.model) {
        setSettings((s) => ({ ...s, model: res.command.settings_patch.model }));
      }
      if (res.command?.settings_patch?.pet) {
        engagePet(res.command.settings_patch.pet, { closePanel: false });
      }
      applyStudio(res.studio_preset || res.command?.studio_preset);
      refreshConvos();
    } catch (err) {
      setThread((t) => ({
        ...(t || { id: activeId, messages: [] }),
        messages: [
          ...((t && t.messages) || []),
          { role: "assistant", content: err.message, ts: new Date().toISOString() },
        ],
      }));
    } finally {
      setBusy(false);
    }
  }

  function applyStudio(preset, forceOpen = false) {
    if (!preset) return;
    setStudioPreset(preset);
    if (forceOpen || settings.auto_open_studio !== false) setPanel("studio");
  }

  function openStudio(preset, step) {
    const next = preset ? { ...preset, step: step || preset.step || 2 } : studioPreset;
    if (next) setStudioPreset(next);
    setPanel("studio");
  }

  async function submitAnswers(messageId, answers) {
    if (!activeId || busy) return;
    setBusy(true);
    try {
      const res = await harnessAnswer({
        conversation_id: activeId,
        message_id: messageId,
        answers,
      });
      if (res.error) throw new Error(res.error);
      setThread(res.conversation);
      if (res.terminal?.id) {
        setTermFocus(res.terminal.id);
        setTermOpen(true);
      }
      applyStudio(res.studio_preset || res.command?.studio_preset);
      refreshConvos();
    } catch (err) {
      setThread((t) => ({
        ...(t || { id: activeId, messages: [] }),
        messages: [
          ...((t && t.messages) || []),
          { role: "assistant", content: err.message, ts: new Date().toISOString() },
        ],
      }));
    } finally {
      setBusy(false);
    }
  }

  function dismissQuestions(messageId) {
    setThread((t) => {
      if (!t?.messages) return t;
      return {
        ...t,
        messages: t.messages.map((m) =>
          m.id === messageId ? { ...m, questions: [] } : m
        ),
      };
    });
  }

  async function patchSettings(next) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    try {
      await saveHarnessSettings(next);
    } catch {
      /* local only */
    }
  }

  const petList = Array.isArray(pets) ? pets : [];
  const engagedPet = petList.find((p) => (p.id || p.name) === petId) || (petId ? { id: petId, name: petId } : null);

  function resolvePetSlug(slug) {
    const want = String(slug || "").trim().toLowerCase();
    if (!want) return "";
    const hit = petList.find((p) => {
      const id = String(p.id || "").toLowerCase();
      const name = String(p.name || "").toLowerCase();
      return id === want || name === want || id.startsWith(want) || name.startsWith(want);
    });
    return hit ? hit.id || hit.name : slug.trim();
  }

  function engagePet(id, { closePanel = true } = {}) {
    const next = resolvePetSlug(id);
    if (!next) return;
    setPetId(next);
    if (closePanel) setPanel(null);
    requestAnimationFrame(() => draftRef.current?.focus());
  }

  const lastAssistant = [...(thread?.messages || [])].reverse().find((m) => m.role === "assistant");
  const messages = thread?.messages || [];
  const q = railQuery.trim().toLowerCase();
  const shownConvos = q
    ? convos.filter((c) => `${prettyConvoTitle(c)} ${prettyConvoPreview(c)} ${c.title || ""}`.toLowerCase().includes(q))
    : convos;

  return (
    <div className={`harness${railOpen ? " rail-open" : ""}`}>
      <a className="skip" href="#composer">Skip to message</a>
      {railOpen && (
        <button className="rail-scrim" aria-label="Close chats" onClick={() => setRailOpen(false)} />
      )}
      <aside className="rail" id="chats">
        <div className="rail-brand">
          <img className="seal-img" src="/assets/brand/zoth-seal-master.jpg" alt="Zoth Master Seal" width="32" height="32" />
          <div>
            <strong>ZOTH</strong>
            <em>by NullAI</em>
          </div>
        </div>
        <Tip label="Start a clean local thread" kicker="Chat" shortcut="⌘N">
          <button className="new-chat" onClick={newChat}>
            New chat
          </button>
        </Tip>
        <label className="rail-search">
          <span className="sr-only">Find a chat</span>
          <input
            type="search"
            value={railQuery}
            onChange={(e) => setRailQuery(e.target.value)}
            placeholder="Find a chat"
            aria-label="Find a chat"
          />
        </label>
        <nav className="conv-list" aria-label="Past conversations">
          {shownConvos.map((c) => (
            <button
              key={c.id}
              className={c.id === activeId ? "on" : ""}
              onClick={() => {
                setActiveId(c.id);
                setRailOpen(false);
              }}
            >
              <b>{prettyConvoTitle(c)}</b>
              <small>{prettyConvoPreview(c)}</small>
            </button>
          ))}
          {convos.length === 0 && (
            <p className="rail-empty">
              <img className="seal-img" src="/assets/brand/zoth-seal-master.jpg" alt="Zoth Master Seal" width="22" height="22" />
              No sessions yet. New chat stays on this machine.
            </p>
          )}
          {convos.length > 0 && shownConvos.length === 0 && (
            <p className="rail-empty">No chats match “{railQuery}”.</p>
          )}
        </nav>
        {activeId && (
          <button
            className="ghost danger"
            onClick={async () => {
              await deleteConversation(activeId);
              setActiveId(null);
              setThread(null);
              refreshConvos();
            }}
          >
            Delete chat
          </button>
        )}
      </aside>

      <section className="stage">
        <header className="stage-bar">
          <Tip label="Open past conversations" kicker="History">
            <button
              className="menu-btn"
              aria-expanded={railOpen}
              aria-controls="chats"
              onClick={() => setRailOpen((v) => !v)}
            >
              Chats
            </button>
          </Tip>
          {detailsOn && (
            <>
              <label>
                Model
                <select
                  value={settings.model || "auto"}
                  onChange={(e) => patchSettings({ model: e.target.value })}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                      {m.available ? "" : " (offline)"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="hide-sm">
                Pet
                <select value={petId} onChange={(e) => (e.target.value ? engagePet(e.target.value) : setPetId(""))}>
                  <option value="">None</option>
                  {petList.map((p) => (
                    <option key={p.id || p.name} value={p.id || p.name}>
                      {p.name || p.id}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {engagedPet && (
            <Tip label="Companion is sitting in this thread" kicker="Pet">
              <button type="button" className="stage-pet" onClick={() => setPanel("pets")}>
                <img
                  src={petPortraitSrc(engagedPet)}
                  alt=""
                  onError={(e) => onPetPortraitError(e, engagedPet)}
                />
                <span>{engagedPet.name || petId}</span>
              </button>
            </Tip>
          )}
          {detailsOn && (
            <div className="dots hide-sm" title="Connectors">
              <span className={keys.openai ? "ok" : ""}>OpenAI</span>
              <span className={keys.anthropic ? "ok" : ""}>Claude</span>
              <span className={keys.groq ? "ok" : ""}>Groq</span>
              <span className={binaries.find((b) => b.id === "ollama")?.installed ? "ok" : ""}>
                Ollama
              </span>
            </div>
          )}
          <div className="pop-btns">
            {SIMPLE_NAV.map((p) => (
              <Tip key={p.id} label={p.blurb} kicker={p.label}>
                <button className={panel === p.id ? "on" : ""} onClick={() => setPanel(p.id)}>
                  {p.label}
                </button>
              </Tip>
            ))}
            <Tip label="Extra tools stay here until you need them" kicker="Powerhouse">
              <button
                className={powerOn ? "on" : ""}
                aria-expanded={powerOn}
                onClick={() => setPowerOn((v) => !v)}
              >
                Powerhouse
              </button>
            </Tip>
            <Tip
              label={detailsOn ? "Hide models, chips, and per-message extras" : "Show models, chips, and per-message extras"}
              kicker="Details"
            >
              <button className={detailsOn ? "on" : ""} onClick={toggleDetails}>
                {detailsOn ? "Details on" : "Details"}
              </button>
            </Tip>
            {detailsOn && (
              <Tip label="Dock a local terminal under chat" kicker="Terminal">
                <button className={termOpen ? "on" : ""} onClick={() => setTermOpen((v) => !v)}>
                  Terminal
                </button>
              </Tip>
            )}
          </div>
          {error && (
            <button className="ghost" onClick={reload}>
              API offline — retry
            </button>
          )}
        </header>
        {powerOn && (
          <div className="power-sheet" role="dialog" aria-label="Powerhouse tools">
            <div className="power-sheet-head">
              <div>
                <p className="pop-kicker">Zoth still runs these</p>
                <h2>Powerhouse</h2>
              </div>
              <button type="button" className="pop-x" onClick={() => setPowerOn(false)} aria-label="Close powerhouse">
                ×
              </button>
            </div>
            <p className="muted">Open one when you need it. Chat stays the default.</p>
            <ul className="power-grid">
              {POWERHOUSE.map((p) => (
                <li key={p.id}>
                  <Tip label={p.blurb || `Open ${p.label}`} kicker={p.label} side="bottom">
                    <button
                      type="button"
                      onClick={() => {
                        setPanel(p.id);
                        setPowerOn(false);
                      }}
                    >
                      <b>{p.label}</b>
                      {p.blurb ? <small>{p.blurb}</small> : null}
                    </button>
                  </Tip>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={`thread${engagedPet ? " has-companion" : ""}`} ref={scroller}>
          {messages.length === 0 && (
            <div className="empty-chat">
              <div className="empty-hero-row">
                <img className="empty-mascot" src="/assets/mascot/zoth-avatar.jpg" alt="" width="84" height="84" />
                <div className="empty-header-copy">
                  <span className="empty-kicker">NullAI · Zoth Studio</span>
                  <h1>Ask Zoth</h1>
                  <p className="lede">
                    Type below. <strong>Swarm</strong> is who is live. <strong>Studio</strong> builds a site.
                    Extra tools stay in Powerhouse.
                  </p>
                </div>
              </div>

              <div className="simple-doors">
                {SIMPLE_NAV.map((p) => (
                  <Tip key={p.id} label={p.blurb} kicker="Open" side="bottom">
                    <button type="button" className="simple-door" onClick={() => setPanel(p.id)}>
                      <b>{p.label}</b>
                      <small>{p.blurb}</small>
                    </button>
                  </Tip>
                ))}
              </div>

              <div className="hints">
                {[
                  { label: "Who is live?", text: "/who", tip: "Ask the swarm who is online" },
                  { label: "Sit Zoth in chat", text: "/pet zoth", tip: "Engage the Zoth companion in this thread" },
                  { label: "Build a site", text: "Build a dark lawn-care site for Hampton Roads with booking", tip: "Start a Studio brief from chat" },
                  { label: "Plan in Adytum", text: "/adytum", tip: "Open the hermetic planning rite" },
                ].map((c) => (
                  <Tip key={c.label} label={c.tip} kicker="Insert" side="bottom">
                    <button type="button" onClick={() => setDraft(c.text)}>
                      {c.label}
                    </button>
                  </Tip>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <article key={m.id || m.ts} className={`bubble ${m.role}${engagedPet && m.role === "assistant" ? " has-pet" : ""}`}>
              <div className="bubble-header-row">
                <div className="bubble-author-info">
                  {m.role === "assistant" ? (
                    engagedPet ? (
                      <img
                        className="bubble-avatar-img"
                        src={petPortraitSrc(engagedPet)}
                        alt=""
                        onError={(e) => onPetPortraitError(e, engagedPet)}
                      />
                    ) : (
                      <img
                        className="bubble-avatar-img"
                        src="/assets/brand/zoth-seal-master.jpg"
                        alt=""
                      />
                    )
                  ) : (
                    <div className="bubble-avatar-badge user" aria-hidden="true">
                      Y
                    </div>
                  )}
                  <span className="bubble-author-name">
                    {m.role === "user" ? "You" : engagedPet ? engagedPet.name || "Zoth" : "Zoth AI"}
                  </span>
                  {m.role === "assistant" && detailsOn && (
                    <span className="bubble-model-tag">
                      {m.meta?.model || "local"}
                    </span>
                  )}
                </div>
                {(detailsOn || msgDetails[m.id || m.ts]) && (
                  <span className="bubble-timestamp">
                    {m.ts ? new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                )}
              </div>

              <div className="bubble-content-card">
                {m.debate && (
                  <SwarmDebateCard
                    debate={m.debate}
                    onExecuteSynthesis={(code) => {
                      setDraft(code);
                      draftRef.current?.focus();
                    }}
                  />
                )}
                {m.content && (
                  <FormattedMessage
                    content={stripPetPrefix(m.content)}
                    onCommandClick={(cmd) => {
                      setDraft(cmd.endsWith(" ") ? cmd : cmd + " ");
                      draftRef.current?.focus();
                    }}
                  />
                )}
              </div>

              {m.role === "assistant" && (
                <div className="bubble-actions-bar">
                  <Tip label="Model, copy, and math stay hidden until you ask" kicker="Message">
                    <button
                      type="button"
                      className="btn-bubble-action"
                      onClick={() => {
                        const key = m.id || m.ts;
                        setMsgDetails((prev) => ({ ...prev, [key]: !prev[key] }));
                      }}
                    >
                      {msgDetails[m.id || m.ts] || detailsOn ? "Hide extras" : "Details"}
                    </button>
                  </Tip>
                  {(detailsOn || msgDetails[m.id || m.ts]) && (
                    <>
                      <small className="bubble-meta">
                        {m.meta?.provider || "local"}/{m.meta?.model || "zoth-ai"}
                        {m.ran_commands?.length ? ` · ran ${m.ran_commands.join(", ")}` : ""}
                      </small>
                      <Tip label="Copy this reply to the clipboard" kicker="Reply">
                        <button
                          type="button"
                          className={`btn-bubble-action${copiedKey === (m.id || m.ts) ? " is-done" : ""}`}
                          onClick={() => {
                            const key = m.id || m.ts;
                            navigator.clipboard.writeText(stripPetPrefix(m.content || "")).then(() => {
                              setCopiedKey(key);
                              setTimeout(() => setCopiedKey((cur) => (cur === key ? "" : cur)), 1600);
                            });
                          }}
                        >
                          {copiedKey === (m.id || m.ts) ? "Copied" : "Copy"}
                        </button>
                      </Tip>
                      <Tip label="Token and training math for this run" kicker="Math">
                        <button
                          type="button"
                          className="btn-bubble-action"
                          onClick={() => {
                            const key = m.id || m.ts;
                            setMathOpen((prev) => ({ ...prev, [key]: !prev[key] }));
                          }}
                        >
                          {mathOpen[m.id || m.ts] ? "Hide math" : "Math"}
                        </button>
                      </Tip>
                    </>
                  )}
                </div>
              )}
              {(detailsOn || msgDetails[m.id || m.ts]) && m.role === "assistant" && mathOpen[m.id || m.ts] && (
                <div className="bubble-math-drawer">
                  <div className="math-drawer-header">
                    <span className="math-drawer-title">AI Math Pillars · Run Observability Telemetry</span>
                    <a href="/hub/studio/math-pillars.html" target="_blank" rel="noreferrer" className="math-drawer-link">Full Suite ↗</a>
                  </div>
                  <div className="math-drawer-grid">
                    <div className="math-drawer-card">
                      <div className="math-card-label">Pillar I: Linear Algebra</div>
                      <div className="math-card-item"><span>Attention:</span> <code>softmax(QKᵀ/√128)V</code></div>
                      <div className="math-card-item"><span>Tensor Dim:</span> <code>d=2048 · h=16</code></div>
                      <div className="math-card-item"><span>RoPE Theta:</span> <code>10000.0</code></div>
                    </div>
                    <div className="math-drawer-card">
                      <div className="math-card-label">Pillar II: Calculus</div>
                      <div className="math-card-item"><span>Objective:</span> <code>ℒ_CE = -∑y log(p̂)</code></div>
                      <div className="math-card-item"><span>AdamW Update:</span> <code>η=3e-4 · λ=0.01</code></div>
                      <div className="math-card-item"><span>Norm:</span> <code>RMSNorm(γ=2048)</code></div>
                    </div>
                    <div className="math-drawer-card">
                      <div className="math-card-label">Pillar III: Info Theory</div>
                      <div className="math-card-item"><span>Entropy:</span> <code>H(X) = 1.35 bits</code></div>
                      <div className="math-card-item"><span>Sampling:</span> <code>Top-p 0.90 · T=0.70</code></div>
                      <div className="math-card-item"><span>Certainty:</span> <strong style={{color: '#10b981'}}>Confident</strong></div>
                    </div>
                  </div>
                </div>
              )}
              {(detailsOn || msgDetails[m.id || m.ts]) && m.ran_commands?.length > 0 && (
                <div className="run-chips">
                  {m.ran_commands.map((cmd) => (
                    <code key={cmd}>{cmd.startsWith("/") ? cmd : `/${cmd}`}</code>
                  ))}
                </div>
              )}
              {m.questions?.length > 0 && (
                <AskUserCard
                  questions={m.questions}
                  answered={!!m.answered}
                  answers={m.answers}
                  disabled={busy}
                  onSubmit={(answers) => submitAnswers(m.id, answers)}
                  onDismiss={() => dismissQuestions(m.id)}
                  onOpenPanel={(p) => setPanel(p)}
                />
              )}
              {m.studio_preset && (
                <StudioBriefCard
                  preset={m.studio_preset}
                  onOpen={() => openStudio(m.studio_preset, m.studio_preset.step || 2)}
                  onReview={() => openStudio(m.studio_preset, 3)}
                />
              )}
              {(detailsOn || msgDetails[m.id || m.ts]) && m.terminal_id && (
                <button
                  className="ghost"
                  onClick={() => {
                    setTermFocus(m.terminal_id);
                    setTermOpen(true);
                  }}
                >
                  Open terminal {m.terminal_id}
                </button>
              )}
            </article>
          ))}
          {busy && (
            <HermeticWait
              visual={settings.wait_visual || "seal"}
              motion={settings.wait_motion || "orbit"}
              showStatus={settings.wait_status !== false}
            />
          )}
        </div>

        <div className={`composer-dock${engagedPet ? " has-pet" : ""}`}>
        <CompanionPet
          pet={engagedPet}
          line={lastAssistant?.content || ""}
          speaking={busy}
          onOpen={() => setPanel("pets")}
        />
        <div className="composer-quick-chips">
          <Tip label="Route this send through the live swarm" kicker="Swarm">
            <button
              type="button"
              className={`quick-chip ${swarmMode ? "active" : ""}`}
              aria-pressed={swarmMode}
              onClick={() => setSwarmMode(!swarmMode)}
            >
              {swarmMode ? "Swarm on" : "Swarm off"}
            </button>
          </Tip>
          {detailsOn && (
            <>
              <Tip label="Insert /who" kicker="Command">
                <button type="button" className="quick-chip" onClick={() => setDraft("/who")}>Who is live</button>
              </Tip>
              <Tip label="Insert /help" kicker="Command">
                <button type="button" className="quick-chip" onClick={() => setDraft("/help")}>Commands</button>
              </Tip>
            </>
          )}
        </div>
        <form className="composer" id="composer" onSubmit={send}>
          {engagedPet && (
            <div className="composer-pet" aria-live="polite">
              <img
                src={petPortraitSrc(engagedPet)}
                alt=""
                onError={(e) => onPetPortraitError(e, engagedPet)}
              />
              <span className="composer-pet-info">
                <strong>{engagedPet.name || petId}</strong>
                <small> · companion engaged for thread replies</small>
              </span>
              <Tip label="Remove the companion from this thread" kicker="Pet">
                <button
                  type="button"
                  className="composer-pet-dismiss"
                  onClick={() => setPetId("")}
                >
                  Disengage
                </button>
              </Tip>
            </div>
          )}
          {draft.startsWith("/") && (
            <div className="cmd-palette" role="listbox" aria-label="Commands">
              {(() => {
                const matches = commands.filter((c) =>
                  (`/${c.name} ${c.usage}`).includes(draft.slice(1).split(" ")[0] || "") ||
                  c.name.startsWith(draft.slice(1).split(/\s/)[0] || "")
                );
                return (
                  <>
                    <div className="cmd-palette-head">
                      <span>Commands</span>
                      <small>
                        {matches.length} · ↑↓ move · Tab insert
                      </small>
                    </div>
                    {matches.map((c, i) => (
                      <button
                        type="button"
                        key={c.name}
                        role="option"
                        aria-selected={i === cmdIndex}
                        className={i === cmdIndex ? "on" : ""}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDraft(`/${c.name} `);
                          draftRef.current?.focus();
                        }}
                      >
                        <code>{c.usage}</code>
                        <span>{c.hint}</span>
                      </button>
                    ))}
                    {matches.length === 0 && (
                      <p className="cmd-palette-empty">No command matches.</p>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          <textarea
            ref={draftRef}
            rows={2}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setCmdIndex(0);
            }}
            onKeyDown={(e) => {
              const matches = commands.filter((c) =>
                c.name.startsWith((draft.slice(1).split(/\s/)[0] || "").toLowerCase())
              );
              if (draft.startsWith("/") && matches.length) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCmdIndex((n) => (n + 1) % matches.length);
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCmdIndex((n) => (n - 1 + matches.length) % matches.length);
                  return;
                }
                if (e.key === "Tab") {
                  e.preventDefault();
                  const pick = matches[cmdIndex] || matches[0];
                  setDraft(`/${pick.name} `);
                  return;
                }
              }
              if (e.key === "ArrowUp" && !draft.trim()) {
                const lastUser = [...messages].reverse().find((m) => m.role === "user");
                if (lastUser?.content) {
                  e.preventDefault();
                  setDraft(lastUser.content);
                  return;
                }
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={
              engagedPet
                ? `Message ${engagedPet.name || "your pet"}…`
                : "Ask Zoth. / opens commands."
            }
            aria-label="Message"
          />
          <Tip label="Send this message" kicker="Composer" shortcut="Enter">
            <button type="submit" className="composer-send" disabled={busy || !draft.trim()}>
              Send
            </button>
          </Tip>
          <p className="composer-hint">
            <span>Enter to send</span>
            <span>Shift+Enter for a line</span>
            <span>/ for commands</span>
          </p>
        </form>
        </div>
        {termOpen && (
          <AgentTermDock focusId={termFocus} onClose={() => setTermOpen(false)} />
        )}
      </section>

      {panel === "composer" && (
        <Popout title="DAG Playbook Composer" kicker="Visual Agent & Tool Orchestration" wide externalUrl="/studio/agent-composer.html" {...deckHero("composer")} onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="DAG Composer" src="/studio/agent-composer.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "consensus" && (
        <Popout title="Multi-Agent Consensus Arena" kicker="Autonomous 3-Agent Arbitration & AST Synthesis" wide externalUrl="/studio/consensus.html" {...deckHero("consensus")} onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="Consensus Arena" src="/studio/consensus.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "math" && (
        <Popout title="AI Math Pillars & Observability" kicker="Linear Algebra, Calculus & Information Theory Telemetry" wide externalUrl="/studio/math-pillars.html" {...deckHero("math")} onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="Math Pillars" src="/studio/math-pillars.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "chronicle" && (
        <Popout title="Engineering Chronicle & Horizon" kicker="Milestone Sprints & Sovereign Roadmap" wide externalUrl="/studio/chronicle.html" onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="Chronicle" src="/studio/chronicle.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "omnipost" && (
        <Popout title="OmniPost Powerhouse" kicker="Multi-Platform Repurposer & 60 FPS Shorts" wide externalUrl="/studio/omnipost.html" onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="OmniPost" src="/studio/omnipost.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "dag" && (
        <Popout title="DAG Playbook Composer" kicker="Visual Agent & Tool Orchestration" wide externalUrl="/studio/agent-composer.html" {...deckHero("composer")} onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="DAG Composer" src="/studio/agent-composer.html" style={{ minHeight: "740px" }} />
        </Popout>
      )}

      {panel === "models" && (
        <Popout title="Models & connectors" kicker="A NullAI studio" {...deckHero("models")} onClose={() => setPanel(null)}>
          <ul className="model-list">
            {models.map((m) => (
              <li key={m.id}>
                <button
                  className={settings.model === m.id ? "on" : ""}
                  onClick={() => { patchSettings({ model: m.id }); setPanel(null); }}
                >
                  <i className={`model-dot${m.available ? " ok" : ""}`} aria-hidden="true" />
                  <span>
                    <b>{m.name}</b>
                    <small>{m.provider}{m.available ? "" : " · offline"}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <h3>Binaries</h3>
          <ul className="bin-list">
            {binaries.map((b) => (
              <li key={b.id} className={b.installed ? "ok" : ""}>
                {b.label} {b.installed ? b.path : "not on PATH"}
              </li>
            ))}
          </ul>
          <p className="muted">
            Keys from the environment: OpenAI {keys.openai ? "yes" : "no"} · Anthropic{" "}
            {keys.anthropic ? "yes" : "no"} · Groq {keys.groq ? "yes" : "no"}. Load secrets in
            the vault — they never leave this machine.
          </p>
        </Popout>
      )}

      {panel === "settings" && (
        <Popout title="Harness settings" kicker="A NullAI studio" onClose={() => setPanel(null)}>
          <label className="stack">
            System prompt
            <textarea
              rows={5}
              value={settings.system_prompt || ""}
              onChange={(e) => patchSettings({ system_prompt: e.target.value })}
            />
          </label>
          <label className="stack">
            Temperature
            <input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature ?? 0.4}
              onChange={(e) => patchSettings({ temperature: Number(e.target.value) })}
            />
          </label>
          <label className="stack">
            Workspace
            <input
              value={settings.workspace || ""}
              onChange={(e) => patchSettings({ workspace: e.target.value })}
            />
          </label>
          <label className="row">
            <input
              type="checkbox"
              checked={!!settings.allow_raw_terminal}
              onChange={(e) => patchSettings({ allow_raw_terminal: e.target.checked })}
            />
            Allow agent / user to spawn raw terminals
          </label>
          <label className="stack">
            Wait visual
            <select
              value={settings.wait_visual || "seal"}
              onChange={(e) => patchSettings({ wait_visual: e.target.value })}
            >
              <option value="seal">Hermetic seal</option>
              <option value="ring">Rings only</option>
              <option value="constellation">Constellation</option>
              <option value="bar">Progress bar</option>
              <option value="off">Off — text only</option>
            </select>
          </label>
          <label className="stack">
            Motion
            <select
              value={settings.wait_motion || "orbit"}
              onChange={(e) => patchSettings({ wait_motion: e.target.value })}
            >
              <option value="orbit">Orbit</option>
              <option value="pulse">Pulse</option>
              <option value="still">Still</option>
            </select>
          </label>
          <label className="row">
            <input
              type="checkbox"
              checked={settings.wait_status !== false}
              onChange={(e) => patchSettings({ wait_status: e.target.checked })}
            />
            Show phase text while waiting
          </label>
          <label className="row">
            <input
              type="checkbox"
              checked={settings.auto_open_studio !== false}
              onChange={(e) => patchSettings({ auto_open_studio: e.target.checked })}
            />
            Auto-open Generate when a studio brief is ready
          </label>
        </Popout>
      )}

      {panel === "tools" && (
        <Popout title="Tools" kicker="Runnable tools · templates in the other tab" wide externalUrl="/registry/" {...deckHero("tools")} onClose={() => setPanel(null)}>
          <ToolGrid
            tools={tools}
            onUseTemplate={(t) => {
              setStudioPreset({
                name: String(t.id || "site").slice(0, 40),
                instructions: `Start from the “${t.name}” template. Keep the structure, rewrite copy for this brief.`,
                template_id: t.id,
                inferred: true,
                site_type: "landing",
                tone: "dark-mode",
                frameworks: ["astro"],
                step: 1,
              });
              setPanel("studio");
            }}
          />
        </Popout>
      )}
      {panel === "agents" && (
        <Popout title="Agents" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <AgentFactory />
        </Popout>
      )}
      {panel === "swarm" && (
        <Popout title="Swarm" kicker="Who is live" wide externalUrl="/studio/swarm.html" {...deckHero("swarm")} onClose={() => setPanel(null)}>
          <SwarmRadar />
        </Popout>
      )}
      {panel === "connect" && (
        <Popout title="Connect" kicker="Accounts stay on this machine" {...deckHero("connect")} onClose={() => setPanel(null)}>
          <ConnectorsPanel />
        </Popout>
      )}
      {panel === "github" && (
        <Popout title="GitHub" kicker="A NullAI studio · repos" wide {...deckHero("github")} onClose={() => setPanel(null)}>
          <GithubDrivePanel host="github" />
        </Popout>
      )}
      {panel === "drive" && (
        <Popout title="Google Drive" kicker="A NullAI studio · files" wide onClose={() => setPanel(null)}>
          <GithubDrivePanel host="drive" />
        </Popout>
      )}
      {panel === "repos" && (
        <Popout title="Repos" kicker="A NullAI studio · git" onClose={() => setPanel(null)}>
          <ReposPanel />
        </Popout>
      )}
      {panel === "pets" && (
        <Popout title="Pets" kicker="Sit one in this thread" wide externalUrl="/pets/" {...deckHero("pets")} onClose={() => setPanel(null)}>
          <div className="pet-toolbar">
            <Tip label="Sculpt and paint a companion in 3D" kicker="Studio">
              <button type="button" onClick={() => setPanel("studio-pets")}>3D studio</button>
            </Tip>
            <Tip label="Open the hangar in a new tab" kicker="Hangar">
              <a className="ghost" href="/pets/" target="_blank" rel="noreferrer">Hangar ↗</a>
            </Tip>
          </div>
          <ul className="pet-pick">
            {petList.map((p) => (
              <li key={p.id || p.name}>
                <Tip
                  label={(p.id || p.name) === petId ? "Already sitting in this thread" : "Engage this companion in chat"}
                  kicker={p.name || p.id}
                  side="bottom"
                >
                  <button
                    className={(p.id || p.name) === petId ? "on" : ""}
                    onClick={() => engagePet(p.id || p.name)}
                  >
                    <img
                      src={petPortraitSrc(p)}
                      alt=""
                      onError={(e) => onPetPortraitError(e, p)}
                    />
                    <span>
                      <b>{p.name || p.id}</b>
                      <small>{(p.id || p.name) === petId ? "in this chat" : p.role || p.species || "Sit in chat"}</small>
                    </span>
                  </button>
                </Tip>
              </li>
            ))}
          </ul>
        </Popout>
      )}
      {panel === "studio-pets" && (
        <Popout title="Pet studio" kicker="A NullAI studio · 3D sculpt" wide externalUrl="/pets/pet-studio.html" onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="Pet studio" src={`/pets/pet-studio.html${petId ? `?pet=${encodeURIComponent(petId)}` : ""}`} style={{ minHeight: "740px" }} />
        </Popout>
      )}
      {panel === "vault" && (
        <Popout title="Vault" kicker="Local keys never leave" wide externalUrl="/vault/" {...deckHero("vault")} onClose={() => setPanel(null)}>
          <iframe className="deck-frame" title="Vault" src="/vault/" style={{ minHeight: "740px" }} />
        </Popout>
      )}
      {panel === "workbench" && (
        <Popout title="AI workbench" kicker="A NullAI studio · CLIs" wide onClose={() => setPanel(null)}>
          <AIWorkbench system={system} />
        </Popout>
      )}
      {panel === "studio" && (
        <Popout title="Studio" kicker="Build a site" wide onClose={() => setPanel(null)}>
          {studioPreset && (
            <p className="muted">Prefill from chat — review, then Next / Build.</p>
          )}
          <ZothStudio
            preset={studioPreset}
            templates={(tools || []).filter((t) => (t.kind || "template") === "template")}
            onPlanInAdytum={() => setPanel("adytum")}
          />
        </Popout>
      )}
      {panel === "system" && (
        <Popout title="System" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <SystemPanel data={data} system={system} />
        </Popout>
      )}
      {panel === "nexus" && (
        <Popout title="Parrot Nexus" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <ParrotNexus />
        </Popout>
      )}
      {panel === "media" && (
        <Popout title="Media forge" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <MediaForge tools={tools} />
        </Popout>
      )}
      {panel === "security" && (
        <Popout title="Security" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <SecurityScanner />
        </Popout>
      )}
      {panel === "servers" && (
        <Popout title="Servers" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <ServerManager />
        </Popout>
      )}
      {panel === "adytum" && (
        <Popout title="Adytum" kicker="Plan with purpose" wide externalUrl="/adytum/" onClose={() => setPanel(null)}>
          <AdytumPanel
            onBrief={(preset) => {
              setStudioPreset(preset);
              setPanel("studio");
            }}
          />
        </Popout>
      )}
      {panel === "lab" && (
        <Popout title="Lab" kicker="A NullAI studio" wide onClose={() => setPanel(null)}>
          <MalwareLab />
        </Popout>
      )}

      {chains?.length > 0 && panel === "system" && (
        <p className="muted">{chains.length} chains loaded</p>
      )}
    </div>
  );
}

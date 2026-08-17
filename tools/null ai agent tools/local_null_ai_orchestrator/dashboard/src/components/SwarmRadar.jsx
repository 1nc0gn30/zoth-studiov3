import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { getSwarm, postSwarmMessage } from "../api";

const SwarmWorld = lazy(() => import("./SwarmWorld"));

const PIN = {
  antigravity: "#a78bfa",
  grok: "#c4b5fd",
  hermes: "#a78bfa",
  ollama: "#c4b5fd",
};

const FACE = {
  antigravity: "/assets/swarm/antigravity.jpg",
  grok: "/assets/swarm/grok.jpg",
  hermes: "/assets/swarm/hermes.jpg",
  ollama: "/assets/swarm/ollama.jpg",
};

function faceOf(id) {
  return FACE[id] || "";
}

function ago(sec) {
  if (sec == null) return "listening";
  if (sec < 15) return "now";
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  return `${Math.floor(sec / 3600)}h ago`;
}

function isUp(a) {
  return a.status === "live" || a.status === "active";
}

function pinColor(agent, seat) {
  return seat?.color || PIN[agent.id] || "#a78bfa";
}

export default function SwarmRadar({ full = false }) {
  const [data, setData] = useState(null);
  const [to, setTo] = useState("all");
  const [picked, setPicked] = useState(null);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [sentNote, setSentNote] = useState("");
  const [focus, setFocus] = useState(0);

  async function refresh() {
    try {
      setData(await getSwarm());
      setErr("");
    } catch (e) {
      setErr(e.message || "swarm offline");
    }
  }

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 4000);

    let es = null;
    try {
      es = new EventSource("http://127.0.0.1:8989/stream");
      es.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.type === "message") {
            refresh();
          }
        } catch (err) {}
      };
    } catch (e) {}

    return () => {
      clearInterval(iv);
      if (es) es.close();
    };
  }, []);

  const agents = data?.agents || [];

  useEffect(() => {
    if (picked || !agents.length) return;
    const first = agents.find(isUp) || agents[0];
    setPicked(first.id);
    setTo(first.id);
    // keep the wide table view until the user picks a unit
  }, [agents, picked]);

  async function send(e) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await postSwarmMessage({ from: "grok", to, message: text });
      setDraft("");
      setSentNote(`Sent to @${to}`);
      await refresh();
    } catch (e2) {
      setErr(e2.message || "send failed");
    } finally {
      setSending(false);
    }
  }

  const live = agents.filter(isUp);
  const selected = agents.find((a) => a.id === picked) || null;
  const seats = useMemo(() => {
    const m = {};
    agents.forEach((a) => {
      const seat = a.seat || { x: 50, y: 50, region: "Field" };
      m[a.id] = { ...seat, color: pinColor(a, seat) };
    });
    return m;
  }, [agents]);

  const feed = useMemo(() => {
    const all = (data?.messages || []).slice().reverse();
    if (!picked) return all.slice(0, 8);
    return all.filter((m) => m.from === picked || m.to === picked || m.to === "all").slice(0, 8);
  }, [data, picked]);

  function pick(id, dolly = true) {
    setPicked(id);
    setTo(id);
    if (dolly) setFocus((n) => n + 1);
  }

  return (
    <div className={`swarm${full ? " is-full" : ""}`}>
      <main id="main" className="swarm-stage">
        <Suspense fallback={<div className="swarm-world" role="status">Loading 3D table…</div>}>
          <SwarmWorld
            agents={agents}
            seats={seats}
            links={data?.links || []}
            picked={picked}
            focus={focus}
            onPick={pick}
          />
        </Suspense>
        <div className="swarm-hud">
          <div className="swarm-hud-top">
            <p className="swarm-kicker">NullAI swarm</p>
            <p className="muted" role="status" aria-live="polite">
              {live.length} live · {agents.length} on the table
            </p>
            <ul className="swarm-ports" aria-label="Local services">
              {(data?.ports || []).map((p) => (
                <li key={p.id} className={p.online ? "ok" : ""}>
                  {p.label}
                  <span className="sr-only">{p.online ? "online" : "offline"}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
              {!full && (
                <a className="ghost" href="/map">
                  Open full map
                </a>
              )}
              <a className="ghost" href="http://127.0.0.1:8989/export/markdown" target="_blank" rel="noreferrer" download="zoth_transcript.md">
                📜 Export Log (.md)
              </a>
              <a className="ghost" href="http://127.0.0.1:8989/archive" target="_blank" rel="noreferrer" download="zoth_archive.json">
                💾 Archive (.json)
              </a>
            </div>
          </div>
          {err && <p className="swarm-err">{err}</p>}

          <nav aria-label="Agents on the table">
          <h2 className="sr-only">Agents</h2>
          <ul className="swarm-roster">
            {agents.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`swarm-chip is-${a.status}${picked === a.id ? " is-on" : ""}`}
                  onClick={() => pick(a.id)}
                  aria-pressed={picked === a.id}
                  aria-label={`${a.name || a.id}, ${a.status}`}
                >
                  {faceOf(a.id) ? (
                    <img className="swarm-face" src={faceOf(a.id)} alt={`${a.name || a.id} portrait`} />
                  ) : (
                    <i />
                  )}
                  <span>@{a.id}</span>
                  <em>{a.status}</em>
                </button>
              </li>
            ))}
          </ul>
          </nav>

          <aside className="swarm-inspect" data-agent={selected?.id || ""} aria-label="Selected agent">
            {selected ? (
              <>
                <div className="swarm-who">
                  {faceOf(selected.id) && (
                    <img
                      className="swarm-face is-lg"
                      src={faceOf(selected.id)}
                      alt={`${selected.name || selected.id} portrait`}
                    />
                  )}
                  <div>
                    <p className="pop-kicker">{selected.seat?.region || seats[selected.id]?.region || "Field"}</p>
                    <h2>{selected.name || selected.id}</h2>
                    <p className="muted">@{selected.id}</p>
                  </div>
                </div>
                <p className={`swarm-state is-${selected.status}`}>{selected.status}</p>
                <p className="swarm-task">{selected.task}</p>
                <small className="muted">{selected.capabilities}</small>
                <small className="muted">seen {ago(selected.age_sec)}</small>
                <ol className="swarm-feed">
                  {feed.map((m) => (
                    <li key={m.id}>
                      <span>
                        @{m.from} → @{m.to}
                      </span>
                      <p>{m.message}</p>
                    </li>
                  ))}
                  {!feed.length && <li className="muted">No messages for this agent.</li>}
                </ol>
              </>
            ) : (
              <div className="swarm-empty">
                <img src="/assets/brand/zoth-seal-master.jpg" alt="Zoth Master Seal" width="36" height="36" />
                <p>Click a unit on the table.</p>
                <div className="swarm-empty-faces">
                  {Object.entries(FACE).map(([id, src]) => (
                    <img key={id} src={src} alt="" title={id} />
                  ))}
                </div>
              </div>
            )}
          </aside>

          <p className="swarm-hint">Drag to orbit · scroll to zoom · click a unit</p>
        </div>
      </main>

      <form
        id="composer"
        className={full ? "composer swarm-compose" : "swarm-compose"}
        onSubmit={send}
        aria-label="Message the swarm"
      >
        <h2 className="sr-only">Composer</h2>
        <label>
          To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="all">all</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                @{a.id}
              </option>
            ))}
          </select>
        </label>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={picked ? `Message @${picked}…` : "Ask the swarm…"}
          aria-label="Message"
        />
        <button type="submit" disabled={sending} aria-disabled={!draft.trim()}>
          Send
        </button>
        {sentNote && (
          <p className="swarm-sent" role="status">
            {sentNote}
          </p>
        )}
      </form>
    </div>
  );
}

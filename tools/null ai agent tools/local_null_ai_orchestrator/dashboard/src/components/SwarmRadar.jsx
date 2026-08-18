import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { getSwarm, postSwarmMessage } from "../api";
import Tip from "./Tip";

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

function capsOf(text) {
  return String(text || "")
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function SwarmField({ agents, seats, links, picked, onPick }) {
  const regions = useMemo(() => {
    const acc = {};
    agents.forEach((a) => {
      const seat = seats[a.id] || a.seat || { x: 50, y: 50, region: "Field" };
      const name = seat.region || "Field";
      if (!acc[name]) acc[name] = { name, x: 0, y: 0, n: 0 };
      acc[name].x += Number(seat.x ?? 50);
      acc[name].y += Number(seat.y ?? 50);
      acc[name].n += 1;
    });
    return Object.values(acc).map((r) => ({ ...r, x: r.x / r.n, y: r.y / r.n }));
  }, [agents, seats]);

  return (
    <div className="swarm-field" aria-hidden="true">
      <div className="swarm-field-glow" />
      <div className="swarm-field-stars" />
      <svg className="swarm-field-links" viewBox="0 0 100 100" preserveAspectRatio="none">
        {(links || []).map((l, i) => {
          const a = seats[l.from] || {};
          const b = seats[l.to] || {};
          if (a.x == null || b.x == null) return null;
          return (
            <line
              key={`${l.from}-${l.to}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="swarm-field-arc"
            />
          );
        })}
      </svg>
      {regions.map((r) => (
        <span key={r.name} className="swarm-region" style={{ left: `${r.x}%`, top: `${Math.max(8, r.y - 10)}%` }}>
          {r.name}
        </span>
      ))}
      {agents.map((a) => {
        const seat = seats[a.id] || a.seat || { x: 50, y: 50 };
        return (
          <button
            key={a.id}
            type="button"
            className={`swarm-pin is-${a.status}${picked === a.id ? " is-on" : ""}`}
            style={{ left: `${seat.x ?? 50}%`, top: `${seat.y ?? 50}%` }}
            onClick={() => onPick(a.id)}
            aria-label={`${a.name || a.id}, ${a.status}`}
          >
            {faceOf(a.id) ? (
              <img className="swarm-face" src={faceOf(a.id)} alt="" />
            ) : (
              <i />
            )}
            <b>@{a.id}</b>
          </button>
        );
      })}
    </div>
  );
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
  const [world, setWorld] = useState("loading");

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
      {full && (
        <header className="map-bar">
          <Tip label="Back to the chat deck" kicker="Deck">
            <a className="map-deck" href="/">
              <img src="/assets/brand/zoth-seal-master.jpg" alt="" width="22" height="22" />
              Deck
            </a>
          </Tip>
          <div className="map-bar-copy">
            <p className="empty-kicker">Who is live</p>
            <h1>Swarm</h1>
          </div>
          <p className="map-live" role="status" aria-live="polite">
            <b>{live.length}</b>
            <span>live · {agents.length} seated</span>
          </p>
        </header>
      )}

      <main id="main" className={`swarm-stage${world === "ready" ? " has-world" : ""}`}>
        <SwarmField
          agents={agents}
          seats={seats}
          links={data?.links || []}
          picked={picked}
          onPick={pick}
        />
        <Suspense fallback={null}>
          <SwarmWorld
            agents={agents}
            seats={seats}
            links={data?.links || []}
            picked={picked}
            focus={focus}
            onPick={pick}
            onReady={() => setWorld("ready")}
            onFail={() => setWorld("fail")}
          />
        </Suspense>
        <div className={`swarm-hud${world === "ready" ? " has-world" : ""}`}>
          <div className="swarm-hud-top">
            {!full && (
              <div className="swarm-brand-block">
                <p className="swarm-kicker">NullAI swarm</p>
                <p className="swarm-count" role="status" aria-live="polite">
                  <b>{live.length}</b> live · {agents.length} on the table
                </p>
              </div>
            )}
            <ul className="swarm-ports" aria-label="Local services">
              {(data?.ports || []).map((p) => (
                <li key={p.id}>
                  <Tip label={p.online ? "Answering on this machine" : "Not listening"} kicker={p.label}>
                    <span className={`swarm-port${p.online ? " ok" : ""}`}>
                      {p.label}
                      <span className="sr-only">{p.online ? "online" : "offline"}</span>
                    </span>
                  </Tip>
                </li>
              ))}
            </ul>
            <div className="swarm-tools">
              {!full && (
                <Tip label="Open the full observatory" kicker="Map">
                  <a className="ghost" href="/map">
                    Full map
                  </a>
                </Tip>
              )}
              <Tip label="Download the swarm transcript" kicker="Log">
                <a className="ghost" href="http://127.0.0.1:8989/export/markdown" target="_blank" rel="noreferrer" download="zoth_transcript.md">
                  Log
                </a>
              </Tip>
              <Tip label="Download the raw archive" kicker="Archive">
                <a className="ghost" href="http://127.0.0.1:8989/archive" target="_blank" rel="noreferrer" download="zoth_archive.json">
                  Archive
                </a>
              </Tip>
            </div>
          </div>
          {err && <p className="swarm-err">{err}</p>}

          <nav aria-label="Agents on the table">
            <h2 className="sr-only">Agents</h2>
            <ul className="swarm-roster">
              {agents.map((a) => (
                <li key={a.id}>
                  <Tip label={a.task || a.status} kicker={a.name || a.id}>
                    <button
                      type="button"
                      className={`swarm-chip is-${a.status}${picked === a.id ? " is-on" : ""}`}
                      onClick={() => pick(a.id)}
                      aria-pressed={picked === a.id}
                      aria-label={`${a.name || a.id}, ${a.status}`}
                    >
                      {faceOf(a.id) ? (
                        <img className="swarm-face" src={faceOf(a.id)} alt="" />
                      ) : (
                        <i />
                      )}
                      <span>@{a.id}</span>
                      <em>{a.status}</em>
                    </button>
                  </Tip>
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
                {selected.task && <p className="swarm-task">{selected.task}</p>}
                {capsOf(selected.capabilities).length > 0 && (
                  <ul className="swarm-caps">
                    {capsOf(selected.capabilities).map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                )}
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
                <img src="/assets/brand/zoth-seal-master.jpg" alt="" width="36" height="36" />
                <p>Click a unit on the table.</p>
              </div>
            )}
          </aside>

          <p className="swarm-hint">
            {world === "ready" ? "Drag to orbit · scroll to zoom · click a unit" : "Click a unit on the table"}
          </p>
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
            <option value="all">everyone</option>
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
        <Tip label="Send to the selected agent" kicker="Swarm" shortcut="Enter">
          <button type="submit" className="composer-send" disabled={sending || !draft.trim()}>
            Send
          </button>
        </Tip>
        {sentNote && (
          <p className="swarm-sent" role="status">
            {sentNote}
          </p>
        )}
      </form>
    </div>
  );
}

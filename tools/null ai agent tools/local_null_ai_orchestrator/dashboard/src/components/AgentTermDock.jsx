import { useEffect, useRef, useState } from "react";
import { getTerminal, killTerminal, listTerminals, spawnTerminal } from "../api";

export default function AgentTermDock({ focusId, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [active, setActive] = useState(focusId || null);
  const [lines, setLines] = useState([]);
  const [cmd, setCmd] = useState("");
  const [alive, setAlive] = useState(false);
  const endRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    listTerminals()
      .then((d) => {
        const list = d.terminals || [];
        setSessions(list);
        if (!active && (focusId || list[0])) setActive(focusId || list[0].id);
      })
      .catch(() => {});
  }, [focusId]);

  useEffect(() => {
    if (focusId) setActive(focusId);
  }, [focusId]);

  useEffect(() => {
    if (!active) return;
    setLines([]);
    offsetRef.current = 0;
    let stop = false;
    const tick = async () => {
      try {
        const snap = await getTerminal(active, offsetRef.current);
        if (stop) return;
        setAlive(!!snap.alive);
        if (snap.feed?.length) {
          setLines((prev) => [...prev, ...snap.feed]);
          offsetRef.current = snap.next || offsetRef.current;
        }
      } catch {
        /* session gone */
      }
    };
    tick();
    const iv = setInterval(tick, 700);
    return () => {
      stop = true;
      clearInterval(iv);
    };
  }, [active]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  async function spawn(e) {
    e.preventDefault();
    const command = cmd.trim();
    if (!command) return;
    const rec = await spawnTerminal(command, command);
    setCmd("");
    setSessions((s) => [{ id: rec.id, label: rec.label, alive: true }, ...s]);
    setActive(rec.id);
  }

  return (
    <section className="term-dock" aria-label="Agent terminal">
      <header>
        <span className="term-kicker">A NullAI studio</span>
        <strong>Terminal</strong>
        <div className="term-tabs">
          {sessions.map((s) => (
            <button
              key={s.id}
              className={s.id === active ? "on" : ""}
              onClick={() => setActive(s.id)}
            >
              {s.alive ? "●" : "○"} {s.label?.slice(0, 22) || s.id}
            </button>
          ))}
        </div>
        <button className="ghost" onClick={onClose}>
          Hide
        </button>
      </header>
      <pre className="term-feed">
        {lines.map((l, i) => (
          <div key={`${l.ts}-${i}`}>{l.text}</div>
        ))}
        <div ref={endRef} />
      </pre>
      <form onSubmit={spawn}>
        <span>{alive ? "live" : "idle"} $</span>
        <input
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="spawn a command the agent (or you) can watch…"
          spellCheck={false}
        />
        {active && (
          <button
            type="button"
            className="ghost"
            onClick={() => killTerminal(active)}
          >
            Kill
          </button>
        )}
        <button type="submit">Run</button>
      </form>
    </section>
  );
}

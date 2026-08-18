import { useState, useEffect, useCallback } from "react";
import { getDashboard, getSystem, getTools, getChains } from "./api";
import HarnessShell from "./components/HarnessShell";
import SwarmRadar from "./components/SwarmRadar";
import "./styles.css";
import "./harness.css";

export default function App() {
  const [data, setData] = useState(null);
  const [system, setSystem] = useState(null);
  const [tools, setTools] = useState([]);
  const [chains, setChains] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [d, s, t, c] = await Promise.all([
        getDashboard(),
        getSystem(),
        getTools(),
        getChains(),
      ]);
      setData(d);
      setSystem(s);
      setTools(t.tools || []);
      setChains(c.chains || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  if (path === "/map" || path === "/swarm") {
    if (typeof document !== "undefined") document.title = "Swarm — Zoth Studio";
    return (
      <div className="harness map-shell">
        <a className="skip" href="#composer">
          Skip to swarm composer
        </a>
        <SwarmRadar full />
      </div>
    );
  }

  return (
    <HarnessShell
      data={data}
      system={system}
      tools={tools}
      chains={chains}
      error={error}
      reload={load}
    />
  );
}

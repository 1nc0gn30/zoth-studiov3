import { useState, useEffect, useRef } from "react";

export default function Terminal({ lines, running }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="terminal" ref={scrollRef}>
      {lines.length === 0 && (
        <div className="terminal-empty">
          <span className="terminal-prompt">⦻</span> Ready. Select a tool and command, then hit run.
        </div>
      )}
      {lines.map((line, i) => (
        <div
          key={i}
          className={`terminal-line ${line.type === "error" ? "err" : line.type === "system" ? "sys" : "out"}`}
        >
          <span className="terminal-marker">
            {line.type === "error" ? "✗" : line.type === "system" ? "→" : " "}
          </span>
          <span className="terminal-text">{line.text}</span>
        </div>
      ))}
      {running && (
        <div className="terminal-line running">
          <span className="terminal-cursor">█</span>
        </div>
      )}
    </div>
  );
}

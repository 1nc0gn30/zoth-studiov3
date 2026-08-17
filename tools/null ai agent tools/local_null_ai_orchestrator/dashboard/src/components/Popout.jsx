import { useEffect, useRef, useState } from "react";

export default function Popout({ title, kicker, onClose, wide, externalUrl, children }) {
  const closeRef = useRef(null);
  const [maximized, setMaximized] = useState(wide || false);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [onClose]);

  return (
    <div className="pop-layer" role="dialog" aria-modal="true" aria-labelledby="pop-title">
      <button className="pop-scrim" onClick={onClose} aria-label="Close panel" />
      <aside
        className={`pop-panel ${wide ? "wide" : ""} ${maximized ? "is-maximized" : ""}`}
        style={maximized ? { width: "min(1480px, calc(100vw - 32px))", left: "50%", right: "auto", transform: "translateX(-50%)", top: "20px", bottom: "20px" } : {}}
      >
        <header className="pop-head">
          <div className="pop-title-group">
            {kicker && <p className="pop-kicker">{kicker}</p>}
            <h2 id="pop-title">{title}</h2>
          </div>
          <div className="pop-head-actions">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="pop-action-btn"
                title="Open in new browser tab"
              >
                <span>Full Page</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
            <button
              type="button"
              className="pop-action-btn"
              onClick={() => setMaximized((v) => !v)}
              title={maximized ? "Restore size" : "Expand to wide view"}
            >
              {maximized ? "❐ Standard" : "⛶ Maximize"}
            </button>
            <button ref={closeRef} className="pop-x" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </header>
        <div className="pop-body">{children}</div>
      </aside>
    </div>
  );
}

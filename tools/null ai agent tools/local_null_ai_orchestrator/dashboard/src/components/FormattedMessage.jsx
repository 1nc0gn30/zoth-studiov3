import React, { useState } from "react";

function sanitizeRaw(text) {
  if (!text) return "";
  // Strip dangling harness internal tags
  return text
    .replace(/<zoth_studio>[\s\S]*?<\/zoth_studio>/gi, "")
    .replace(/<run_command>[\s\S]*?<\/run_command>/gi, "")
    .replace(/<ask_user>[\s\S]*?<\/ask_user>/gi, "")
    .replace(/<scratchpad>[\s\S]*?<\/scratchpad>/gi, "")
    .trim();
}

function CodeBlock({ code, lang, onRunCode }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const isPreviewable = ["html", "svg", "xml"].includes(String(lang || "").toLowerCase().trim());
  const isExecutable = ["bash", "sh", "python", "py", "curl"].includes(String(lang || "").toLowerCase().trim());

  return (
    <div className="msg-code-block">
      <div className="msg-code-head">
        <span className="msg-code-lang">{lang || "code"}</span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {isPreviewable && (
            <button
              type="button"
              className="msg-code-copy"
              onClick={() => setShowPreview(!showPreview)}
              style={{ color: "#00f0ff" }}
            >
              {showPreview ? "Hide Preview" : "👁️ Live Preview"}
            </button>
          )}
          {isExecutable && onRunCode && (
            <button
              type="button"
              className="msg-code-copy"
              onClick={() => onRunCode(code)}
              style={{ color: "#10b981" }}
            >
              ⚡ Run in Term
            </button>
          )}
          <button type="button" className="msg-code-copy" onClick={handleCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
      {showPreview && isPreviewable ? (
        <div style={{ background: "#fff", color: "#000", padding: "12px", borderRadius: "0 0 6px 6px", overflowX: "auto" }}>
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      ) : (
        <pre className="msg-code-pre">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

function renderInline(text, onCommandClick) {
  if (!text) return null;

  // Tokenize inline markdown: `code`, **bold**, *italic*, [link](url)
  const tokens = [];
  let key = 0;
  const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIdx = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      const codeVal = token.slice(1, -1);
      const isCmd = codeVal.startsWith("/");
      tokens.push(
        <code
          key={key++}
          className={`msg-inline-code${isCmd ? " is-cmd-chip" : ""}`}
          onClick={isCmd && onCommandClick ? () => onCommandClick(codeVal) : undefined}
          title={isCmd ? `Click to run or insert ${codeVal}` : undefined}
        >
          {isCmd ? `⚡ ${codeVal}` : codeVal}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      tokens.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        tokens.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="msg-link"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        tokens.push(token);
      }
    }
    lastIdx = inlineRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    tokens.push(text.substring(lastIdx));
  }

  return tokens.length > 0 ? tokens : text;
}

export default function FormattedMessage({ content, onCommandClick }) {
  const clean = sanitizeRaw(content);
  if (!clean) return null;

  // Split into code fences and regular text
  const parts = [];
  const fenceRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIdx = 0;
  let match;
  let blockKey = 0;

  while ((match = fenceRegex.exec(clean)) !== null) {
    if (match.index > lastIdx) {
      parts.push({
        type: "text",
        content: clean.substring(lastIdx, match.index),
      });
    }
    parts.push({
      type: "code",
      lang: match[1] || "text",
      content: match[2].trim(),
    });
    lastIdx = fenceRegex.lastIndex;
  }

  if (lastIdx < clean.length) {
    parts.push({
      type: "text",
      content: clean.substring(lastIdx),
    });
  }

  return (
    <div className="msg-formatted-body">
      {parts.map((p, pIdx) => {
        if (p.type === "code") {
          return <CodeBlock key={`code-${pIdx}`} lang={p.lang} code={p.content} onRunCode={onCommandClick} />;
        }

        // Process text lines (headers, lists, tables, paragraphs)
        const lines = p.content.split("\n");
        const renderedElements = [];
        let curList = [];
        let curTable = [];

        const flushList = () => {
          if (curList.length > 0) {
            renderedElements.push(
              <ul key={`ul-${blockKey++}`} className="msg-list">
                {curList.map((li, liIdx) => (
                  <li key={liIdx}>{renderInline(li, onCommandClick)}</li>
                ))}
              </ul>
            );
            curList = [];
          }
        };

        const flushTable = () => {
          if (curTable.length >= 2) {
            const headerRow = curTable[0]
              .split("|")
              .map((c) => c.trim())
              .filter(Boolean);
            const bodyRows = curTable.slice(2).map((r) =>
              r
                .split("|")
                .map((c) => c.trim())
                .filter(Boolean)
            );

            renderedElements.push(
              <div key={`table-wrap-${blockKey++}`} className="msg-table-wrap" style={{ overflowX: "auto", margin: "10px 0" }}>
                <table className="msg-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontFamily: "var(--font-mono, monospace)" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}>
                      {headerRow.map((h, hIdx) => (
                        <th key={hIdx} style={{ padding: "6px 10px", textAlign: "left", color: "#00f0ff" }}>
                          {renderInline(h, onCommandClick)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: "6px 10px" }}>
                            {renderInline(cell, onCommandClick)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          curTable = [];
        };

        lines.forEach((line) => {
          const trimmed = line.trim();

          if (!trimmed) {
            flushList();
            flushTable();
            return;
          }

          // Markdown Table detection
          if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            flushList();
            curTable.push(trimmed);
            return;
          } else {
            flushTable();
          }

          // Headers
          if (trimmed.startsWith("### ")) {
            flushList();
            renderedElements.push(
              <h3 key={`h3-${blockKey++}`} className="msg-h3">
                {renderInline(trimmed.substring(4), onCommandClick)}
              </h3>
            );
          } else if (trimmed.startsWith("## ")) {
            flushList();
            renderedElements.push(
              <h2 key={`h2-${blockKey++}`} className="msg-h2">
                {renderInline(trimmed.substring(3), onCommandClick)}
              </h2>
            );
          } else if (trimmed.startsWith("# ")) {
            flushList();
            renderedElements.push(
              <h1 key={`h1-${blockKey++}`} className="msg-h1">
                {renderInline(trimmed.substring(2), onCommandClick)}
              </h1>
            );
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            curList.push(trimmed.substring(2));
          } else if (/^\d+\.\s/.test(trimmed)) {
            curList.push(trimmed.replace(/^\d+\.\s/, ""));
          } else {
            flushList();
            renderedElements.push(
              <p key={`p-${blockKey++}`} className="msg-para">
                {renderInline(trimmed, onCommandClick)}
              </p>
            );
          }
        });

        flushList();
        flushTable();

        return <React.Fragment key={`part-${pIdx}`}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
}

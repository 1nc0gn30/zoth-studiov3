import React, { useState } from "react";

function sanitizeRaw(text) {
  if (!text) return "";
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

  const langKey = String(lang || "").toLowerCase().trim();
  const isPreviewable = ["html", "svg", "xml"].includes(langKey);
  const isExecutable = ["bash", "sh", "python", "py", "curl"].includes(langKey);

  return (
    <div className="msg-code-block">
      <div className="msg-code-head">
        <span className="msg-code-lang">{lang || "code"}</span>
        <div className="msg-code-actions">
          {isPreviewable && (
            <button
              type="button"
              className="msg-code-copy"
              onClick={() => setShowPreview(!showPreview)}
              aria-pressed={showPreview}
              title={showPreview ? "Hide live preview" : "Preview this markup"}
            >
              {showPreview ? "Hide preview" : "Preview"}
            </button>
          )}
          {isExecutable && onRunCode && (
            <button
              type="button"
              className="msg-code-copy is-run"
              onClick={() => onRunCode(code)}
              title="Send this snippet to the terminal dock"
            >
              Run
            </button>
          )}
          <button
            type="button"
            className={`msg-code-copy${copied ? " is-done" : ""}`}
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      {showPreview && isPreviewable ? (
        <div className="msg-code-preview">
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

  const tokens = [];
  let key = 0;
  const inlineRegex =
    /(`[^`]+`|\*\*[^*]+\*\*|~~[^~]+~~|==[^=]+==|__[^_]+__|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
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
      if (isCmd && onCommandClick) {
        tokens.push(
          <button
            type="button"
            key={key++}
            className="msg-inline-code is-cmd-chip"
            onClick={() => onCommandClick(codeVal)}
            title={`Insert ${codeVal} into the composer`}
          >
            {codeVal}
          </button>
        );
      } else {
        tokens.push(
          <code key={key++} className="msg-inline-code">
            {codeVal}
          </code>
        );
      }
    } else if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong key={key++} className="msg-strong">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      tokens.push(
        <s key={key++} className="msg-strike">
          {token.slice(2, -2)}
        </s>
      );
    } else if (token.startsWith("==") && token.endsWith("==")) {
      tokens.push(
        <mark key={key++} className="msg-mark">
          {token.slice(2, -2)}
        </mark>
      );
    } else if (token.startsWith("__") && token.endsWith("__")) {
      tokens.push(
        <u key={key++} className="msg-underline">
          {token.slice(2, -2)}
        </u>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      tokens.push(
        <em key={key++} className="msg-em">
          {token.slice(1, -1)}
        </em>
      );
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

        const lines = p.content.split("\n");
        const renderedElements = [];
        let curList = [];
        let listKind = "ul";
        let curTable = [];
        let curQuote = [];

        const flushList = () => {
          if (curList.length === 0) return;
          const Tag = listKind === "ol" ? "ol" : "ul";
          renderedElements.push(
            <Tag key={`list-${blockKey++}`} className={`msg-list msg-list-${listKind}`}>
              {curList.map((li, liIdx) => (
                <li key={liIdx}>{renderInline(li, onCommandClick)}</li>
              ))}
            </Tag>
          );
          curList = [];
          listKind = "ul";
        };

        const flushQuote = () => {
          if (curQuote.length === 0) return;
          renderedElements.push(
            <blockquote key={`q-${blockKey++}`} className="msg-quote">
              {curQuote.map((q, qIdx) => (
                <p key={qIdx}>{renderInline(q, onCommandClick)}</p>
              ))}
            </blockquote>
          );
          curQuote = [];
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
              <div key={`table-wrap-${blockKey++}`} className="msg-table-wrap">
                <table className="msg-table">
                  <thead>
                    <tr>
                      {headerRow.map((h, hIdx) => (
                        <th key={hIdx}>{renderInline(h, onCommandClick)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{renderInline(cell, onCommandClick)}</td>
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
            flushQuote();
            return;
          }

          if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            flushList();
            flushQuote();
            curTable.push(trimmed);
            return;
          }
          flushTable();

          if (trimmed.startsWith("> ")) {
            flushList();
            curQuote.push(trimmed.replace(/^>\s?/, ""));
            return;
          }
          flushQuote();

          if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            flushList();
            renderedElements.push(<hr key={`hr-${blockKey++}`} className="msg-rule" />);
            return;
          }

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
            if (curList.length && listKind !== "ul") flushList();
            listKind = "ul";
            curList.push(trimmed.substring(2));
          } else if (/^\d+\.\s/.test(trimmed)) {
            if (curList.length && listKind !== "ol") flushList();
            listKind = "ol";
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
        flushQuote();

        return <React.Fragment key={`part-${pIdx}`}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
}

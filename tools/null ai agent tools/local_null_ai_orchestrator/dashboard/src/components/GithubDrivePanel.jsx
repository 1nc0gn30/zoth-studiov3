import { useEffect, useState } from "react";
import { gdriveDispatch, githubDispatch } from "../api";

function errMsg(env) {
  const e = env?.error;
  if (!e) return "";
  return typeof e === "string" ? e : e.message || JSON.stringify(e);
}

function crumbs(path) {
  const parts = (path || "").split("/").filter(Boolean);
  const out = [{ label: "root", path: "" }];
  let acc = "";
  for (const p of parts) {
    acc = acc ? `${acc}/${p}` : p;
    out.push({ label: p, path: acc });
  }
  return out;
}

export default function GithubDrivePanel({ host = "github" }) {
  const [side, setSide] = useState(host);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const [me, setMe] = useState(null);
  const [repos, setRepos] = useState([]);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [tab, setTab] = useState("code");
  const [path, setPath] = useState("");
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [issue, setIssue] = useState(null);
  const [prs, setPrs] = useState([]);
  const [pr, setPr] = useState(null);
  const [commits, setCommits] = useState([]);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const [driveAbout, setDriveAbout] = useState(null);
  const [drivePath, setDrivePath] = useState("");
  const [mkdir, setMkdir] = useState("");
  const [uploadSrc, setUploadSrc] = useState("");
  const [uploadDest, setUploadDest] = useState("");

  useEffect(() => {
    setSide(host);
  }, [host]);

  useEffect(() => {
    if (side === "github") bootGithub();
    else bootDrive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side]);

  async function run(label, fn) {
    setBusy(label);
    setNote("");
    try {
      return await fn();
    } catch (e) {
      setNote(e.message || String(e));
      return null;
    } finally {
      setBusy("");
    }
  }

  async function bootGithub() {
    await run("boot", async () => {
      const who = await githubDispatch("user.me");
      if (!who?.ok) {
        setMe(null);
        setNote(errMsg(who) || "Add GITHUB_TOKEN in Connect → BYOK, or run `gh auth login`.");
        return;
      }
      setMe(who.data);
      const list = await githubDispatch("repos.list", { per_page: 40, sort: "updated" });
      if (!list?.ok) {
        setNote(errMsg(list));
        return;
      }
      const rows = list.data?.items || [];
      setRepos(rows);
      const zoth = rows.find((r) => r.full_name === "1nc0gn30/zoth") || rows[0];
      if (zoth && !owner) {
        openRepo(zoth.owner?.login || zoth.full_name?.split("/")[0], zoth.name);
      }
    });
  }

  async function bootDrive() {
    await run("boot", async () => {
      const about = await gdriveDispatch("about");
      if (!about?.ok) {
        setDriveAbout(null);
        setNote(errMsg(about) || "Run `rclone config` and set GDRIVE_RCLONE_REMOTE in BYOK.");
        return;
      }
      setDriveAbout(about.data);
      await loadDrive("");
    });
  }

  async function openRepo(nextOwner, nextRepo, nextPath = "") {
    setOwner(nextOwner);
    setRepo(nextRepo);
    setTab("code");
    setIssue(null);
    setPr(null);
    setFile(null);
    await loadCode(nextOwner, nextRepo, nextPath);
  }

  async function loadCode(o = owner, r = repo, p = path) {
    setPath(p);
    setFile(null);
    await run("code", async () => {
      const env = await githubDispatch("contents.list", { owner: o, repo: r, path: p });
      if (!env?.ok) {
        setNote(errMsg(env));
        setItems([]);
        return;
      }
      const rows = [...(env.data?.items || [])].sort((a, b) => {
        if (a.type === b.type) return (a.name || "").localeCompare(b.name || "");
        return a.type === "dir" ? -1 : 1;
      });
      setItems(rows);
    });
  }

  async function openFile(item) {
    if (item.type === "dir") {
      await loadCode(owner, repo, item.path);
      return;
    }
    await run("file", async () => {
      const env = await githubDispatch("contents.get", { owner, repo, path: item.path });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setFile(env.data);
    });
  }

  async function loadIssues() {
    setTab("issues");
    setIssue(null);
    await run("issues", async () => {
      const env = await githubDispatch("issues.list", { owner, repo, state: "open" });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setIssues((env.data?.items || []).filter((i) => !i.pull_request));
    });
  }

  async function openIssue(n) {
    await run("issue", async () => {
      const env = await githubDispatch("issues.get", { owner, repo, number: n });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setIssue(env.data);
    });
  }

  async function createIssue(e) {
    e.preventDefault();
    if (!issueTitle.trim()) return;
    await run("new-issue", async () => {
      const env = await githubDispatch("issues.create", {
        owner,
        repo,
        title: issueTitle.trim(),
        body: issueBody,
      });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setIssueTitle("");
      setIssueBody("");
      setIssue(env.data);
      await loadIssues();
    });
  }

  async function loadPrs() {
    setTab("pulls");
    setPr(null);
    await run("prs", async () => {
      const env = await githubDispatch("prs.list", { owner, repo, state: "open" });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setPrs(env.data?.items || []);
    });
  }

  async function openPr(n) {
    await run("pr", async () => {
      const env = await githubDispatch("prs.get", { owner, repo, number: n });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setPr(env.data);
    });
  }

  async function loadCommits() {
    setTab("commits");
    await run("commits", async () => {
      const env = await githubDispatch("commits.list", { owner, repo });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setCommits(env.data?.items || []);
    });
  }

  async function loadDrive(p = drivePath) {
    setDrivePath(p);
    setFile(null);
    await run("drive-ls", async () => {
      const env = await gdriveDispatch("files.list", { path: p });
      if (!env?.ok) {
        setNote(errMsg(env));
        setItems([]);
        return;
      }
      const rows = [...(env.data?.items || [])].sort((a, b) => {
        if (a.type === b.type) return (a.name || "").localeCompare(b.name || "");
        return a.type === "dir" ? -1 : 1;
      });
      setItems(rows);
    });
  }

  async function openDriveItem(item) {
    const next = drivePath ? `${drivePath}/${item.name}` : item.path || item.name;
    if (item.type === "dir") {
      await loadDrive(next);
      return;
    }
    await run("drive-cat", async () => {
      const env = await gdriveDispatch("files.cat", { path: next });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setFile({ ...env.data, name: item.name, path: next });
    });
  }

  async function downloadDrive(itemPath) {
    await run("drive-get", async () => {
      const env = await gdriveDispatch("files.get", { path: itemPath });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setNote(`Saved to ${env.data.dest}`);
    });
  }

  async function makeDir(e) {
    e.preventDefault();
    if (!mkdir.trim()) return;
    const next = drivePath ? `${drivePath}/${mkdir.trim()}` : mkdir.trim();
    await run("mkdir", async () => {
      const env = await gdriveDispatch("files.mkdir", { path: next });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setMkdir("");
      await loadDrive(drivePath);
    });
  }

  async function uploadDrive(e) {
    e.preventDefault();
    if (!uploadSrc.trim() || !uploadDest.trim()) return;
    await run("put", async () => {
      const env = await gdriveDispatch("files.put", { src: uploadSrc.trim(), dest: uploadDest.trim() });
      if (!env?.ok) {
        setNote(errMsg(env));
        return;
      }
      setNote(`Uploaded to ${env.data.remote || env.data.dest}`);
      await loadDrive(drivePath);
    });
  }

  const repoName = owner && repo ? `${owner}/${repo}` : "";

  return (
    <div className="hub">
      <p className="empty-kicker">A NullAI studio · keys stay here</p>
      <div className="hub-switch" role="tablist" aria-label="Host">
        <button type="button" className={side === "github" ? "on" : ""} onClick={() => setSide("github")}>
          GitHub
        </button>
        <button type="button" className={side === "drive" ? "on" : ""} onClick={() => setSide("drive")}>
          Google Drive
        </button>
      </div>

      {side === "github" ? (
        <>
          <header className="hub-bar">
            <div>
              <b>{me ? `@${me.login}` : "Not signed in"}</b>
              <small>{me?.html_url || "Token in Connect → BYOK"}</small>
            </div>
            <select
              aria-label="Repository"
              value={repoName}
              onChange={(e) => {
                const [o, r] = e.target.value.split("/");
                if (o && r) openRepo(o, r);
              }}
            >
              <option value="">Choose a repo</option>
              {repos.map((r) => (
                <option key={r.id || r.full_name} value={r.full_name}>
                  {r.full_name}
                </option>
              ))}
            </select>
          </header>
          {repoName && (
            <nav className="hub-tabs" aria-label="Repository sections">
              <button type="button" className={tab === "code" ? "on" : ""} onClick={() => loadCode()}>
                Code
              </button>
              <button type="button" className={tab === "issues" ? "on" : ""} onClick={loadIssues}>
                Issues
              </button>
              <button type="button" className={tab === "pulls" ? "on" : ""} onClick={loadPrs}>
                Pulls
              </button>
              <button type="button" className={tab === "commits" ? "on" : ""} onClick={loadCommits}>
                Commits
              </button>
            </nav>
          )}
          {tab === "code" && repoName && (
            <>
              <ol className="hub-crumbs">
                {crumbs(path).map((c) => (
                  <li key={c.path || "root"}>
                    <button type="button" onClick={() => loadCode(owner, repo, c.path)}>
                      {c.label}
                    </button>
                  </li>
                ))}
              </ol>
              {file ? (
                <article className="hub-file">
                  <header>
                    <b>{file.name || file.path}</b>
                    <small>{file.size || 0} bytes</small>
                    {file.html_url && (
                      <a href={file.html_url} target="_blank" rel="noreferrer">
                        Open on GitHub
                      </a>
                    )}
                  </header>
                  {file.binary ? <p className="muted">Binary file.</p> : <pre>{file.text}</pre>}
                </article>
              ) : (
                <ul className="hub-files">
                  {items.map((item) => (
                    <li key={item.sha || item.path}>
                      <button type="button" onClick={() => openFile(item)}>
                        <span>{item.type === "dir" ? "📁" : "📄"}</span>
                        <b>{item.name}</b>
                        <small>{item.type === "dir" ? "folder" : `${item.size || 0} B`}</small>
                      </button>
                    </li>
                  ))}
                  {!items.length && !busy && <li className="muted">Empty folder.</li>}
                </ul>
              )}
            </>
          )}
          {tab === "issues" && (
            <div className="hub-split">
              <ul className="hub-tickets">
                {issues.map((i) => (
                  <li key={i.id || i.number}>
                    <button type="button" onClick={() => openIssue(i.number)}>
                      <b>#{i.number} {i.title}</b>
                      <small>{i.state} · {i.user?.login}</small>
                    </button>
                  </li>
                ))}
                {!issues.length && !busy && <li className="muted">No open issues.</li>}
              </ul>
              <div>
                {issue && (
                  <article className="hub-file">
                    <header>
                      <b>#{issue.number} {issue.title}</b>
                      <small>{issue.state}</small>
                    </header>
                    <p>{issue.body || "No description."}</p>
                  </article>
                )}
                <form className="hub-form" onSubmit={createIssue}>
                  <label>
                    New issue
                    <input value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} placeholder="Title" />
                  </label>
                  <textarea value={issueBody} onChange={(e) => setIssueBody(e.target.value)} placeholder="Body" rows={4} />
                  <button type="submit" disabled={!!busy}>Open issue</button>
                </form>
              </div>
            </div>
          )}
          {tab === "pulls" && (
            <div className="hub-split">
              <ul className="hub-tickets">
                {prs.map((i) => (
                  <li key={i.id || i.number}>
                    <button type="button" onClick={() => openPr(i.number)}>
                      <b>#{i.number} {i.title}</b>
                      <small>{i.state} · {i.head?.ref} → {i.base?.ref}</small>
                    </button>
                  </li>
                ))}
                {!prs.length && !busy && <li className="muted">No open pulls.</li>}
              </ul>
              {pr && (
                <article className="hub-file">
                  <header>
                    <b>#{pr.number} {pr.title}</b>
                    <small>{pr.state} · {pr.user?.login}</small>
                    {pr.html_url && (
                      <a href={pr.html_url} target="_blank" rel="noreferrer">
                        Open on GitHub
                      </a>
                    )}
                  </header>
                  <p>{pr.body || "No description."}</p>
                </article>
              )}
            </div>
          )}
          {tab === "commits" && (
            <ul className="hub-tickets">
              {commits.map((c) => (
                <li key={c.sha}>
                  <a href={c.html_url} target="_blank" rel="noreferrer">
                    <b>{c.sha}</b> {c.message}
                    <small>{c.author} · {c.date}</small>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <header className="hub-bar">
            <div>
              <b>{driveAbout ? `${driveAbout.remote}:${driveAbout.root}` : "Drive not configured"}</b>
              <small>
                {driveAbout?.about
                  ? `used ${driveAbout.about.used || driveAbout.about.usedBytes || "?"} / ${driveAbout.about.total || driveAbout.about.totalBytes || "?"}`
                  : "rclone remote · same list/read/write as GitHub"}
              </small>
            </div>
            <button type="button" onClick={() => loadDrive(drivePath)} disabled={!!busy}>
              Refresh
            </button>
          </header>
          <ol className="hub-crumbs">
            {crumbs(drivePath).map((c) => (
              <li key={c.path || "root"}>
                <button type="button" onClick={() => loadDrive(c.path)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ol>
          {file ? (
            <article className="hub-file">
              <header>
                <b>{file.name || file.path}</b>
                <small>{file.size || 0} bytes</small>
                <button type="button" onClick={() => downloadDrive(file.path)}>
                  Download
                </button>
              </header>
              {file.binary ? <p className="muted">Binary file — use Download.</p> : <pre>{file.text}</pre>}
            </article>
          ) : (
            <ul className="hub-files">
              {items.map((item) => (
                <li key={item.path || item.name}>
                  <button type="button" onClick={() => openDriveItem(item)}>
                    <span>{item.type === "dir" ? "📁" : "📄"}</span>
                    <b>{item.name}</b>
                    <small>{item.type === "dir" ? "folder" : `${item.size || 0} B`}</small>
                  </button>
                </li>
              ))}
              {!items.length && !busy && <li className="muted">Empty folder.</li>}
            </ul>
          )}
          <form className="hub-form" onSubmit={makeDir}>
            <label>
              New folder
              <span>
                <input value={mkdir} onChange={(e) => setMkdir(e.target.value)} placeholder="folder name" />
                <button type="submit" disabled={!!busy}>mkdir</button>
              </span>
            </label>
          </form>
          <form className="hub-form" onSubmit={uploadDrive}>
            <label>
              Upload local file
              <input value={uploadSrc} onChange={(e) => setUploadSrc(e.target.value)} placeholder="~/path/to/file" />
            </label>
            <label>
              Drive destination
              <span>
                <input
                  value={uploadDest}
                  onChange={(e) => setUploadDest(e.target.value)}
                  placeholder={drivePath ? `${drivePath}/name` : "name"}
                />
                <button type="submit" disabled={!!busy}>put</button>
              </span>
            </label>
          </form>
        </>
      )}
      {busy && <p className="muted">Working… {busy}</p>}
      {note && <pre className="conn-log">{note}</pre>}
    </div>
  );
}

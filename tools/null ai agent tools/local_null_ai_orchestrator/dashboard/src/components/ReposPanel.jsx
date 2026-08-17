import { useEffect, useState } from "react";
import { getRepos, repoAction } from "../api";

export default function ReposPanel() {
  const [data, setData] = useState(null);
  const [log, setLog] = useState("");
  const [busy, setBusy] = useState(null);
  const [folder, setFolder] = useState("");
  const [remote, setRemote] = useState("");

  async function refresh() {
    const snap = await getRepos();
    setData(snap);
    const g = (snap.destinations || []).find((d) => d.id === "gdrive");
    const f = (snap.destinations || []).find((d) => d.id === "folder");
    if (g?.rclone) setRemote(g.rclone);
    if (f?.path) setFolder(f.path);
  }

  useEffect(() => {
    refresh().catch((e) => setLog(e.message || String(e)));
  }, []);

  async function runBackup(id, push = false) {
    setBusy(id);
    try {
      const r = await repoAction({ action: "backup", dest: id, push });
      setLog(JSON.stringify(r, null, 2));
      await refresh();
    } catch (e) {
      setLog(e.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  async function saveDest(patch) {
    setBusy("save");
    try {
      await repoAction({ action: "destination", destination: patch });
      await refresh();
    } catch (e) {
      setLog(e.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  const repo = (data?.repos || [])[0];

  return (
    <div className="repos-panel">
      <p className="empty-kicker">A NullAI studio</p>
      <p className="muted">
        Local git is the repository. Backups copy a <strong>git bundle</strong> (history + code) to a
        folder, Google Drive via rclone, or preview a GitHub push. Browse GitHub and Drive like
        github.com from the <strong>GitHub</strong> panel or <code>/github</code> / <code>/drive</code>.
        Secrets stay out of the copy.
      </p>
      {repo && (
        <div className="repo-card">
          <em className={`conn-status${repo.dirty ? "" : " ok"}`}>{repo.dirty ? "dirty" : "clean"}</em>
          <b>{repo.label || "Zoth"}</b>
          <small>
            {repo.branch} · {repo.dirty ? `${repo.changed} uncommitted` : "clean"}
          </small>
          <code>{repo.path}</code>
          <p>{repo.head || "no commits yet"}</p>
        </div>
      )}
      <ul className="conn-list">
        {(data?.destinations || []).map((d) => (
          <li key={d.id} className={d.ready ? "ok" : ""}>
            <div>
              <b>{d.label || d.id}</b>
              <small>
                {d.kind}
                {d.ready ? " · ready" : " · needs setup"}
                {d.url ? ` · ${d.url}` : ""}
                {d.path && d.kind !== "github" ? ` · ${d.path}` : ""}
              </small>
              {d.next?.hint && <code className="conn-install">{d.next.command || d.next.hint}</code>}
            </div>
            <button type="button" disabled={busy === d.id} onClick={() => runBackup(d.id, false)}>
              {busy === d.id ? "…" : d.kind === "github" ? "Preview push" : "Backup now"}
            </button>
          </li>
        ))}
      </ul>
      <div className="repo-setup">
        <label>
          Drive rclone remote
          <span>
            <input value={remote} onChange={(e) => setRemote(e.target.value)} placeholder="gdrive" />
            <button type="button" onClick={() => saveDest({ id: "gdrive", kind: "gdrive", rclone: remote })}>
              Save
            </button>
          </span>
        </label>
        <label>
          Local backup folder
          <span>
            <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="~/ZothBackups" />
            <button type="button" onClick={() => saveDest({ id: "folder", kind: "folder", path: folder })}>
              Save
            </button>
          </span>
        </label>
        <p className="muted">
          rclone is {data?.rclone ? "installed" : "missing"}. Remotes:{" "}
          {(data?.rclone_remotes || []).join(", ") || "none yet — run `rclone config` and add Google Drive."}
        </p>
      </div>
      {log && <pre className="conn-log">{log}</pre>}
    </div>
  );
}

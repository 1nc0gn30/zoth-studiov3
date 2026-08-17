const METRICS = [
  { key: "tool_count", label: "Total Tools", icon: "🧰" },
  { key: "unknown_runtime", label: "Unknown Runtime", icon: "❓" },
];

function formatBytes(bytes) {
  if (!bytes) return "—";
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(1)} GB`;
}

export default function SystemPanel({ data, system }) {
  const osInfo = system?.os || {};
  const hw = system?.hardware || {};
  const toolsAvail = system?.tools_available;
  const toolsTotal = system?.tools_total;

  return (
    <section>
      <p className="empty-kicker">A NullAI studio</p>
      <h2 className="section-title">System</h2>

      <div className="sys-grid">
        {/* OS card */}
        <div className="sys-card">
          <div className="sys-card-label">Operating System</div>
          <div className="sys-card-value">
            {osInfo.name || osInfo.kernel || "—"}
          </div>
          {osInfo.version && (
            <div className="sys-card-sub">{osInfo.version}</div>
          )}
        </div>

        {/* Hardware card */}
        <div className="sys-card">
          <div className="sys-card-label">CPU</div>
          <div className="sys-card-value">{hw.cpu || "—"}</div>
          {hw.cores && (
            <div className="sys-card-sub">{hw.cores} cores</div>
          )}
        </div>

        {/* Memory card */}
        <div className="sys-card">
          <div className="sys-card-label">Memory</div>
          <div className="sys-card-value">
            {formatBytes(hw.memory_total_gb != null ? hw.memory_total_gb * 1073741824 : hw.memory_total)}
          </div>
          {hw.memory_total_gb != null && (
            <div className="sys-card-sub">{hw.memory_total_gb} GB total</div>
          )}
        </div>

        {/* Disk card */}
        <div className="sys-card">
          <div className="sys-card-label">Disk</div>
          <div className="sys-card-value">
            {formatBytes(hw.disk_free != null ? hw.disk_free * 1073741824 : null)}
          </div>
          {hw.disk_total && (
            <div className="sys-card-sub">
              {formatBytes(hw.disk_total * 1073741824)} total
            </div>
          )}
        </div>

        {/* Tools card */}
        {toolsAvail != null && (
          <div className="sys-card">
            <div className="sys-card-label">Security Tools</div>
            <div className="sys-card-value">
              {toolsAvail}
              <span className="sys-card-slash">/{toolsTotal}</span>
            </div>
            <div className="sys-card-sub">detected / total</div>
          </div>
        )}

        {/* Z0TH Tools card */}
        {data && (
          <div className="sys-card">
            <div className="sys-card-label">Z0TH Tools</div>
            <div className="sys-card-value">{data.tool_count}</div>
            <div className="sys-card-sub">indexed in registry</div>
          </div>
        )}
      </div>

      {/* Runtime breakdown */}
      {data?.by_runtime && (
        <>
          <h3 className="subsection-title">Runtimes</h3>
          <div className="runtime-bars">
            {Object.entries(data.by_runtime)
              .sort((a, b) => b[1] - a[1])
              .map(([rt, count]) => (
                <div key={rt} className="runtime-bar-row">
                  <span className="runtime-bar-label">{rt}</span>
                  <div className="runtime-bar-track">
                    <div
                      className="runtime-bar-fill"
                      style={{
                        width: `${(count / data.tool_count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="runtime-bar-count">{count}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Category breakdown */}
      {data?.by_category && (
        <>
          <h3 className="subsection-title">Categories</h3>
          <div className="cat-breakdown">
            {Object.entries(data.by_category)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat} className="cat-bar-row">
                  <span className="cat-bar-label">{cat}</span>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${(count / data.tool_count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="cat-bar-count">{count}</span>
                </div>
              ))}
          </div>
        </>
      )}
    </section>
  );
}

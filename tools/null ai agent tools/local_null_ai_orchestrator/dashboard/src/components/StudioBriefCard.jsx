export default function StudioBriefCard({ preset, onOpen, onReview }) {
  if (!preset) return null;
  const frameworks = Array.isArray(preset.frameworks)
    ? preset.frameworks.join(" · ")
    : preset.frameworks || "astro";
  return (
    <div className="studio-card">
      <p className="ask-kicker">{preset.inferred ? "Inferred brief" : "Studio brief"}</p>
      <h3>{preset.name || "untitled-site"}</h3>
      <dl>
        <div>
          <dt>Type</dt>
          <dd>{preset.site_type || "landing"}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>
            {frameworks}
            {preset.css_framework ? ` / ${preset.css_framework}` : ""}
          </dd>
        </div>
        <div>
          <dt>Pages</dt>
          <dd>{preset.pages || "home, about, contact"}</dd>
        </div>
        <div>
          <dt>Deploy</dt>
          <dd>{preset.deploy_target || "local"}</dd>
        </div>
      </dl>
      {preset.instructions && <p className="studio-brief">{preset.instructions}</p>}
      <div className="studio-card-actions">
        <button type="button" onClick={onOpen}>
          Open Studio
        </button>
        {onReview && (
          <button type="button" className="ghost" onClick={onReview}>
            Jump to review
          </button>
        )}
      </div>
    </div>
  );
}

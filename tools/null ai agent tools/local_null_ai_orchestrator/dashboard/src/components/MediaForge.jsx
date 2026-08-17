import { useMemo, useState } from "react";

const WORKFLOWS = [
  {
    id: "brand-kit",
    name: "Brand Kit Forge",
    description: "Generate logo batches, icon sets, contact sheets, and a searchable asset catalog.",
    commands: [
      "python3 orchestrator.py run local_null_ai_pixelz -- python3 scripts/generate_pixel_logos.py --confirm",
      "python3 orchestrator.py run local_null_ai_pixelz -- python3 scripts/generate_pixel_icon_megapack.py --confirm",
      "python3 orchestrator.py run local_null_ai_pixelz -- python3 scripts/build_pixel_catalog.py --confirm",
    ],
    outputs: ["logos_contact_sheet.png", "pixel-icon-megapack", "pixel-catalog"],
  },
  {
    id: "image-polish",
    name: "Image Polish Bench",
    description: "Prepare high-quality image assets with resize, compression, contact sheets, and format cleanup.",
    commands: [
      "ffmpeg -i input.png -vf scale=1200:-1 output.webp",
      "ffmpeg -i input.jpg -vf format=rgba output.png",
      "ffmpeg -pattern_type glob -i '*.png' -filter_complex tile=5x5 contact-sheet.png",
    ],
    outputs: ["webp exports", "transparent PNGs", "contact sheets"],
  },
  {
    id: "conversion",
    name: "Format Converter",
    description: "Convert video, audio, and still assets with ffmpeg for web-ready publishing.",
    commands: [
      "ffmpeg -i input.mov -c:v libx264 -crf 20 -c:a aac output.mp4",
      "ffmpeg -i input.mp4 -vf fps=12,scale=800:-1 output.gif",
      "ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3",
    ],
    outputs: ["mp4", "gif", "mp3", "webp"],
  },
  {
    id: "site-assets",
    name: "Website Asset Pack",
    description: "Create favicon, OG image, app icons, and compressed hero media for site launches.",
    commands: [
      "ffmpeg -i brand.png -vf scale=1200:630,format=rgba public/og-image.png",
      "ffmpeg -i logo.png -vf scale=512:512 public/icon-512.png",
      "ffmpeg -i hero.png -vf scale=1600:-1 -quality 85 public/hero.webp",
    ],
    outputs: ["og-image.png", "favicon source", "hero.webp"],
  },
];

function copy(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

export default function MediaForge({ tools = [] }) {
  const [active, setActive] = useState(WORKFLOWS[0].id);
  const mediaTools = useMemo(() => {
    return tools.filter((tool) => {
      const blob = `${tool.id} ${tool.name} ${tool.category} ${tool.description || ""}`.toLowerCase();
      return blob.includes("media") || blob.includes("pixel") || blob.includes("video") || blob.includes("convert");
    });
  }, [tools]);
  const workflow = WORKFLOWS.find((item) => item.id === active) || WORKFLOWS[0];

  return (
    <section className="mf-container">
      <div className="mf-header">
        <div>
          <span className="mf-brand">AssetForge</span>
          <span className="mf-subtitle">A NullAI studio · media, brand, conversion</span>
        </div>
        <div className="mf-statline">
          <span>{mediaTools.length} media tools</span>
          <span>{WORKFLOWS.length} workflows</span>
        </div>
      </div>

      <div className="mf-layout">
        <aside className="mf-workflows">
          {WORKFLOWS.map((item) => (
            <button
              key={item.id}
              className={`mf-workflow ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span>{item.name}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </aside>

        <div className="mf-panel">
          <h2>{workflow.name}</h2>
          <p>{workflow.description}</p>

          <div className="mf-output-row">
            {workflow.outputs.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="mf-command-list">
            {workflow.commands.map((cmd) => (
              <div key={cmd} className="mf-command">
                <code>{cmd}</code>
                <button className="mf-copy" onClick={() => copy(cmd)}>Copy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mf-tools">
        <h3>Media tools</h3>
        <div className="mf-tool-grid">
          {mediaTools.map((tool) => (
            <div key={tool.id} className="mf-tool">
              <strong>{tool.name}</strong>
              <span>{tool.category}</span>
              <p>{tool.description || "Local media workflow tool."}</p>
              {tool.entrypoints?.length > 0 && <code>{tool.entrypoints[0]}</code>}
            </div>
          ))}
          {mediaTools.length === 0 && (
            <div className="mf-empty">No registered media tools found in the current registry.</div>
          )}
        </div>
      </div>
    </section>
  );
}

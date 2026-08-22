// Unit Tests for Zoth Studio Multi-Framework Exporter (JS Engine)
const assert = require("assert");
const Exporter = require("./site-framework-exporter.js");

console.log("⚡ Starting Multi-Framework Exporter JS Tests...\n");

// 1. Theme Verification
const themeKeys = [
  "obsidian-gold",
  "midnight-neon",
  "acid-grid",
  "ultraviolet-glass",
  "retro-terminal",
  "minimalist-clean"
];

themeKeys.forEach((tKey) => {
  assert(Exporter.THEMES[tKey], `Theme ${tKey} must exist in THEMES dictionary`);
  assert(Exporter.THEMES[tKey].bg, `Theme ${tKey} must have bg`);
  assert(Exporter.THEMES[tKey].accent, `Theme ${tKey} must have accent`);
  assert(Exporter.THEMES[tKey].border, `Theme ${tKey} must have border`);
});
console.log("✅ All 6 Master Themes validated successfully.");

// 2. Astro 5 Export Verification
const spec = {
  name: "Apex Swarm",
  niche: "ai_swarm",
  theme: "obsidian-gold",
  tagline: "Autonomous Agent Collective"
};

const astroFiles = Exporter.generateAstroFiles(spec);
assert(astroFiles["package.json"], "Astro package.json must exist");
const astroPkg = JSON.parse(astroFiles["package.json"]);
assert.strictEqual(astroPkg.scripts.dev, "astro dev");
assert.strictEqual(astroPkg.scripts.build, "astro build");
assert.strictEqual(astroPkg.scripts.preview, "astro preview");
assert(astroFiles["astro.config.mjs"], "astro.config.mjs must exist");
assert(astroFiles["tailwind.config.mjs"], "tailwind.config.mjs must exist");
assert(astroFiles["netlify.toml"], "netlify.toml must exist");
assert(astroFiles["netlify.toml"].includes('NODE_VERSION = "20"'), "netlify.toml must pin Node 20 LTS");
assert(astroFiles["src/layouts/Layout.astro"], "src/layouts/Layout.astro must exist");
assert(astroFiles["src/pages/index.astro"], "src/pages/index.astro must exist");
assert(astroFiles["src/components/Sandbox.astro"], "src/components/Sandbox.astro must exist");
console.log(`✅ Astro 5 file generator validated (${Object.keys(astroFiles).length} files).`);

// 3. Vite + React Export Verification
const viteFiles = Exporter.generateViteReactFiles(spec);
assert(viteFiles["package.json"], "Vite package.json must exist");
const vitePkg = JSON.parse(viteFiles["package.json"]);
assert.strictEqual(vitePkg.scripts.dev, "vite");
assert.strictEqual(vitePkg.scripts.build, "vite build");
assert.strictEqual(vitePkg.scripts.preview, "vite preview");
assert(viteFiles["vite.config.js"], "vite.config.js must exist");
assert(viteFiles["tailwind.config.js"], "tailwind.config.js must exist");
assert(viteFiles["netlify.toml"], "netlify.toml must exist");
assert(viteFiles["netlify.toml"].includes('NODE_VERSION = "20"'), "netlify.toml must pin Node 20 LTS");
assert(viteFiles["netlify.toml"].includes('from = "/*"'), "netlify.toml must include SPA redirect");
assert(viteFiles["index.html"], "index.html must exist");
assert(viteFiles["src/main.jsx"], "src/main.jsx must exist");
assert(viteFiles["src/App.jsx"], "src/App.jsx must exist");
assert(viteFiles["src/index.css"], "src/index.css must exist");
console.log(`✅ Vite + React file generator validated (${Object.keys(viteFiles).length} files).`);

// 4. Next.js 15 Export Verification
const nextFiles = Exporter.generateNextjsFiles(spec);
assert(nextFiles["package.json"], "Next.js package.json must exist");
const nextPkg = JSON.parse(nextFiles["package.json"]);
assert.strictEqual(nextPkg.scripts.dev, "next dev");
assert.strictEqual(nextPkg.scripts.build, "next build");
assert.strictEqual(nextPkg.scripts.preview, "next start");
assert(nextFiles["next.config.js"], "next.config.js must exist");
assert(nextFiles["tsconfig.json"], "tsconfig.json must exist");
assert(nextFiles["tailwind.config.ts"], "tailwind.config.ts must exist");
assert(nextFiles["netlify.toml"], "netlify.toml must exist");
assert(nextFiles["netlify.toml"].includes('NODE_VERSION = "20"'), "netlify.toml must pin Node 20 LTS");
assert(nextFiles["app/layout.tsx"], "app/layout.tsx must exist");
assert(nextFiles["app/page.tsx"], "app/page.tsx must exist");
assert(nextFiles["app/globals.css"], "app/globals.css must exist");
console.log(`✅ Next.js 15 file generator validated (${Object.keys(nextFiles).length} files).`);

// 5. Full Multi-Framework Export
const allExport = Exporter.exportProjectFiles(spec, "all");
assert(allExport.astro && allExport["vite-react"] && allExport.nextjs, "Must contain all 3 frameworks");
console.log("✅ All Frameworks export package validated.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY (100% Zero-Drift Specification Match)!\n");

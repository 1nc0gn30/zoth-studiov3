const API_BASE = "/api";

async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${err || res.statusText}`);
  }
  return res.json();
}

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${err || res.statusText}`);
  }
  return res.json();
}

export function getHealth() {
  return fetchJSON("/health");
}

export function getSystem() {
  return fetchJSON("/system");
}

export function getTools() {
  return fetchJSON("/tools");
}

export function getTool(id) {
  return fetchJSON(`/tools/${id}`);
}

export function getCategories() {
  return fetchJSON("/categories");
}

export function getChains() {
  return fetchJSON("/chains");
}

export function getDashboard() {
  return fetchJSON("/dashboard");
}

export async function execTool(toolId, command, agent) {
  return postJSON("/exec", { tool_id: toolId, command, agent });
}

// ── Astro-for-AI API ──

const ASTRO_API = "/api/astro";

export async function getAstroStatus() {
  const res = await fetch(`${ASTRO_API}/status`);
  if (!res.ok) throw new Error(`Astro status: ${res.status}`);
  return res.json();
}

export async function getAstroThemes() {
  const res = await fetch(`${ASTRO_API}/themes`);
  if (!res.ok) throw new Error(`Astro themes: ${res.status}`);
  return res.json();
}

export async function getAstroSections() {
  const res = await fetch(`${ASTRO_API}/sections`);
  if (!res.ok) throw new Error(`Astro sections: ${res.status}`);
  return res.json();
}

export async function getAstroConfig(name) {
  const res = await fetch(`${ASTRO_API}/${name}`);
  if (!res.ok) throw new Error(`Astro config ${name}: ${res.status}`);
  return res.json();
}

export async function getAstroSites() {
  const res = await fetch(`${ASTRO_API}/sites`);
  if (!res.ok) throw new Error(`Astro sites: ${res.status}`);
  return res.json();
}

export async function getAstroTemplates() {
  const res = await fetch(`${ASTRO_API}/templates`);
  if (!res.ok) throw new Error(`Astro templates: ${res.status}`);
  return res.json();
}

export async function getAstroTemplate(name) {
  const res = await fetch(`${ASTRO_API}/template/${name}`);
  if (!res.ok) throw new Error(`Astro template ${name}: ${res.status}`);
  return res.json();
}

export async function generateAstroSite(name, template, theme) {
  const res = await fetch(`${ASTRO_API}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, template, theme }),
  });
  if (!res.ok) throw new Error(`Astro generate: ${res.status}`);
  return res.json();
}

export async function buildAstroSite() {
  const res = await fetch(`${ASTRO_API}/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`Astro build: ${res.status}`);
  return res.json();
}

export async function createAstroPage(slug, title) {
  const res = await fetch(`${ASTRO_API}/page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title }),
  });
  if (!res.ok) throw new Error(`Astro page: ${res.status}`);
  return res.json();
}

export async function validateAstroSite() {
  const res = await fetch(`${ASTRO_API}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`Astro validate: ${res.status}`);
  return res.json();
}

// ── AI Agent API ──

export async function analyzeAstroInput(logoUrl, instructions) {
  const res = await fetch(`${ASTRO_API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logo_url: logoUrl, instructions }),
  });
  if (!res.ok) throw new Error(`Astro analyze: ${res.status}`);
  return res.json();
}

export async function generateAstroSiteAI(name, instructions, logoUrl, theme, dryRun) {
  const res = await fetch(`${ASTRO_API}/generate-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, instructions, logo_url: logoUrl, theme, dry_run: dryRun }),
  });
  if (!res.ok) throw new Error(`Astro AI generate: ${res.status}`);
  return res.json();
}

export async function applyAstroConfig(name, config) {
  const res = await fetch(`${ASTRO_API}/apply-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, config }),
  });
  if (!res.ok) throw new Error(`Astro apply config: ${res.status}`);
  return res.json();
}

// ── Smart Build API ──
export async function smartBuildAstroSite(name, instructions, logoUrl) {
  const res = await fetch(`${ASTRO_API}/smart-build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, instructions, logo_url: logoUrl }),
  });
  if (!res.ok) throw new Error(`Smart build: ${res.status}`);
  return res.json();
}

export async function createAstroSitePage(siteName, slug, title) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(siteName)}/page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title }),
  });
  if (!res.ok) throw new Error(`Create page: ${res.status}`);
  return res.json();
}

export async function exportAstroSite(name) {
  const res = await fetch(`${ASTRO_API}/export?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Export: ${res.status}`);
  return res.json();
}

// ── Site Detail ──
export async function getAstroSite(name) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Site detail: ${res.status}`);
  return res.json();
}

// ── Preview Dev Server ──
export async function startAstroPreview(name) {
  const body = JSON.stringify({ name });
  const res = await fetch(`${ASTRO_API}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error(`Preview start: ${res.status}`);
  return res.json();
}

export async function stopAstroPreview(name) {
  const res = await fetch(`${ASTRO_API}/preview-stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Preview stop: ${res.status}`);
  return res.json();
}

export async function getAstroPreviewStatus() {
  const res = await fetch(`${ASTRO_API}/preview-status`);
  if (!res.ok) throw new Error(`Preview status: ${res.status}`);
  return res.json();
}

// ── Section Update ──
export async function updateAstroSection(siteName, sectionId, data) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(siteName)}/section/${encodeURIComponent(sectionId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Section update: ${res.status}`);
  return res.json();
}

// ── Theme Update ──
export async function updateAstroTheme(siteName, theme) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(siteName)}/theme`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) throw new Error(`Theme update: ${res.status}`);
  return res.json();
}

// ── Section Add ──
export async function addAstroSection(siteName, data) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(siteName)}/section`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Section add: ${res.status}`);
  return res.json();
}

// ── Section Remove ──
export async function removeAstroSection(siteName, sectionId) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(siteName)}/section/${encodeURIComponent(sectionId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Section remove: ${res.status}`);
  return res.json();
}

// ── Duplicate Site ──
export async function duplicateAstroSite(name, newName) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(name)}/duplicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_name: newName }),
  });
  if (!res.ok) throw new Error(`Duplicate: ${res.status}`);
  return res.json();
}

// ── Deploy Site ──
export async function deployAstroSite(name) {
  const res = await fetch(`${ASTRO_API}/site/${encodeURIComponent(name)}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`Deploy: ${res.status}`);
  return res.json();
}

export async function generateAstroAgent(name, instructions, logoUrl, theme, model = "codex") {
  const res = await fetch(`${ASTRO_API}/generate-agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, instructions, logo_url: logoUrl, theme, model }),
  });
  return res.json();
}

export async function getAstroAgentStatus(taskId) {
  const res = await fetch(`${ASTRO_API}/agent-status?task=${encodeURIComponent(taskId)}`);
  return res.json();
}

// ── Z0TH Studio API ──

const STUDIO_API = "/api/studio";

export async function getStudioFrameworks() {
  const res = await fetch(`${STUDIO_API}/frameworks`);
  if (!res.ok) throw new Error(`Studio frameworks: ${res.status}`);
  return res.json();
}

export async function generateStudioProject(config) {
  const res = await fetch(`${STUDIO_API}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`Studio generate: ${res.status}`);
  return res.json();
}

export async function getStudioProjects() {
  const res = await fetch(`${STUDIO_API}/projects`);
  if (!res.ok) throw new Error(`Studio projects: ${res.status}`);
  return res.json();
}

export async function getStudioProject(name) {
  const res = await fetch(`${STUDIO_API}/project/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Studio project: ${res.status}`);
  return res.json();
}

export async function studioBuild(name, model = "codex") {
  const res = await fetch(`${STUDIO_API}/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, model }),
  });
  if (!res.ok) throw new Error(`Studio build: ${res.status}`);
  return res.json();
}

export async function studioDeploy(name) {
  const res = await fetch(`${STUDIO_API}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Studio deploy: ${res.status}`);
  return res.json();
}

export async function studioGeneratePrompt(config) {
  const res = await fetch(`${STUDIO_API}/generate-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`Studio generate prompt: ${res.status}`);
  return res.json();
}

export async function studioAssignAgents(projectName, agentIds) {
  const res = await fetch(`${STUDIO_API}/assign-agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: projectName, agent_ids: agentIds }),
  });
  if (!res.ok) throw new Error(`Studio assign agents: ${res.status}`);
  return res.json();
}

// ── Agent Factory API ──

const AGENT_API = "/api/agents";

export async function getAgents() {
  const res = await fetch(AGENT_API);
  if (!res.ok) throw new Error(`Agents: ${res.status}`);
  return res.json();
}

export async function createAgent(agentConfig) {
  const res = await fetch(AGENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agentConfig),
  });
  if (!res.ok) throw new Error(`Create agent: ${res.status}`);
  return res.json();
}

export async function updateAgent(agentId, agentConfig) {
  const res = await fetch(`${AGENT_API}/${encodeURIComponent(agentId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agentConfig),
  });
  if (!res.ok) throw new Error(`Update agent: ${res.status}`);
  return res.json();
}

export async function deleteAgent(agentId) {
  const res = await fetch(`${AGENT_API}/${encodeURIComponent(agentId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Delete agent: ${res.status}`);
  return res.json();
}

export async function getAgentSkills() {
  const res = await fetch(`${AGENT_API}/skills`);
  if (!res.ok) throw new Error(`Agent skills: ${res.status}`);
  return res.json();
}

// ── Vite Studio API (placeholder until backend adds these) ──

export async function getViteStatus() {
  const res = await fetch("/api/vite/status");
  if (!res.ok) throw new Error(`Vite status: ${res.status}`);
  return res.json();
}

export async function getViteSites() {
  const res = await fetch("/api/vite/sites");
  if (!res.ok) throw new Error(`Vite sites: ${res.status}`);
  return res.json();
}

export async function generateViteSite(name) {
  const res = await fetch("/api/vite/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Vite generate: ${res.status}`);
  return res.json();
}

export async function buildViteSite() {
  const res = await fetch("/api/vite/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Vite build: ${res.status}`);
  return res.json();
}

export async function startVitePreview(name) {
  const res = await fetch("/api/vite/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Vite preview: ${res.status}`);
  return res.json();
}

export async function stopVitePreview(name) {
  const res = await fetch("/api/vite/preview-stop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Vite preview stop: ${res.status}`);
  return res.json();
}

export async function getVitePreviewStatus() {
  const res = await fetch("/api/vite/preview-status");
  if (!res.ok) throw new Error(`Vite preview status: ${res.status}`);
  return res.json();
}

// ── Agent Status Polling ──

export async function getStudioAgentStatus(name) {
  const res = await fetch(`${STUDIO_API}/agent-status?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Agent status: ${res.status}`);
  return res.json();
}

/**
 * BYOK Vault — provider preset catalog
 * Major platforms + underground/indie services that mint API keys for off-platform use.
 */

/** @typedef {{
 *  id: string,
 *  label: string,
 *  env: string|null,
 *  color: number,
 *  cat: string,
 *  hint?: string,
 *  url?: string,
 *  prefix?: RegExp|null,
 *  pattern?: RegExp|null,
 *  underground?: boolean,
 *  aliases?: string[],
 *  notes?: string,
 * }} Provider */

/** Category metadata */
export const CATEGORIES = {
  llm: { label: "LLM / Core AI", order: 1, color: "#00e5ff" },
  gateway: { label: "Gateways & Routers", order: 2, color: "#818cf8" },
  media: { label: "Image · Video · Audio", order: 3, color: "#f472b6" },
  search: { label: "Search · RAG · Data", order: 4, color: "#34d399" },
  agent: { label: "Agents · Tools · Scrapers", order: 5, color: "#fbbf24" },
  cloud: { label: "Cloud · Infra · Hosting", order: 6, color: "#60a5fa" },
  dev: { label: "Dev · CI · Code", order: 7, color: "#a78bfa" },
  pay: { label: "Payments · Commerce", order: 8, color: "#4ade80" },
  comms: { label: "Email · SMS · Voice", order: 9, color: "#fb923c" },
  auth: { label: "Auth · Identity", order: 10, color: "#e879f9" },
  maps: { label: "Maps · Geo", order: 11, color: "#2dd4bf" },
  social: { label: "Social · Growth", order: 12, color: "#f87171" },
  crypto: { label: "Crypto · Web3", order: 13, color: "#facc15" },
  monitor: { label: "Monitor · Analytics", order: 14, color: "#94a3b8" },
  niche: { label: "Underground · Indie", order: 15, color: "#d946ef" },
  custom: { label: "Custom", order: 99, color: "#d946ef" },
};

/** Preset packs — one-click seed empty slots (labels only, no secrets) */
export const PRESET_PACKS = {
  agent_stack: {
    label: "Agent stack",
    desc: "Core models + tools for local agents",
    ids: ["openai", "anthropic", "groq", "xai", "openrouter", "tavily", "serper", "browserbase", "e2b"],
  },
  multimodal: {
    label: "Multimodal",
    desc: "Image, video, voice generation",
    ids: ["openai", "stability", "replicate", "fal", "elevenlabs", "deepgram", "runway", "luma"],
  },
  rag_ops: {
    label: "RAG / search",
    desc: "Retrieval and vector stack",
    ids: ["openai", "cohere", "voyage", "pinecone", "qdrant", "tavily", "exa", "jina"],
  },
  saas_launch: {
    label: "SaaS launch",
    desc: "Billing, email, auth, host",
    ids: ["stripe", "resend", "clerk", "supabase", "vercel", "cloudflare", "posthog", "sentry"],
  },
  indie_hacker: {
    label: "Indie hacker",
    desc: "Lean stack for shipping solo",
    ids: ["openrouter", "groq", "resend", "stripe", "supabase", "cloudflare", "plausible"],
  },
  web3_ops: {
    label: "Web3 ops",
    desc: "RPC + indexers for on-chain apps",
    ids: ["alchemy", "infura", "helius", "quicknode", "moralis", "coinmarketcap"],
  },
  underground_ai: {
    label: "Underground AI",
    desc: "Indie / alt model hosts & routers",
    ids: ["together", "fireworks", "deepinfra", "nebius", "hyperbolic", "novita", "siliconflow", "groq", "cerebras", "sambanova"],
  },
};

/**
 * Full provider registry.
 * `prefix` / `pattern` used for auto-detect from pasted secrets.
 */
/** @type {Record<string, Provider>} */
export const PROVIDERS = {
  /* ─── LLM / Core AI ─── */
  openai: {
    id: "openai", label: "OpenAI", env: "OPENAI_API_KEY", color: 0x10a37f, cat: "llm",
    hint: "sk-… or sk-proj-…", url: "https://platform.openai.com/api-keys",
    prefix: /^sk-(proj-)?/i, pattern: /^sk-[A-Za-z0-9_\-]{20,}$/,
    aliases: ["gpt", "chatgpt"],
  },
  anthropic: {
    id: "anthropic", label: "Anthropic", env: "ANTHROPIC_API_KEY", color: 0xd4a27f, cat: "llm",
    hint: "sk-ant-…", url: "https://console.anthropic.com/settings/keys",
    prefix: /^sk-ant-/i, pattern: /^sk-ant-[A-Za-z0-9_\-]{20,}$/,
    aliases: ["claude"],
  },
  google: {
    id: "google", label: "Google AI (Gemini)", env: "GOOGLE_API_KEY", color: 0x4285f4, cat: "llm",
    hint: "AIza…", url: "https://aistudio.google.com/apikey",
    prefix: /^AIza/i, pattern: /^AIza[0-9A-Za-z_\-]{20,}$/,
    aliases: ["gemini", "googleai", "makersuite"],
  },
  google_cloud: {
    id: "google_cloud", label: "Google Cloud", env: "GOOGLE_CLOUD_API_KEY", color: 0xea4335, cat: "cloud",
    hint: "Cloud console API key / SA JSON", url: "https://console.cloud.google.com/apis/credentials",
    aliases: ["gcp", "vertex"],
  },
  xai: {
    id: "xai", label: "xAI (Grok)", env: "XAI_API_KEY", color: 0x00e5ff, cat: "llm",
    hint: "xAI console key", url: "https://console.x.ai/",
    prefix: /^(xai-|grok-)/i, aliases: ["grok"],
  },
  mistral: {
    id: "mistral", label: "Mistral", env: "MISTRAL_API_KEY", color: 0xff7000, cat: "llm",
    hint: "console.mistral.ai", url: "https://console.mistral.ai/api-keys/",
  },
  cohere: {
    id: "cohere", label: "Cohere", env: "COHERE_API_KEY", color: 0x39594d, cat: "llm",
    hint: "dashboard.cohere.com", url: "https://dashboard.cohere.com/api-keys",
  },
  ai21: {
    id: "ai21", label: "AI21 Labs", env: "AI21_API_KEY", color: 0x1a1a2e, cat: "llm",
    hint: "Jamba / Jurassic", url: "https://studio.ai21.com/",
  },
  deepseek: {
    id: "deepseek", label: "DeepSeek", env: "DEEPSEEK_API_KEY", color: 0x4d6bfe, cat: "llm",
    hint: "sk-… from platform.deepseek.com", url: "https://platform.deepseek.com/api_keys",
    prefix: /^sk-/i, underground: true,
  },
  qwen: {
    id: "qwen", label: "Qwen (DashScope)", env: "DASHSCOPE_API_KEY", color: 0x615ced, cat: "llm",
    hint: "Alibaba DashScope key", url: "https://dashscope.console.aliyun.com/",
    underground: true, aliases: ["dashscope", "alibaba"],
  },
  moonshot: {
    id: "moonshot", label: "Moonshot (Kimi)", env: "MOONSHOT_API_KEY", color: 0x1c1c1c, cat: "llm",
    hint: "platform.moonshot.cn", url: "https://platform.moonshot.cn/",
    underground: true, aliases: ["kimi"],
  },
  zhipu: {
    id: "zhipu", label: "Zhipu (GLM)", env: "ZHIPU_API_KEY", color: 0x0f62fe, cat: "llm",
    hint: "open.bigmodel.cn", url: "https://open.bigmodel.cn/",
    underground: true, aliases: ["glm", "bigmodel"],
  },
  minimax: {
    id: "minimax", label: "MiniMax", env: "MINIMAX_API_KEY", color: 0xe11d48, cat: "llm",
    hint: "platform.minimaxi.com", url: "https://platform.minimaxi.com/",
    underground: true,
  },
  yi: {
    id: "yi", label: "01.AI (Yi)", env: "YI_API_KEY", color: 0x111111, cat: "llm",
    hint: "platform.lingyiwanwu.com", underground: true, aliases: ["lingyi", "01ai"],
  },
  meta_llama: {
    id: "meta_llama", label: "Meta Llama API", env: "LLAMA_API_KEY", color: 0x0668e1, cat: "llm",
    hint: "llama.meta.com / partner hosts", url: "https://llama.meta.com/",
    aliases: ["llama", "meta"],
  },

  /* ─── Gateways & Routers ─── */
  openrouter: {
    id: "openrouter", label: "OpenRouter", env: "OPENROUTER_API_KEY", color: 0x6467f2, cat: "gateway",
    hint: "sk-or-…", url: "https://openrouter.ai/keys",
    prefix: /^sk-or-/i, pattern: /^sk-or-[A-Za-z0-9_\-]{10,}$/,
  },
  groq: {
    id: "groq", label: "Groq", env: "GROQ_API_KEY", color: 0xf55036, cat: "gateway",
    hint: "gsk_…", url: "https://console.groq.com/keys",
    prefix: /^gsk_/i, pattern: /^gsk_[A-Za-z0-9]{20,}$/,
  },
  together: {
    id: "together", label: "Together AI", env: "TOGETHER_API_KEY", color: 0x0f6fff, cat: "gateway",
    hint: "api.together.xyz", url: "https://api.together.xyz/settings/api-keys",
    underground: true,
  },
  fireworks: {
    id: "fireworks", label: "Fireworks AI", env: "FIREWORKS_API_KEY", color: 0xff4b1f, cat: "gateway",
    hint: "fw_… or account key", url: "https://fireworks.ai/account/api-keys",
    prefix: /^fw_/i, underground: true,
  },
  deepinfra: {
    id: "deepinfra", label: "DeepInfra", env: "DEEPINFRA_API_KEY", color: 0x7c3aed, cat: "gateway",
    hint: "deepinfra.com dashboard", url: "https://deepinfra.com/dash/api_keys",
    underground: true,
  },
  hyperbolic: {
    id: "hyperbolic", label: "Hyperbolic", env: "HYPERBOLIC_API_KEY", color: 0xf43f5e, cat: "gateway",
    hint: "app.hyperbolic.xyz", url: "https://app.hyperbolic.xyz/",
    underground: true,
  },
  nebius: {
    id: "nebius", label: "Nebius AI", env: "NEBIUS_API_KEY", color: 0x2563eb, cat: "gateway",
    hint: "studio.nebius.ai", underground: true,
  },
  novita: {
    id: "novita", label: "Novita AI", env: "NOVITA_API_KEY", color: 0x8b5cf6, cat: "gateway",
    hint: "novita.ai", underground: true,
  },
  siliconflow: {
    id: "siliconflow", label: "SiliconFlow", env: "SILICONFLOW_API_KEY", color: 0x06b6d4, cat: "gateway",
    hint: "cloud.siliconflow.cn", underground: true,
  },
  cerebras: {
    id: "cerebras", label: "Cerebras", env: "CEREBRAS_API_KEY", color: 0xf59e0b, cat: "gateway",
    hint: "inference-api keys", url: "https://cloud.cerebras.ai/",
    underground: true,
  },
  sambanova: {
    id: "sambanova", label: "SambaNova", env: "SAMBANOVA_API_KEY", color: 0xef4444, cat: "gateway",
    hint: "cloud.sambanova.ai", underground: true,
  },
  portkey: {
    id: "portkey", label: "Portkey", env: "PORTKEY_API_KEY", color: 0x6366f1, cat: "gateway",
    hint: "AI gateway / observability", url: "https://app.portkey.ai/",
    aliases: ["portkey"],
  },
  litellm: {
    id: "litellm", label: "LiteLLM Proxy", env: "LITELLM_API_KEY", color: 0x0ea5e9, cat: "gateway",
    hint: "self-host proxy master key", underground: true,
  },
  helicone: {
    id: "helicone", label: "Helicone", env: "HELICONE_API_KEY", color: 0xa855f7, cat: "gateway",
    hint: "LLM observability proxy", url: "https://helicone.ai/",
  },
  azure: {
    id: "azure", label: "Azure OpenAI", env: "AZURE_OPENAI_API_KEY", color: 0x0078d4, cat: "gateway",
    hint: "Azure resource key + endpoint", url: "https://portal.azure.com/",
    notes: "Pair with AZURE_OPENAI_ENDPOINT",
  },
  bedrock: {
    id: "bedrock", label: "AWS Bedrock", env: "AWS_SECRET_ACCESS_KEY", color: 0xff9900, cat: "gateway",
    hint: "Use with AWS_ACCESS_KEY_ID", url: "https://console.aws.amazon.com/bedrock/",
    aliases: ["aws", "amazon"],
  },
  vertex: {
    id: "vertex", label: "Vertex AI", env: "VERTEX_API_KEY", color: 0x4285f4, cat: "gateway",
    hint: "Or use service account JSON",
  },

  /* ─── Image / Video / Audio ─── */
  stability: {
    id: "stability", label: "Stability AI", env: "STABILITY_API_KEY", color: 0x9b59b6, cat: "media",
    hint: "sk-… platform.stability.ai", url: "https://platform.stability.ai/account/keys",
    prefix: /^sk-/i,
  },
  replicate: {
    id: "replicate", label: "Replicate", env: "REPLICATE_API_TOKEN", color: 0x000000, cat: "media",
    hint: "r8_…", url: "https://replicate.com/account/api-tokens",
    prefix: /^r8_/i, pattern: /^r8_[A-Za-z0-9]{20,}$/,
  },
  fal: {
    id: "fal", label: "fal.ai", env: "FAL_KEY", color: 0x7c3aed, cat: "media",
    hint: "fal key id:secret", url: "https://fal.ai/dashboard/keys",
    underground: true,
  },
  runway: {
    id: "runway", label: "Runway", env: "RUNWAY_API_KEY", color: 0x111111, cat: "media",
    hint: "dev.runwayml.com", url: "https://dev.runwayml.com/",
  },
  luma: {
    id: "luma", label: "Luma AI", env: "LUMA_API_KEY", color: 0x22d3ee, cat: "media",
    hint: "lumalabs.ai API", url: "https://lumalabs.ai/dream-machine/api/keys",
  },
  kling: {
    id: "kling", label: "Kling AI", env: "KLING_API_KEY", color: 0x000000, cat: "media",
    hint: "Kuaishou Kling API", underground: true,
  },
  midjourney: {
    id: "midjourney", label: "Midjourney (unofficial)", env: "MIDJOURNEY_API_KEY", color: 0x000000, cat: "media",
    hint: "3rd-party MJ API proxies only", underground: true,
  },
  leonardo: {
    id: "leonardo", label: "Leonardo AI", env: "LEONARDO_API_KEY", color: 0xc026d3, cat: "media",
    hint: "cloud.leonardo.ai", url: "https://app.leonardo.ai/api-access",
  },
  ideogram: {
    id: "ideogram", label: "Ideogram", env: "IDEOGRAM_API_KEY", color: 0xf59e0b, cat: "media",
    hint: "ideogram.ai API", underground: true,
  },
  elevenlabs: {
    id: "elevenlabs", label: "ElevenLabs", env: "ELEVENLABS_API_KEY", color: 0x000000, cat: "media",
    hint: "xi-api-key header value", url: "https://elevenlabs.io/app/settings/api-keys",
    aliases: ["11labs"],
  },
  deepgram: {
    id: "deepgram", label: "Deepgram", env: "DEEPGRAM_API_KEY", color: 0x13ef93, cat: "media",
    hint: "console.deepgram.com", url: "https://console.deepgram.com/",
  },
  assemblyai: {
    id: "assemblyai", label: "AssemblyAI", env: "ASSEMBLYAI_API_KEY", color: 0x2545ff, cat: "media",
    hint: "speech-to-text", url: "https://www.assemblyai.com/app/account",
  },
  whisper_api: {
    id: "openai_audio", label: "OpenAI Audio", env: "OPENAI_AUDIO_API_KEY", color: 0x10a37f, cat: "media",
    hint: "Often same as OPENAI_API_KEY",
  },
  suno: {
    id: "suno", label: "Suno (unofficial)", env: "SUNO_API_KEY", color: 0x22c55e, cat: "media",
    hint: "community / proxy APIs", underground: true,
  },
  udio: {
    id: "udio", label: "Udio (unofficial)", env: "UDIO_API_KEY", color: 0xa855f7, cat: "media",
    hint: "community wrappers", underground: true,
  },
  heygen: {
    id: "heygen", label: "HeyGen", env: "HEYGEN_API_KEY", color: 0x6366f1, cat: "media",
    hint: "avatar video API", url: "https://www.heygen.com/",
  },
  did: {
    id: "did", label: "D-ID", env: "DID_API_KEY", color: 0x0ea5e9, cat: "media",
    hint: "talking-head video", url: "https://studio.d-id.com/account-settings",
  },

  /* ─── Search / RAG / Data ─── */
  perplexity: {
    id: "perplexity", label: "Perplexity", env: "PERPLEXITY_API_KEY", color: 0x20b8cd, cat: "search",
    hint: "pplx-…", url: "https://www.perplexity.ai/settings/api",
    prefix: /^pplx-/i,
  },
  tavily: {
    id: "tavily", label: "Tavily", env: "TAVILY_API_KEY", color: 0x0ea5e9, cat: "search",
    hint: "tvly-… agent search", url: "https://app.tavily.com/home",
    prefix: /^tvly-/i,
  },
  serper: {
    id: "serper", label: "Serper", env: "SERPER_API_KEY", color: 0x3b82f6, cat: "search",
    hint: "Google SERP API", url: "https://serper.dev/",
  },
  serpapi: {
    id: "serpapi", label: "SerpAPI", env: "SERPAPI_API_KEY", color: 0x1d4ed8, cat: "search",
    hint: "serpapi.com", url: "https://serpapi.com/manage-api-key",
  },
  brave: {
    id: "brave", label: "Brave Search", env: "BRAVE_API_KEY", color: 0xfb542b, cat: "search",
    hint: "api.search.brave.com", url: "https://brave.com/search/api/",
  },
  exa: {
    id: "exa", label: "Exa", env: "EXA_API_KEY", color: 0x1e1b4b, cat: "search",
    hint: "neural search", url: "https://dashboard.exa.ai/",
    underground: true,
  },
  you: {
    id: "you", label: "You.com", env: "YOU_API_KEY", color: 0x7c3aed, cat: "search",
    hint: "api.you.com", underground: true,
  },
  jina: {
    id: "jina", label: "Jina AI", env: "JINA_API_KEY", color: 0xee4c2c, cat: "search",
    hint: "reader / embeddings jina_…", url: "https://jina.ai/",
    prefix: /^jina_/i, underground: true,
  },
  voyage: {
    id: "voyage", label: "Voyage AI", env: "VOYAGE_API_KEY", color: 0x0f766e, cat: "search",
    hint: "embeddings", url: "https://dash.voyageai.com/",
  },
  pinecone: {
    id: "pinecone", label: "Pinecone", env: "PINECONE_API_KEY", color: 0x000000, cat: "search",
    hint: "vector DB", url: "https://app.pinecone.io/",
  },
  qdrant: {
    id: "qdrant", label: "Qdrant Cloud", env: "QDRANT_API_KEY", color: 0xdc382c, cat: "search",
    hint: "cloud.qdrant.io", url: "https://cloud.qdrant.io/",
  },
  weaviate: {
    id: "weaviate", label: "Weaviate", env: "WEAVIATE_API_KEY", color: 0x00d37f, cat: "search",
    hint: "WCS API key", url: "https://console.weaviate.cloud/",
  },
  chroma: {
    id: "chroma", label: "Chroma", env: "CHROMA_API_KEY", color: 0xf59e0b, cat: "search",
    hint: "Chroma Cloud token", underground: true,
  },
  supabase: {
    id: "supabase", label: "Supabase", env: "SUPABASE_SERVICE_ROLE_KEY", color: 0x3ecf8e, cat: "search",
    hint: "service_role or anon key", url: "https://supabase.com/dashboard",
    prefix: /^eyJ/i, notes: "JWT-looking keys; also store SUPABASE_URL",
  },
  neon: {
    id: "neon", label: "Neon", env: "NEON_API_KEY", color: 0x00e599, cat: "cloud",
    hint: "console.neon.tech API key", url: "https://console.neon.tech/",
  },
  mongodb: {
    id: "mongodb", label: "MongoDB Atlas", env: "MONGODB_API_KEY", color: 0x00ed64, cat: "search",
    hint: "Atlas Admin API key",
  },
  redis_cloud: {
    id: "redis", label: "Redis Cloud", env: "REDIS_PASSWORD", color: 0xdc382d, cat: "search",
    hint: "Often password in URL",
  },

  /* ─── Agents / Tools / Scrapers ─── */
  browserbase: {
    id: "browserbase", label: "Browserbase", env: "BROWSERBASE_API_KEY", color: 0xf59e0b, cat: "agent",
    hint: "cloud browsers", url: "https://www.browserbase.com/",
    underground: true,
  },
  browserless: {
    id: "browserless", label: "Browserless", env: "BROWSERLESS_API_KEY", color: 0x22c55e, cat: "agent",
    hint: "puppeteer/playwright cloud", url: "https://www.browserless.io/",
  },
  e2b: {
    id: "e2b", label: "E2B", env: "E2B_API_KEY", color: 0xff4800, cat: "agent",
    hint: "code sandboxes e2b_…", url: "https://e2b.dev/dashboard?tab=keys",
    prefix: /^e2b_/i, underground: true,
  },
  firecrawl: {
    id: "firecrawl", label: "Firecrawl", env: "FIRECRAWL_API_KEY", color: 0xf97316, cat: "agent",
    hint: "fc-… crawl → markdown", url: "https://www.firecrawl.dev/app/api-keys",
    prefix: /^fc-/i, underground: true,
  },
  apify: {
    id: "apify", label: "Apify", env: "APIFY_TOKEN", color: 0x7b61ff, cat: "agent",
    hint: "apify_api_…", url: "https://console.apify.com/account/integrations",
    prefix: /^apify_api_/i,
  },
  scrapfly: {
    id: "scrapfly", label: "Scrapfly", env: "SCRAPFLY_API_KEY", color: 0x06b6d4, cat: "agent",
    hint: "anti-bot scraping", underground: true,
  },
  brightdata: {
    id: "brightdata", label: "Bright Data", env: "BRIGHTDATA_API_KEY", color: 0x0066ff, cat: "agent",
    hint: "proxies / unlocker",
  },
  oxylabs: {
    id: "oxylabs", label: "Oxylabs", env: "OXYLABS_PASSWORD", color: 0x6001d2, cat: "agent",
    hint: "proxy credentials",
  },
  composio: {
    id: "composio", label: "Composio", env: "COMPOSIO_API_KEY", color: 0x8b5cf6, cat: "agent",
    hint: "tool integrations for agents", underground: true,
  },
  langchain: {
    id: "langchain", label: "LangSmith", env: "LANGCHAIN_API_KEY", color: 0x1c3c3c, cat: "agent",
    hint: "lsv2_… tracing", url: "https://smith.langchain.com/",
    prefix: /^lsv2_/i, aliases: ["langsmith"],
  },
  llama_cloud: {
    id: "llamacloud", label: "LlamaCloud", env: "LLAMA_CLOUD_API_KEY", color: 0x7c3aed, cat: "agent",
    hint: "LlamaParse / LlamaIndex cloud", url: "https://cloud.llamaindex.ai/",
  },
  parallel: {
    id: "parallel", label: "Parallel AI", env: "PARALLEL_API_KEY", color: 0x14b8a6, cat: "agent",
    hint: "web research API", underground: true,
  },

  twitter: {
    id: "twitter", label: "X (Twitter) API v2", env: "X_ACCESS_TOKEN", color: 0x00f0ff, cat: "agent",
    hint: "OAuth 2.0 Access Token or Bearer", url: "https://developer.x.com/",
    prefix: /^(AAAA|Z0Mx)/i, aliases: ["x", "xcorp", "xurl", "tweet"],
  },
  x_oauth: {
    id: "x_oauth", label: "X (Twitter) Client Secret", env: "X_CLIENT_SECRET", color: 0x1d9bf0, cat: "agent",
    hint: "OAuth 2.0 Client Secret", url: "https://developer.x.com/",
    aliases: ["x_client", "twitter_oauth"],
  },

  /* ─── Cloud / Infra / Hosting ─── */
  vercel: {
    id: "vercel", label: "Vercel", env: "VERCEL_TOKEN", color: 0x000000, cat: "cloud",
    hint: "account token", url: "https://vercel.com/account/tokens",
  },
  netlify: {
    id: "netlify", label: "Netlify", env: "NETLIFY_AUTH_TOKEN", color: 0x00c7b7, cat: "cloud",
    hint: "personal access token", url: "https://app.netlify.com/user/applications#personal-access-tokens",
  },
  cloudflare: {
    id: "cloudflare", label: "Cloudflare", env: "CLOUDFLARE_API_TOKEN", color: 0xf6821f, cat: "cloud",
    hint: "API token (not global key)", url: "https://dash.cloudflare.com/profile/api-tokens",
  },
  render: {
    id: "render", label: "Render", env: "RENDER_API_KEY", color: 0x46e3b7, cat: "cloud",
    hint: "dashboard API keys", url: "https://dashboard.render.com/",
  },
  railway: {
    id: "railway", label: "Railway", env: "RAILWAY_TOKEN", color: 0x0b0d0e, cat: "cloud",
    hint: "account / project token", url: "https://railway.app/account/tokens",
  },
  fly: {
    id: "fly", label: "Fly.io", env: "FLY_API_TOKEN", color: 0x7b3fe4, cat: "cloud",
    hint: "fly tokens create", url: "https://fly.io/user/personal_access_tokens",
  },
  digitalocean: {
    id: "digitalocean", label: "DigitalOcean", env: "DIGITALOCEAN_TOKEN", color: 0x0080ff, cat: "cloud",
    hint: "personal access token", url: "https://cloud.digitalocean.com/account/api/tokens",
    prefix: /^dop_v1_/i,
  },
  linode: {
    id: "linode", label: "Linode / Akamai", env: "LINODE_TOKEN", color: 0x00b04f, cat: "cloud",
    hint: "API token",
  },
  hetzner: {
    id: "hetzner", label: "Hetzner", env: "HETZNER_API_TOKEN", color: 0xd50c2d, cat: "cloud",
    hint: "cloud API token", underground: true,
  },
  aws: {
    id: "aws_key", label: "AWS Access Key", env: "AWS_ACCESS_KEY_ID", color: 0xff9900, cat: "cloud",
    hint: "Pair with AWS_SECRET_ACCESS_KEY",
  },
  github: {
    id: "github", label: "GitHub", env: "GITHUB_TOKEN", color: 0x24292f, cat: "dev",
    hint: "ghp_… or github_pat_…", url: "https://github.com/settings/tokens",
    prefix: /^(ghp_|github_pat_|gho_|ghu_)/i,
  },
  gitlab: {
    id: "gitlab", label: "GitLab", env: "GITLAB_TOKEN", color: 0xfc6d26, cat: "dev",
    hint: "glpat-…", prefix: /^glpat-/i,
  },
  bitbucket: {
    id: "bitbucket", label: "Bitbucket", env: "BITBUCKET_TOKEN", color: 0x0052cc, cat: "dev",
    hint: "app password / token",
  },

  /* ─── Dev / CI / Code ─── */
  huggingface: {
    id: "huggingface", label: "Hugging Face", env: "HF_TOKEN", color: 0xffd21e, cat: "dev",
    hint: "hf_…", url: "https://huggingface.co/settings/tokens",
    prefix: /^hf_/i, pattern: /^hf_[A-Za-z0-9]{20,}$/,
  },
  npm: {
    id: "npm", label: "npm", env: "NPM_TOKEN", color: 0xcb3837, cat: "dev",
    hint: "automation token",
  },
  pypi: {
    id: "pypi", label: "PyPI", env: "PYPI_TOKEN", color: 0x3775a9, cat: "dev",
    hint: "pypi-…", prefix: /^pypi-/i,
  },
  dockerhub: {
    id: "dockerhub", label: "Docker Hub", env: "DOCKERHUB_TOKEN", color: 0x2496ed, cat: "dev",
    hint: "access token",
  },
  cursor: {
    id: "cursor", label: "Cursor", env: "CURSOR_API_KEY", color: 0x000000, cat: "dev",
    hint: "if exposed for integrations", underground: true,
  },
  linear: {
    id: "linear", label: "Linear", env: "LINEAR_API_KEY", color: 0x5e6ad2, cat: "dev",
    hint: "lin_api_…", url: "https://linear.app/settings/api",
    prefix: /^lin_api_/i,
  },
  notion: {
    id: "notion", label: "Notion", env: "NOTION_API_KEY", color: 0x000000, cat: "dev",
    hint: "ntn_… or secret_…", url: "https://www.notion.so/my-integrations",
    prefix: /^(secret_|ntn_)/i,
  },
  airtable: {
    id: "airtable", label: "Airtable", env: "AIRTABLE_API_KEY", color: 0x18bfff, cat: "dev",
    hint: "pat… personal access token", prefix: /^pat/i,
  },
  slack: {
    id: "slack", label: "Slack", env: "SLACK_BOT_TOKEN", color: 0x4a154b, cat: "comms",
    hint: "xoxb-…", prefix: /^xox[baprs]-/i,
  },
  discord: {
    id: "discord", label: "Discord", env: "DISCORD_BOT_TOKEN", color: 0x5865f2, cat: "comms",
    hint: "Bot token from dev portal",
  },
  telegram: {
    id: "telegram", label: "Telegram Bot", env: "TELEGRAM_BOT_TOKEN", color: 0x26a5e4, cat: "comms",
    hint: "123456:ABC… from @BotFather", pattern: /^\d+:[A-Za-z0-9_-]{20,}$/,
  },

  /* ─── Payments ─── */
  stripe: {
    id: "stripe", label: "Stripe", env: "STRIPE_SECRET_KEY", color: 0x635bff, cat: "pay",
    hint: "sk_live_… or sk_test_…", url: "https://dashboard.stripe.com/apikeys",
    prefix: /^sk_(live|test)_/i,
  },
  stripe_pub: {
    id: "stripe_pub", label: "Stripe Publishable", env: "STRIPE_PUBLISHABLE_KEY", color: 0x7a73ff, cat: "pay",
    hint: "pk_live_… / pk_test_…", prefix: /^pk_(live|test)_/i,
  },
  paypal: {
    id: "paypal", label: "PayPal", env: "PAYPAL_CLIENT_SECRET", color: 0x003087, cat: "pay",
    hint: "REST app secret",
  },
  lemon: {
    id: "lemonsqueezy", label: "Lemon Squeezy", env: "LEMONSQUEEZY_API_KEY", color: 0xffc233, cat: "pay",
    hint: "API key", url: "https://app.lemonsqueezy.com/settings/api",
    underground: true,
  },
  paddle: {
    id: "paddle", label: "Paddle", env: "PADDLE_API_KEY", color: 0xfddD35, cat: "pay",
    hint: "seller auth code / API key",
  },
  square: {
    id: "square", label: "Square", env: "SQUARE_ACCESS_TOKEN", color: 0x000000, cat: "pay",
    hint: "sandbox or production token",
  },

  /* ─── Email / SMS / Voice ─── */
  resend: {
    id: "resend", label: "Resend", env: "RESEND_API_KEY", color: 0x000000, cat: "comms",
    hint: "re_…", url: "https://resend.com/api-keys",
    prefix: /^re_/i,
  },
  sendgrid: {
    id: "sendgrid", label: "SendGrid", env: "SENDGRID_API_KEY", color: 0x1a82e2, cat: "comms",
    hint: "SG.…", prefix: /^SG\./i,
  },
  mailgun: {
    id: "mailgun", label: "Mailgun", env: "MAILGUN_API_KEY", color: 0xf06b66, cat: "comms",
    hint: "key-…", prefix: /^key-/i,
  },
  postmark: {
    id: "postmark", label: "Postmark", env: "POSTMARK_SERVER_TOKEN", color: 0xffde00, cat: "comms",
    hint: "server API token",
  },
  mailchimp: {
    id: "mailchimp", label: "Mailchimp", env: "MAILCHIMP_API_KEY", color: 0xffe01b, cat: "comms",
    hint: "…-usN datacenter suffix",
  },
  twilio: {
    id: "twilio", label: "Twilio", env: "TWILIO_AUTH_TOKEN", color: 0xf22f46, cat: "comms",
    hint: "Auth token (+ ACCOUNT_SID)", url: "https://console.twilio.com/",
  },
  plivo: {
    id: "plivo", label: "Plivo", env: "PLIVO_AUTH_TOKEN", color: 0x43a047, cat: "comms",
    hint: "auth id + token",
  },
  messagebird: {
    id: "messagebird", label: "MessageBird", env: "MESSAGEBIRD_API_KEY", color: 0x2481d7, cat: "comms",
    hint: "live / test key",
  },
  vonage: {
    id: "vonage", label: "Vonage", env: "VONAGE_API_SECRET", color: 0x000000, cat: "comms",
    hint: "API key + secret",
  },

  /* ─── Auth ─── */
  clerk: {
    id: "clerk", label: "Clerk", env: "CLERK_SECRET_KEY", color: 0x6c47ff, cat: "auth",
    hint: "sk_live_… / sk_test_…", url: "https://dashboard.clerk.com/",
    prefix: /^sk_(live|test)_/i,
  },
  auth0: {
    id: "auth0", label: "Auth0", env: "AUTH0_CLIENT_SECRET", color: 0xeb5424, cat: "auth",
    hint: "application client secret",
  },
  supabase_auth: {
    id: "supabase_jwt", label: "Supabase JWT Secret", env: "SUPABASE_JWT_SECRET", color: 0x3ecf8e, cat: "auth",
    hint: "project JWT secret",
  },
  nextauth: {
    id: "nextauth", label: "NextAuth Secret", env: "NEXTAUTH_SECRET", color: 0x000000, cat: "auth",
    hint: "random secret string",
  },
  workos: {
    id: "workos", label: "WorkOS", env: "WORKOS_API_KEY", color: 0x6363f1, cat: "auth",
    hint: "sk_…", url: "https://dashboard.workos.com/",
  },

  /* ─── Maps ─── */
  mapbox: {
    id: "mapbox", label: "Mapbox", env: "MAPBOX_ACCESS_TOKEN", color: 0x4264fb, cat: "maps",
    hint: "pk.… or sk.…", prefix: /^(pk|sk)\./i,
  },
  google_maps: {
    id: "google_maps", label: "Google Maps", env: "GOOGLE_MAPS_API_KEY", color: 0x34a853, cat: "maps",
    hint: "AIza… Maps-restricted", prefix: /^AIza/i,
  },
  maptiler: {
    id: "maptiler", label: "MapTiler", env: "MAPTILER_API_KEY", color: 0x1e88e5, cat: "maps",
    hint: "cloud.maptiler.com", underground: true,
  },

  /* ─── Social / Growth ─── */
  twitter: {
    id: "twitter", label: "X / Twitter", env: "TWITTER_BEARER_TOKEN", color: 0x000000, cat: "social",
    hint: "Bearer token v2", aliases: ["x", "twitterapi"],
  },
  linkedin: {
    id: "linkedin", label: "LinkedIn", env: "LINKEDIN_ACCESS_TOKEN", color: 0x0a66c2, cat: "social",
    hint: "OAuth access token",
  },
  meta_graph: {
    id: "meta", label: "Meta Graph", env: "META_ACCESS_TOKEN", color: 0x0866ff, cat: "social",
    hint: "Page / system user token", aliases: ["facebook", "instagram"],
  },
  youtube: {
    id: "youtube", label: "YouTube Data", env: "YOUTUBE_API_KEY", color: 0xff0000, cat: "social",
    hint: "Google API key (YouTube)",
  },
  reddit: {
    id: "reddit", label: "Reddit", env: "REDDIT_CLIENT_SECRET", color: 0xff4500, cat: "social",
    hint: "script app secret",
  },
  typeform: {
    id: "typeform", label: "Typeform", env: "TYPEFORM_API_KEY", color: 0x262627, cat: "social",
    hint: "personal token",
  },

  /* ─── Crypto / Web3 ─── */
  alchemy: {
    id: "alchemy", label: "Alchemy", env: "ALCHEMY_API_KEY", color: 0x0c0c0e, cat: "crypto",
    hint: "dashboard app key", url: "https://dashboard.alchemy.com/",
  },
  infura: {
    id: "infura", label: "Infura", env: "INFURA_API_KEY", color: 0xff6b4a, cat: "crypto",
    hint: "project ID / secret", url: "https://infura.io/",
  },
  helius: {
    id: "helius", label: "Helius", env: "HELIUS_API_KEY", color: 0xe84125, cat: "crypto",
    hint: "Solana RPC / APIs", url: "https://dev.helius.xyz/",
    underground: true,
  },
  quicknode: {
    id: "quicknode", label: "QuickNode", env: "QUICKNODE_API_KEY", color: 0x0c89e8, cat: "crypto",
    hint: "endpoint token",
  },
  moralis: {
    id: "moralis", label: "Moralis", env: "MORALIS_API_KEY", color: 0x2aa8ff, cat: "crypto",
    hint: "Web3 data API", url: "https://admin.moralis.io/",
  },
  coinmarketcap: {
    id: "coinmarketcap", label: "CoinMarketCap", env: "CMC_API_KEY", color: 0x17181b, cat: "crypto",
    hint: "pro-api key",
  },
  coingecko: {
    id: "coingecko", label: "CoinGecko", env: "COINGECKO_API_KEY", color: 0x8dc647, cat: "crypto",
    hint: "CG-… demo/pro key", prefix: /^CG-/i,
  },
  etherscan: {
    id: "etherscan", label: "Etherscan", env: "ETHERSCAN_API_KEY", color: 0x21325b, cat: "crypto",
    hint: "explorer API key",
  },
  birdeye: {
    id: "birdeye", label: "Birdeye", env: "BIRDEYE_API_KEY", color: 0xfbbf24, cat: "crypto",
    hint: "Solana market data", underground: true,
  },

  /* ─── Monitor / Analytics ─── */
  sentry: {
    id: "sentry", label: "Sentry", env: "SENTRY_AUTH_TOKEN", color: 0x362d59, cat: "monitor",
    hint: "auth token (not DSN)", url: "https://sentry.io/settings/account/api/auth-tokens/",
  },
  posthog: {
    id: "posthog", label: "PostHog", env: "POSTHOG_API_KEY", color: 0xf54e00, cat: "monitor",
    hint: "phc_… project key or personal", prefix: /^phc_/i,
  },
  mixpanel: {
    id: "mixpanel", label: "Mixpanel", env: "MIXPANEL_TOKEN", color: 0x7856ff, cat: "monitor",
    hint: "project token",
  },
  segment: {
    id: "segment", label: "Segment", env: "SEGMENT_WRITE_KEY", color: 0x52bd95, cat: "monitor",
    hint: "write key",
  },
  datadog: {
    id: "datadog", label: "Datadog", env: "DD_API_KEY", color: 0x632ca6, cat: "monitor",
    hint: "API key (+ APP key)",
  },
  newrelic: {
    id: "newrelic", label: "New Relic", env: "NEW_RELIC_LICENSE_KEY", color: 0x1ce783, cat: "monitor",
    hint: "ingest license key",
  },
  plausible: {
    id: "plausible", label: "Plausible", env: "PLAUSIBLE_API_KEY", color: 0x5850ec, cat: "monitor",
    hint: "sites API key", underground: true,
  },
  logflare: {
    id: "logflare", label: "Logflare", env: "LOGFLARE_API_KEY", color: 0xf59e0b, cat: "monitor",
    hint: "source API key", underground: true,
  },

  /* ─── Niche / Underground extras ─── */
  pollinations: {
    id: "pollinations", label: "Pollinations", env: "POLLINATIONS_API_KEY", color: 0xec4899, cat: "niche",
    hint: "optional key for higher limits", underground: true,
  },
  grok_x: {
    id: "spacexai", label: "SpaceXAI / alt hosts", env: "SPACEXAI_API_KEY", color: 0x00e5ff, cat: "niche",
    hint: "OpenAI-compatible alt hosts", underground: true,
  },
  ollama_cloud: {
    id: "ollama_cloud", label: "Ollama Cloud", env: "OLLAMA_API_KEY", color: 0x000000, cat: "niche",
    hint: "if using ollama.com cloud", underground: true,
  },
  lmstudio: {
    id: "lmstudio", label: "LM Studio", env: "LM_STUDIO_API_KEY", color: 0x6366f1, cat: "niche",
    hint: "local server optional token", underground: true,
  },
  n8n: {
    id: "n8n", label: "n8n", env: "N8N_API_KEY", color: 0xff6d5a, cat: "niche",
    hint: "instance API key", underground: true,
  },
  make: {
    id: "make", label: "Make.com", env: "MAKE_API_KEY", color: 0x6d00cc, cat: "niche",
    hint: "API token",
  },
  zapier: {
    id: "zapier", label: "Zapier", env: "ZAPIER_NLA_API_KEY", color: 0xff4a00, cat: "niche",
    hint: "NLA / actions key",
  },
  baseten: {
    id: "baseten", label: "Baseten", env: "BASETEN_API_KEY", color: 0x111827, cat: "niche",
    hint: "model deploy keys", underground: true,
  },
  modal: {
    id: "modal", label: "Modal", env: "MODAL_TOKEN_SECRET", color: 0x7c3aed, cat: "niche",
    hint: "token id + secret", underground: true,
  },
  anyscale: {
    id: "anyscale", label: "Anyscale", env: "ANYSCALE_API_KEY", color: 0x000000, cat: "niche",
    hint: "endpoints key", underground: true,
  },
  gooseai: {
    id: "gooseai", label: "GooseAI", env: "GOOSEAI_API_KEY", color: 0xf97316, cat: "niche",
    hint: "indie LLM host", underground: true,
  },
  petals: {
    id: "petals", label: "Petals", env: "PETALS_API_KEY", color: 0x22c55e, cat: "niche",
    hint: "swarm inference (if gated)", underground: true,
  },
  custom: {
    id: "custom", label: "Custom", env: null, color: 0xd946ef, cat: "custom",
    hint: "any secret · set your own env name",
  },
};

/** Ordered list for UI */
export function listProviders({ cat = null, q = "", undergroundOnly = false } = {}) {
  const qq = q.trim().toLowerCase();
  return Object.values(PROVIDERS)
    .filter((p) => {
      if (cat && cat !== "all" && p.cat !== cat) return false;
      if (undergroundOnly && !p.underground && p.cat !== "niche") return false;
      if (!qq) return true;
      const hay = [p.id, p.label, p.env || "", p.hint || "", ...(p.aliases || [])].join(" ").toLowerCase();
      return hay.includes(qq);
    })
    .sort((a, b) => {
      const ca = CATEGORIES[a.cat]?.order ?? 50;
      const cb = CATEGORIES[b.cat]?.order ?? 50;
      if (ca !== cb) return ca - cb;
      return a.label.localeCompare(b.label);
    });
}

/**
 * Smart detect provider from secret string and/or env var name.
 * Returns { id, confidence, reasons[] }
 */
export function detectProvider(secret = "", envName = "") {
  const s = String(secret || "").trim();
  const env = String(envName || "").trim().toUpperCase();
  const scores = new Map();

  function bump(id, pts, reason) {
    if (!PROVIDERS[id]) return;
    const cur = scores.get(id) || { id, score: 0, reasons: [] };
    cur.score += pts;
    cur.reasons.push(reason);
    scores.set(id, cur);
  }

  // env name heuristics
  if (env) {
    for (const p of Object.values(PROVIDERS)) {
      if (p.env && env === p.env) bump(p.id, 100, `env=${p.env}`);
      else if (p.env && env.includes(p.env.replace(/_API_KEY$|_TOKEN$|_SECRET$|_KEY$/i, ""))) {
        bump(p.id, 40, `env~${p.env}`);
      }
      if (p.aliases) {
        for (const a of p.aliases) {
          if (env.includes(a.toUpperCase())) bump(p.id, 35, `alias ${a}`);
        }
      }
      if (env.includes(p.id.toUpperCase())) bump(p.id, 30, `id in env`);
    }
    // common env patterns
    if (/OPENAI/.test(env)) bump("openai", 50, "OPENAI in name");
    if (/ANTHROPIC|CLAUDE/.test(env)) bump("anthropic", 50, "ANTHROPIC/CLAUDE");
    if (/GROQ/.test(env)) bump("groq", 50, "GROQ");
    if (/OPENROUTER/.test(env)) bump("openrouter", 50, "OPENROUTER");
    if (/GEMINI|GOOGLE_AI|GOOGLE_API/.test(env)) bump("google", 45, "GOOGLE/GEMINI");
    if (/XAI|GROK/.test(env)) bump("xai", 45, "XAI/GROK");
    if (/STRIPE/.test(env) && /PUB|PK/.test(env)) bump("stripe_pub", 60, "STRIPE pub");
    else if (/STRIPE/.test(env)) bump("stripe", 50, "STRIPE");
    if (/GITHUB/.test(env)) bump("github", 50, "GITHUB");
    if (/HF_|HUGGING/.test(env)) bump("huggingface", 50, "HF");
    if (/SUPABASE/.test(env)) bump("supabase", 50, "SUPABASE");
    if (/TAVILY/.test(env)) bump("tavily", 50, "TAVILY");
    if (/FIRECRAWL/.test(env)) bump("firecrawl", 50, "FIRECRAWL");
  }

  // secret patterns
  if (s) {
    for (const p of Object.values(PROVIDERS)) {
      if (p.prefix && p.prefix.test(s)) bump(p.id, 70, `prefix ${p.prefix}`);
      if (p.pattern && p.pattern.test(s)) bump(p.id, 90, "full pattern");
    }
    // disambiguate sk- keys
    if (/^sk-ant-/i.test(s)) bump("anthropic", 100, "sk-ant");
    else if (/^sk-or-/i.test(s)) bump("openrouter", 100, "sk-or");
    else if (/^sk-proj-/i.test(s)) bump("openai", 95, "sk-proj");
    else if (/^sk_(live|test)_/i.test(s)) {
      bump("stripe", 80, "stripe secret shape");
      bump("clerk", 40, "could be clerk");
    } else if (/^pk_(live|test)_/i.test(s)) bump("stripe_pub", 95, "stripe pk");
    else if (/^sk-[A-Za-z0-9]{20,}/i.test(s)) bump("openai", 55, "generic sk-");
  }

  const ranked = [...scores.values()].sort((a, b) => b.score - a.score);
  if (!ranked.length) {
    return { id: s || env ? "custom" : "openai", confidence: 0, reasons: ["no match"], candidates: [] };
  }
  const top = ranked[0];
  const confidence = Math.min(100, top.score);
  return {
    id: top.id,
    confidence,
    reasons: top.reasons,
    candidates: ranked.slice(0, 5).map((r) => ({ id: r.id, score: r.score, label: PROVIDERS[r.id]?.label })),
  };
}

/** Validate secret against provider rules — soft advisory */
export function validateSecret(providerId, secret) {
  const p = PROVIDERS[providerId];
  const s = String(secret || "").trim();
  if (!s) return { ok: false, level: "error", message: "Secret is empty" };
  if (s.length < 8) return { ok: false, level: "error", message: "Too short to be a real key" };
  if (/\s/.test(s) && providerId !== "custom") {
    return { ok: true, level: "warn", message: "Contains whitespace — trim before use?" };
  }
  if (p?.pattern) {
    if (p.pattern.test(s)) return { ok: true, level: "ok", message: "Matches expected format" };
    return { ok: true, level: "warn", message: `Doesn't match typical ${p.label} format` };
  }
  if (p?.prefix) {
    if (p.prefix.test(s)) return { ok: true, level: "ok", message: "Prefix looks right" };
    return { ok: true, level: "warn", message: `Expected prefix pattern for ${p.label}` };
  }
  if (s.length >= 20) return { ok: true, level: "ok", message: "Length looks plausible" };
  return { ok: true, level: "warn", message: "Short key — double-check" };
}

export function envNameFor(providerId, label = "") {
  const p = PROVIDERS[providerId];
  if (p?.env) return p.env;
  const base = (label || providerId || "CUSTOM").replace(/\W+/g, "_").toUpperCase();
  return base.endsWith("_KEY") || base.endsWith("_TOKEN") ? base : `${base}_API_KEY`;
}

export function colorHex(providerId) {
  const c = PROVIDERS[providerId]?.color ?? 0xd946ef;
  return "#" + c.toString(16).padStart(6, "0");
}

export function providerCount() {
  return Object.keys(PROVIDERS).length;
}

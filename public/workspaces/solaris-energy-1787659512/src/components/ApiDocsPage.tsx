import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Globe, FileJson, FileText, Sparkles, Cpu, BookOpen, Code2, Loader2, Play } from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'markdown'>('json');
  const [activeEndpoint, setActiveEndpoint] = useState<string>('projects');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRunRequest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 700);
  };

  // Safe syntax highlight helpers for a gorgeous OneDark-themed IDE preview
  const formatJsonWithColors = (json: string) => {
    // Safe HTML escape first
    const escaped = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Highlight keys (blue), strings (green), booleans (purple), numbers (orange), nulls (gray)
    return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|(-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)|(true|false|null)/g, (match) => {
      let cls = 'text-[#d19a66]'; // default: orange for numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-[#61afef] font-semibold'; // blue for keys
        } else {
          cls = 'text-[#98c379]'; // green for string values
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-[#c678dd] font-bold'; // purple for booleans
      } else if (/null/.test(match)) {
        cls = 'text-[#abb2bf] italic'; // gray for nulls
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  const formatMarkdownWithColors = (md: string) => {
    // Safe HTML escape first
    const escaped = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight headers (red/pink), bold text (bold white), inline code (orange), links (cyan)
    return escaped.replace(/(#+ .+$)|(\*\*[^*]+\*\*)|(\`[^\`]+\`)|(\[[^\]]+\]\([^)]+\))/gm, (match, h, bold, code, link) => {
      if (h) return `<span class="text-[#e06c75] font-bold text-[13px]">${match}</span>`;
      if (bold) return `<span class="text-white font-bold">${match}</span>`;
      if (code) return `<span class="text-[#d19a66] font-mono">${match}</span>`;
      if (link) return `<span class="text-[#56b6c2] hover:underline">${match}</span>`;
      return match;
    });
  };

  const baseUrl = 'https://100websitesin30days.nullai.tech';

  const endpoints = {
    seasons: {
      path: '/api/seasons',
      desc: 'Retrieve timeline metadata, project totals, and goals for all active challenge seasons.',
      params: [],
      curl: `curl "${baseUrl}/api/seasons${selectedFormat === 'markdown' ? '?format=markdown' : ''}"`,
      responseJson: `[
  {
    "id": 1,
    "name": "Season 1 (Spring 2026)",
    "title": "100 Websites in 30 Days",
    "startDate": "2026-03-24T00:00:00Z",
    "endDate": "2026-04-23T23:59:59Z",
    "targetCount": 100,
    "projectCount": 100,
    "postCount": 100
  },
  {
    "id": 2,
    "name": "Season 2 (Summer 2026)",
    "title": "100 Websites in 30 Days",
    "startDate": "2026-07-01T00:00:00Z",
    "endDate": "2026-07-30T23:59:59Z",
    "targetCount": 100,
    "projectCount": 9,
    "postCount": 9
  }
]`,
      responseMd: `# Seasons of 100 Websites in 30 Days

## Season 1: Season 1 (Spring 2026)
- **Challenge**: 100 Websites in 30 Days
- **Timeline**: 2026-03-24 to 2026-04-23
- **Progress**: 100 / 100 projects shipped
- **Social Updates**: 100 posts logged

## Season 2: Season 2 (Summer 2026)
- **Challenge**: 100 Websites in 30 Days
- **Timeline**: 2026-07-01 to 2026-07-30
- **Progress**: 9 / 100 projects shipped
- **Social Updates**: 9 posts logged`
    },
    projects: {
      path: '/api/projects',
      desc: 'Fetch all shipped websites across seasons, with optional text search and pagination filters.',
      params: [
        { name: 'season', type: 'number', desc: 'Filter by season ID (e.g. 1 or 2).' },
        { name: 'search', type: 'string', desc: 'Perform text search on titles, descriptions, and tags.' },
        { name: 'limit', type: 'number', desc: 'Limit the number of returned projects.' },
        { name: 'format', type: 'string', desc: 'Set output format: "json" or "markdown".' }
      ],
      curl: `curl "${baseUrl}/api/projects?season=2&limit=2${selectedFormat === 'markdown' ? '&format=markdown' : ''}"`,
      responseJson: `[
  {
    "id": 9,
    "title": "Dimension Lab",
    "date": "2026-07-04T12:00:00.000Z",
    "url": "https://spark-a-dimension.netlify.app/",
    "description": "Visualize and compare the differences between 2D and 3D design elements, parameters, and browser rendering capabilities.",
    "tags": ["three-js", "webgl", "design", "3d"],
    "thumbnail": "https://spark-a-dimension.netlify.app/og-image.png",
    "seasonId": 2,
    "seasonName": "Season 2 (Summer 2026)"
  },
  {
    "id": 8,
    "title": "Data Moshy",
    "date": "2026-07-03T15:00:00.000Z",
    "url": "https://spark-a-mosh.netlify.app/",
    "description": "Interactive media utility applying datamoshing distortions, keyframe color smears, and glitched compression to videos and images.",
    "tags": ["canvas", "datamosh", "media", "glitch"],
    "thumbnail": "https://spark-a-mosh.netlify.app/og-image.png",
    "seasonId": 2,
    "seasonName": "Season 2 (Summer 2026)"
  }
]`,
      responseMd: `# Shipped Projects (2 found)

### Dimension Lab
- **Season**: Season 2 (Summer 2026) (Season 2)
- **Date Shipped**: 2026-07-04
- **URL**: [https://spark-a-dimension.netlify.app/](https://spark-a-dimension.netlify.app/)
- **Description**: Visualize and compare the differences between 2D and 3D design elements, parameters, and browser rendering capabilities.
- **Tags**: \`three-js\`, \`webgl\`, \`design\`, \`3d\`

### Data Moshy
- **Season**: Season 2 (Summer 2026) (Season 2)
- **Date Shipped**: 2026-07-03
- **URL**: [https://spark-a-mosh.netlify.app/](https://spark-a-mosh.netlify.app/)
- **Description**: Interactive media utility applying datamoshing distortions, keyframe color smears, and glitched compression to videos and images.
- **Tags**: \`canvas\`, \`datamosh\`, \`media\`, \`glitch\``
    },
    feed: {
      path: '/api/feed',
      desc: 'Retrieve chronological timeline logs of social media announcements and deployment posts.',
      params: [
        { name: 'season', type: 'number', desc: 'Filter by season ID (e.g. 1 or 2).' },
        { name: 'limit', type: 'number', desc: 'Limit the number of social posts.' },
        { name: 'format', type: 'string', desc: 'Set output format: "json" or "markdown".' }
      ],
      curl: `curl "${baseUrl}/api/feed?season=2&limit=2${selectedFormat === 'markdown' ? '&format=markdown' : ''}"`,
      responseJson: `[
  {
    "platform": "X",
    "url": "https://x.com/DemoAgentOrg/status/2048564021239842818",
    "content": "Season 2 Day 4: Released Dimension Lab. Interactive 2D vs 3D layout capability and rendering visualizer.",
    "date": "2026-07-04T12:00:00.000Z",
    "seasonId": 2,
    "seasonName": "Season 2 (Summer 2026)"
  },
  {
    "platform": "X",
    "url": "https://x.com/DemoAgentOrg/status/2048564021239842817",
    "content": "Season 2 Day 3: Deployed Data Moshy! glitch, compress, and datamosh uploaded videos and images client-side.",
    "date": "2026-07-03T15:00:00.000Z",
    "seasonId": 2,
    "seasonName": "Season 2 (Summer 2026)"
  }
]`,
      responseMd: `# Build Feed Updates (2 posts)

### Post on 2026-07-04 (X)
> Season 2 Day 4: Released Dimension Lab. Interactive 2D vs 3D layout capability and rendering visualizer.

[View original post](https://x.com/DemoAgentOrg/status/2048564021239842818)

---

### Post on 2026-07-03 (X)
> Season 2 Day 3: Deployed Data Moshy! glitch, compress, and datamosh uploaded videos and images client-side.

[View original post](https://x.com/DemoAgentOrg/status/2048564021239842817)

---`
    }
  };

  const currentEndpoint = endpoints[activeEndpoint as keyof typeof endpoints];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-[#DADCE0] bg-white p-8 md:p-12 shadow-[0_4px_20px_rgba(66,133,244,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(66,133,244,0.08)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-google-blue/8 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-google-green/6 blur-3xl rounded-full -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-google-blue/10 border border-google-blue/15 text-google-blue text-xs font-semibold mb-6">
            <Sparkles size={14} className="animate-pulse" />
            <span>Developer &amp; AI Agent Gateway</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#202124] tracking-tight mb-4 leading-tight">
            Neal's Challenge <span className="text-google-blue">API</span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed mb-6 font-medium">
            Query challenge progress, seasons, and shipped websites directly using standard HTTPS requests. 
            Exposes JSON data or **token-efficient Markdown summaries** designed for autonomous AI agents and LLM prompts.
          </p>

          <div className="flex flex-wrap gap-3">
            <a 
              href="/api" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-google-black text-white hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] transition-all border border-transparent shadow-sm"
            >
              <Globe size={16} />
              <span>Test API Root</span>
              <ExternalLink size={14} />
            </a>
            <button 
              onClick={() => {
                const docSection = document.getElementById('endpoints-section');
                if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#F8F9FA] text-[#3C4043] border border-[#DADCE0] hover:border-google-gray hover:bg-[#F1F3F4] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Terminal size={16} />
              <span>Explore Endpoints</span>
            </button>
          </div>
        </div>
      </div>

      {/* Showcase / Playground Section */}
      <div id="endpoints-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Selector */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#5F6368] font-bold">
            Select API Endpoint
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(endpoints).map(([key, item]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveEndpoint(key);
                  setIsRunning(false);
                }}
                className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex flex-col gap-1 hover:scale-[1.01] active:scale-[0.99] duration-250 ${
                  activeEndpoint === key 
                  ? 'border-google-blue bg-google-blue/8 shadow-xs' 
                  : 'border-[#DADCE0] hover:border-[#5F6368] hover:bg-white bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono font-bold text-xs md:text-sm ${activeEndpoint === key ? 'text-google-blue' : 'text-[#202124]'}`}>{item.path}</span>
                  <span className="text-[10px] font-bold bg-google-green/10 text-google-green border border-google-green/20 px-2 py-0.5 rounded-full uppercase">GET</span>
                </div>
                <p className="text-[11px] text-[#4A4A4A] line-clamp-2 mt-1 leading-snug font-medium">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#DADCE0] bg-white p-5 space-y-4 shadow-2xs hover:shadow-xs transition-all duration-200">
            <div className="flex items-center gap-2 text-[#202124] font-bold text-sm">
              <Cpu size={18} className="text-google-blue animate-pulse" />
              <h4>AI Agent Formatting</h4>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed font-medium">
              Are you querying this from an LLM prompt, LangChain loader, or serverless agent? Append <strong>?format=markdown</strong>. 
              The response shifts from JSON to a highly condensed, token-efficient Markdown structure, saving context space and parsing overhead.
            </p>
          </div>
        </div>

        {/* Right Column: Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5F6368] font-bold">
              Console &amp; Preview
            </h3>
            
            {/* Format Toggle */}
            <div className="flex rounded-full bg-[#F1F3F4] p-1 border border-[#DADCE0] shadow-2xs">
              <button
                onClick={() => {
                  setSelectedFormat('json');
                  setIsRunning(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedFormat === 'json'
                  ? 'bg-white text-google-black shadow-2xs border border-black/5'
                  : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                <FileJson size={14} />
                <span>JSON</span>
              </button>
              <button
                onClick={() => {
                  setSelectedFormat('markdown');
                  setIsRunning(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedFormat === 'markdown'
                  ? 'bg-white text-google-black shadow-2xs border border-black/5'
                  : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                <FileText size={14} />
                <span>Markdown</span>
              </button>
            </div>
          </div>

          {/* Console Output Card */}
          <div className="rounded-2xl border border-white/5 bg-[#1e2022] overflow-hidden shadow-xl flex flex-col min-h-[480px]">
            {/* Console Header */}
            <div className="bg-black/20 px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-google-red" />
                <div className="w-3 h-3 rounded-full bg-google-yellow" />
                <div className="w-3 h-3 rounded-full bg-google-green" />
                <span className="text-[10px] font-mono text-white/40 ml-2">curl_developer_terminal.sh</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRunRequest}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-google-green text-white hover:bg-google-green/90 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isRunning ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play size={10} fill="currentColor" />
                      <span>Run Request</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleCopy(currentEndpoint.curl, 'curl')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-white/60 hover:text-white transition-colors"
                >
                  {copiedText === 'curl' ? (
                    <>
                      <Check size={12} className="text-google-green" />
                      <span className="text-google-green font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy curl</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Console CLI Input */}
            <div className="p-5 font-mono text-xs text-white/95 bg-[#121314] select-all border-b border-white/5">
              <span className="text-google-green font-bold mr-2">$</span>
              {currentEndpoint.curl}
            </div>

            {/* Console Output Body */}
            <div className="p-5 font-mono text-xs text-white/80 overflow-auto flex-1 bg-[#1e2022] max-h-[350px] scrollbar-thin">
              {isRunning ? (
                <div className="flex flex-col gap-2 text-google-green py-2 font-mono">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-google-green" />
                    <span>Connecting to host 100websitesin30days.nullai.tech [192.168.0.25]...</span>
                  </div>
                  <p className="text-white/50">&gt; GET {currentEndpoint.path} HTTP/1.1</p>
                  <p className="text-white/50">&gt; Accept: {selectedFormat === 'json' ? 'application/json' : 'text/markdown'}</p>
                  <p className="text-white/50">&gt; Host: 100websitesin30days.nullai.tech</p>
                  <p className="text-google-yellow mt-1 animate-pulse">&lt; HTTP/1.1 200 OK (Calculating streams...)</p>
                </div>
              ) : (
                <pre 
                  className="whitespace-pre scrollbar-thin"
                  dangerouslySetInnerHTML={{
                    __html: selectedFormat === 'json' 
                      ? formatJsonWithColors(currentEndpoint.responseJson) 
                      : formatMarkdownWithColors(currentEndpoint.responseMd)
                  }}
                />
              )}
            </div>

            {/* Console Footer */}
            <div className="bg-black/10 px-5 py-3 border-t border-white/5 text-[10px] font-mono text-white/40 flex items-center justify-between shrink-0">
              <span>Status: {isRunning ? 'PENDING' : '200 OK'}</span>
              <span>Content-Type: {selectedFormat === 'json' ? 'application/json' : 'text/markdown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parameters documentation */}
      {currentEndpoint.params.length > 0 && (
        <div className="rounded-2xl border border-[#DADCE0] bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-[#202124] text-sm">
            <Code2 size={18} className="text-google-yellow" />
            <h4>Supported Query Parameters</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DADCE0] text-[#5F6368] font-bold">
                  <th className="py-2.5 font-semibold">Parameter</th>
                  <th className="py-2.5 font-semibold">Type</th>
                  <th className="py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F4]">
                {currentEndpoint.params.map((p) => (
                  <tr key={p.name}>
                    <td className="py-3 font-mono font-bold text-google-blue">{p.name}</td>
                    <td className="py-3 font-mono text-google-red font-semibold">{p.type}</td>
                    <td className="py-3 text-[#4A4A4A] font-medium">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Integration walkthrough */}
      <div className="rounded-2xl border border-[#DADCE0] bg-white p-6 md:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-2.5 text-google-black font-extrabold text-lg md:text-xl">
          <BookOpen size={22} className="text-google-green animate-bounce" />
          <h2>AI Agent System Prompts Example</h2>
        </div>

        <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium">
          If you are building an AI Agent that needs up-to-date details of Neal's challenge to share on social feeds or generate reports, 
          you can instruct the agent to fetch the markdown format of our endpoints. Here is a sample instructions prompt template:
        </p>

        <div className="rounded-xl border border-[#DADCE0] bg-[#F8F9FA] p-5 space-y-3 font-mono text-xs text-[#3C4043] border-l-4 border-l-google-blue">
          <p className="font-bold text-google-black">Agent System Instruction Prompt:</p>
          <p className="leading-relaxed text-[#4A4A4A]">
            "To answer questions regarding Zoth Studio Team's latest challenge projects and progress updates, run a curl request fetching 
            `curl https://100websitesin30days.nullai.tech/api/projects?season=2&format=markdown`. This returns his completed websites list. 
            Do not fetch JSON; parse the markdown directly to save tokens."
          </p>
        </div>
      </div>
    </div>
  );
}

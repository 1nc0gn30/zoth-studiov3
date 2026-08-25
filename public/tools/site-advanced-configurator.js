/**
 * Zoth Studio — Advanced Site Configurator Engine (v4.0)
 * Handles advanced configuration presets, hosting manifests, framework adapters,
 * design library presets, and connector integrations.
 */

(function(global) {
  'use strict';

  const HOSTING_PROVIDERS = {
    netlify: {
      id: 'netlify',
      name: 'Netlify (AX v3.0)',
      icon: '⚡',
      badge: 'Edge Functions & Self-Healing',
      configFile: 'netlify.toml',
      generateConfig: (site) => `[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self' 'unsafe-inline' https: data:;"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`
    },
    vercel: {
      id: 'vercel',
      name: 'Vercel Edge',
      icon: '▲',
      badge: 'Next.js & Edge Serverless',
      configFile: 'vercel.json',
      generateConfig: (site) => `{
  "version": 2,
  "framework": "nextjs",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}`
    },
    cloudflare: {
      id: 'cloudflare',
      name: 'Cloudflare Pages',
      icon: '☁️',
      badge: 'Global Edge & Workers AI',
      configFile: 'wrangler.toml',
      generateConfig: (site) => `name = "${site.name ? site.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'zoth-site'}"
pages_build_output_dir = "dist"
compatibility_date = "2026-08-01"

[vars]
SITE_ENV = "production"
ENABLE_ANALYTICS = "true"
`
    },
    render: {
      id: 'render',
      name: 'Render Blueprint',
      icon: '🚆',
      badge: 'Web Service + Postgres',
      configFile: 'render.yaml',
      generateConfig: (site) => `services:
  - type: web
    name: ${site.name ? site.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'zoth-app'}
    runtime: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    headers:
      - path: /*
        name: X-Frame-Options
        value: SAMEORIGIN
`
    },
    aws: {
      id: 'aws',
      name: 'AWS S3 + CloudFront',
      icon: '📦',
      badge: 'Global S3 + Lambda@Edge',
      configFile: 'aws-deploy.sh',
      generateConfig: (site) => `#!/usr/bin/env bash
# Deploy static build to AWS S3 and invalidate CloudFront
BUCKET_NAME="${site.name ? site.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'zoth-app'}-dist"
aws s3 sync ./dist s3://$BUCKET_NAME --delete --cache-control max-age=31536000
echo "Deployed to s3://$BUCKET_NAME"
`
    },
    sovereign: {
      id: 'sovereign',
      name: 'Sovereign Docker & Nginx',
      icon: '🔒',
      badge: 'Air-Gapped & Zero-Egress',
      configFile: 'Dockerfile',
      generateConfig: (site) => `FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`
    }
  };

  const FRAMEWORKS = {
    nextjs: {
      id: 'nextjs',
      name: 'Next.js 15 App Router',
      icon: '⚡',
      lang: 'TypeScript + React 19',
      features: ['Server Actions', 'Turbopack', 'Tailwind CSS v4', 'Dynamic Metadata'],
      packageJson: (name) => ({
        name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '0.1.0',
        private: true,
        scripts: { dev: 'next dev --turbo', build: 'next build', start: 'next start' },
        dependencies: { next: '^15.1.0', react: '^19.0.0', 'react-dom': '^19.0.0', lucide_react: '^0.460.0' },
        devDependencies: { typescript: '^5.7.0', '@types/node': '^22.0.0', '@types/react': '^19.0.0', tailwindcss: '^3.4.15' }
      })
    },
    astro: {
      id: 'astro',
      name: 'Astro 5',
      icon: '🚀',
      lang: 'Astro + TypeScript',
      features: ['Content Collections', 'Zero JS Baseline', 'Multi-Framework Islands', 'SEO Ready'],
      packageJson: (name) => ({
        name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        type: 'module',
        scripts: { dev: 'astro dev', build: 'astro build', preview: 'astro preview' },
        dependencies: { astro: '^5.0.0', '@astrojs/tailwind': '^5.1.2', tailwindcss: '^3.4.15' }
      })
    },
    vite_react: {
      id: 'vite_react',
      name: 'Vite + React 18/19',
      icon: '⚛️',
      lang: 'TypeScript + Vite 5',
      features: ['Instant HMR', 'Zustand Store', 'Tailwind CSS', 'Framer Motion'],
      packageJson: (name) => ({
        name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        private: true,
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^0.460.0', zustand: '^5.0.0' },
        devDependencies: { vite: '^5.4.11', '@vitejs/plugin-react': '^4.3.3', tailwindcss: '^3.4.15' }
      })
    },
    sveltekit: {
      id: 'sveltekit',
      name: 'SvelteKit 2 (Svelte 5)',
      icon: '🔶',
      lang: 'TypeScript + Runes',
      features: ['Svelte 5 Runes', 'Sub-15kb Runtime', 'SSR/SSG Adapter', 'Tailwind CSS'],
      packageJson: (name) => ({
        name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '0.0.1',
        type: 'module',
        scripts: { dev: 'vite dev', build: 'vite build', preview: 'vite preview' },
        devDependencies: { '@sveltejs/kit': '^2.8.0', '@sveltejs/vite-plugin-svelte': '^4.0.0', svelte: '^5.0.0', vite: '^5.4.11', tailwindcss: '^3.4.15' }
      })
    },
    static_html: {
      id: 'static_html',
      name: '6-Page Clean HTML5 / JS',
      icon: '🌐',
      lang: 'Modern CSS3 & ES6',
      features: ['Zero Build Step', '100% Native Browser Execution', 'Sub-50ms TTFB', 'Self-Contained'],
      packageJson: (name) => ({
        name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        scripts: { start: 'npx serve public' },
        devDependencies: { serve: '^14.2.4' }
      })
    }
  };

  const DESIGN_LIBRARIES = {
    tailwind_magic: {
      id: 'tailwind_magic',
      name: 'Tailwind CSS + Magic UI',
      icon: '🎨',
      desc: 'Cinematic bento cards, animated gradient borders, marquee ribbons, and glow effects.',
      cssClasses: {
        card: 'relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]',
        button: 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105',
        badge: 'inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-mono font-semibold text-cyan-300'
      }
    },
    shadcn_radix: {
      id: 'shadcn_radix',
      name: 'shadcn/ui + Radix Primitives',
      icon: '🧩',
      desc: 'Accessible, composable UI component primitives with sleek dark mode aesthetics.',
      cssClasses: {
        card: 'rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm hover:border-foreground/30',
        button: 'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90',
        badge: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold'
      }
    },
    threejs_webgl: {
      id: 'threejs_webgl',
      name: 'Three.js 3D WebGL Canvas',
      icon: '🧊',
      desc: 'Interactive 3D particle hero background, volumetric lighting, and orbiting models.',
      cssClasses: {
        card: 'relative z-10 rounded-2xl border border-white/15 bg-black/60 p-6 backdrop-blur-2xl transition-all hover:border-amber-400/50',
        button: 'inline-flex items-center gap-2 rounded-xl border border-amber-400/60 bg-amber-400/20 px-6 py-3 font-bold text-amber-300 shadow-[0_0_20px_rgba(232,200,114,0.3)] hover:bg-amber-400 hover:text-black',
        badge: 'inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-mono text-amber-300'
      }
    },
    framer_motion: {
      id: 'framer_motion',
      name: 'Framer Motion Springs',
      icon: '🌊',
      desc: 'Physics-based spring interactions, scroll-linked parallax, and enter/exit transitions.',
      cssClasses: {
        card: 'rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl transition-transform duration-300 hover:-translate-y-1.5',
        button: 'rounded-xl bg-purple-500 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/30 transition-transform active:scale-95',
        badge: 'rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300'
      }
    },
    cyber_obsidian: {
      id: 'cyber_obsidian',
      name: 'Cyberpunk Obsidian & Neon',
      icon: '📟',
      desc: 'High-contrast alchemical obsidian surfaces, glowing scanlines, and terminal borders.',
      cssClasses: {
        card: 'border border-emerald-500/40 bg-black/90 p-5 font-mono shadow-[0_0_15px_rgba(52,211,153,0.15)] hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.3)]',
        button: 'border-2 border-emerald-400 bg-emerald-400/20 px-6 py-2.5 font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:bg-emerald-400 hover:text-black',
        badge: 'border border-emerald-500/50 bg-emerald-950/50 px-3 py-1 text-xs font-mono text-emerald-400'
      }
    }
  };

  const CONNECTORS = {
    stripe_payments: {
      id: 'stripe_payments',
      category: 'payments',
      name: 'Stripe Payments & Subscriptions',
      icon: '💳',
      desc: 'Stripe Checkout sessions, webhook verification, customer billing portal, and pricing tier sync.',
      envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
      generateHelper: () => `// Stripe Billing Gateway Helper
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export async function createCheckoutSession({ priceId, customerEmail, successUrl, cancelUrl }) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    customer_email: customerEmail,
    success_url: successUrl || 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: cancelUrl || 'http://localhost:3000/pricing',
  });
}
`
    },
    solana_web3: {
      id: 'solana_web3',
      category: 'payments',
      name: 'Solana Web3 & Phantom Pay',
      icon: '🪐',
      desc: 'Non-custodial Solana Pay QR codes, Phantom/Solflare wallet adapter, and SPL token transactions.',
      envKeys: ['NEXT_PUBLIC_SOLANA_RPC_URL', 'MERCHANT_WALLET_PUBLIC_KEY'],
      generateHelper: () => `// Solana Pay & Web3 Connection Helper
import { Connection, PublicKey } from '@solana/web3.js';

export const solanaConnection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

export function getMerchantWallet() {
  return new PublicKey(process.env.MERCHANT_WALLET_PUBLIC_KEY || '11111111111111111111111111111111');
}
`
    },
    supabase_auth: {
      id: 'supabase_auth',
      category: 'auth',
      name: 'Supabase Auth & Database (RLS)',
      icon: '🔐',
      desc: 'PostgreSQL database with Row Level Security, email/OAuth social login, and real-time subscriptions.',
      envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
      generateHelper: () => `// Supabase Client Helper
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`
    },
    argon2_vault: {
      id: 'argon2_vault',
      category: 'auth',
      name: 'Sovereign Argon2id Vault (:8484)',
      icon: '🛡️',
      desc: 'Local air-gapped Argon2id KDF key container with XChaCha20-Poly1305 and zero cloud egress.',
      envKeys: ['VAULT_ENDPOINT', 'VAULT_MASTER_SECRET'],
      generateHelper: () => `// Sovereign Argon2id Vault Client
export async function queryLocalVault(action, payload) {
  const endpoint = process.env.VAULT_ENDPOINT || 'http://127.0.0.1:8484/api';
  const res = await fetch(\`\${endpoint}/\${action}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}
`
    },
    resend_email: {
      id: 'resend_email',
      category: 'forms',
      name: 'Resend / Postmark Email API',
      icon: '📬',
      desc: 'Transactional contact forms, welcome email dispatch, and team notifications.',
      envKeys: ['RESEND_API_KEY', 'CONTACT_NOTIFICATION_EMAIL'],
      generateHelper: () => `// Resend Transactional Email Helper
export async function sendContactNotification({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY missing. Simulating email dispatch to:', email);
    return { ok: true, simulated: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Zoth Dispatch <onboarding@resend.dev>',
      to: process.env.CONTACT_NOTIFICATION_EMAIL || 'support@domain.com',
      subject: \`New Contact Inquiry from \${name}\`,
      html: \`<p><strong>Name:</strong> \${name}</p><p><strong>Email:</strong> \${email}</p><p><strong>Message:</strong></p><p>\${message}</p>\`
    })
  });
  return await res.json();
}
`
    },
    signal_swarm: {
      id: 'signal_swarm',
      category: 'forms',
      name: 'Signal Swarm NOC Bridge',
      icon: '📡',
      desc: 'Forward lead submissions directly to your encrypted Signal messenger / Discord webhooks.',
      envKeys: ['SIGNAL_NOC_BRIDGE_URL', 'SIGNAL_SECURITY_TOKEN'],
      generateHelper: () => `// Signal Swarm NOC Notification Helper
export async function dispatchSignalAlert(topic, payload) {
  const bridgeUrl = process.env.SIGNAL_NOC_BRIDGE_URL || 'http://127.0.0.1:8088/signal';
  const token = process.env.SIGNAL_SECURITY_TOKEN || 'local-dev-token';
  const res = await fetch(\`\${bridgeUrl}/api/dispatch\`, {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, timestamp: new Date().toISOString(), data: payload })
  });
  return await res.json();
}
`
    },
    privacy_telemetry: {
      id: 'privacy_telemetry',
      category: 'analytics',
      name: 'Zero-Cookie Privacy Telemetry',
      icon: '📈',
      desc: '100% GDPR/CCPA compliant cookieless event analytics, pageviews, and conversion tracking.',
      envKeys: ['NEXT_PUBLIC_TELEMETRY_ENDPOINT'],
      generateHelper: () => `// Zero-Cookie Privacy Telemetry
export function trackEvent(eventName, metadata = {}) {
  if (typeof window === 'undefined') return;
  const payload = {
    event: eventName,
    path: window.location.pathname,
    referrer: document.referrer || null,
    timestamp: Date.now(),
    ...metadata
  };
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', JSON.stringify(payload));
  } else {
    fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  }
}
`
    },
    nexus_3d_bridge: {
      id: 'nexus_3d_bridge',
      category: '3d_assets',
      name: 'Nexus 3D Omniverse Connector',
      icon: '📐',
      desc: 'Direct bridge to import procedural CAD models, 3D scenes, and WebGL mascots into the site.',
      envKeys: ['NEXT_PUBLIC_NEXUS_MODEL_ORIGIN'],
      generateHelper: () => `// Nexus 3D Omniverse Asset Loader
export async function loadNexus3DAsset(modelSlug) {
  const origin = process.env.NEXT_PUBLIC_NEXUS_MODEL_ORIGIN || '/assets/models';
  const res = await fetch(\`\${origin}/\${modelSlug}.gltf\`);
  return await res.json();
}
`
    }
  };

  const ZothAdvancedConfigurator = {
    VERSION: '4.0.0',
    HOSTING_PROVIDERS,
    FRAMEWORKS,
    DESIGN_LIBRARIES,
    CONNECTORS,

    getHostingProvider(id) {
      return HOSTING_PROVIDERS[id] || HOSTING_PROVIDERS.netlify;
    },

    getFramework(id) {
      return FRAMEWORKS[id] || FRAMEWORKS.nextjs;
    },

    getDesignLibrary(id) {
      return DESIGN_LIBRARIES[id] || DESIGN_LIBRARIES.tailwind_magic;
    },

    getConnector(id) {
      return CONNECTORS[id] || null;
    },

    // Build environment file (.env.example) for selected connectors
    generateEnvExample(selectedConnectorIds = []) {
      const allKeys = new Set(['NODE_ENV=production', 'PORT=3000']);
      
      selectedConnectorIds.forEach(id => {
        const c = CONNECTORS[id];
        if (c && c.envKeys) {
          c.envKeys.forEach(k => allKeys.add(`${k}=your_${k.toLowerCase()}_here`));
        }
      });

      return Array.from(allKeys).join('\n') + '\n';
    },

    // Bundle complete repository files object for 1-click ZIP export
    bundleCompleteRepository(site, config = {}) {
      const hosting = this.getHostingProvider(config.hosting || 'netlify');
      const framework = this.getFramework(config.framework || 'nextjs');
      const design = this.getDesignLibrary(config.design || 'tailwind_magic');
      const activeConnectors = (config.connectors || ['stripe_payments', 'resend_email', 'privacy_telemetry'])
        .map(id => this.getConnector(id))
        .filter(Boolean);

      const siteName = site.name || 'Zoth-Enterprise';
      const cleanSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const files = {};

      // 1. README
      files['README.md'] = `# ${siteName}\n\n` +
        `> ${site.tagline || 'Autonomous Production Web Application'}\n\n` +
        `## 🛠️ Stack Configuration\n` +
        `- **Framework:** ${framework.name} (${framework.lang})\n` +
        `- **Hosting Target:** ${hosting.name} (${hosting.badge})\n` +
        `- **Design System:** ${design.name}\n` +
        `- **Active Connectors:** ${activeConnectors.map(c => c.name).join(', ') || 'None'}\n\n` +
        `## 🚀 Getting Started\n` +
        `\`\`\`bash\n# 1. Install dependencies\nnpm install\n\n# 2. Configure environment\ncp .env.example .env.local\n\n# 3. Start local development\nnpm run dev\n\`\`\`\n`;

      // 2. Hosting Manifest
      files[hosting.configFile] = hosting.generateConfig(site);

      // 3. package.json
      files['package.json'] = JSON.stringify(framework.packageJson(siteName), null, 2);

      // 4. .env.example
      files['.env.example'] = this.generateEnvExample(activeConnectors.map(c => c.id));

      // 5. Connectors library files
      activeConnectors.forEach(c => {
        files[`src/lib/connectors/${c.id}.js`] = c.generateHelper();
      });

      // 6. Design System configuration & styles
      files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro,html}', './public/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '${site.theme ? site.theme.bg : "#040711"}',
          accent: '${site.theme ? site.theme.accent : "#00f0ff"}',
          surface: '${site.theme ? site.theme.surface : "#0a1226"}'
        }
      }
    }
  },
  plugins: []
};
`;

      return files;
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = ZothAdvancedConfigurator;
  else global.ZothAdvancedConfigurator = ZothAdvancedConfigurator;
})(typeof window !== 'undefined' ? window : globalThis);

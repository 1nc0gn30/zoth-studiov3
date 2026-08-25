import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

type RouteMeta = {
  route: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
};

type PrerenderManifest = {
  routes: RouteMeta[];
};

function upsertTag(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) {
    return html.replace(matcher, tag);
  }
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function applyRouteMeta(html: string, meta: RouteMeta): string {
  let next = html;

  next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  next = upsertTag(
    next,
    /<meta\s+name="description"[\s\S]*?>/i,
    `<meta name="description" content="${meta.description}" />`,
  );
  next = upsertTag(
    next,
    /<link\s+rel="canonical"[\s\S]*?>/i,
    `<link rel="canonical" href="${meta.canonical}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+property="og:title"[\s\S]*?>/i,
    `<meta property="og:title" content="${meta.title}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+property="og:description"[\s\S]*?>/i,
    `<meta property="og:description" content="${meta.description}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+property="og:type"[\s\S]*?>/i,
    '<meta property="og:type" content="website" />',
  );
  next = upsertTag(
    next,
    /<meta\s+property="og:url"[\s\S]*?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+property="og:image"[\s\S]*?>/i,
    `<meta property="og:image" content="${meta.ogImage}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+name="twitter:card"[\s\S]*?>/i,
    '<meta name="twitter:card" content="summary_large_image" />',
  );
  next = upsertTag(
    next,
    /<meta\s+name="twitter:title"[\s\S]*?>/i,
    `<meta name="twitter:title" content="${meta.title}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+name="twitter:description"[\s\S]*?>/i,
    `<meta name="twitter:description" content="${meta.description}" />`,
  );
  next = upsertTag(
    next,
    /<meta\s+name="twitter:image"[\s\S]*?>/i,
    `<meta name="twitter:image" content="${meta.ogImage}" />`,
  );

  return next;
}

function prerenderPerRoutePlugin() {
  return {
    name: 'prerender-per-route',
    apply: 'build' as const,
    closeBundle() {
      const root = process.cwd();
      const distDir = path.join(root, 'dist');
      const templatePath = path.join(distDir, 'index.html');
      const manifestPath = path.join(root, '.generated', 'prerender-manifest.json');

      if (!fs.existsSync(templatePath) || !fs.existsSync(manifestPath)) {
        console.warn('[prerender-per-route] Missing dist/index.html or .generated/prerender-manifest.json. Skipping route prerender.');
        return;
      }

      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as PrerenderManifest;

      for (const routeMeta of manifest.routes) {
        const routePath = routeMeta.route === '/' ? '' : routeMeta.route.replace(/^\/+/, '');
        const outFile = routePath
          ? path.join(distDir, routePath, 'index.html')
          : path.join(distDir, 'index.html');

        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, applyRouteMeta(templateHtml, routeMeta), 'utf8');
      }

      console.log(`[prerender-per-route] Wrote ${manifest.routes.length} route HTML files.`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), prerenderPerRoutePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: ['parrot.tailb0828c.ts.net'],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify-file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

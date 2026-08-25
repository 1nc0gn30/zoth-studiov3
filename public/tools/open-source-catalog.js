/**
 * Zoth Studio Open Source Library Archive Catalog
 * Comprehensive Collection of 30+ Top-Tier MIT / Open-Source Web Applications & Website Templates
 * Version: 2.0.0
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZothOpenSourceCatalog = factory();
    if (typeof window !== 'undefined') {
      window.ZothOpenSourceCatalog = root.ZothOpenSourceCatalog;
    }
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function() {
  'use strict';

  var VERSION = '2.0.0';

  var TEMPLATES = [
    {
      id: 'astro-paper',
      title: 'Astro Paper — Minimalist Typography & Publication Theme',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Astro + Tailwind CSS',
      author: 'Sat Naing',
      stars: '4.8k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/satnaing/astro-paper',
      description: 'A minimal, accessible, and fast Astro theme with fuzzy client search, dark mode, code syntax highlighting, and SEO optimization.',
      tags: ['Astro', 'Tailwind', 'Search', 'Dark Mode', 'Blog', 'SEO'],
      entrypointUrl: '/open-source-library/astro-paper/src/pages/index.astro',
      baseDir: '/open-source-library/astro-paper/',
      previewType: 'dev_server'
    },
    {
      id: 'cruip-open-react',
      title: 'Cruip Open PRO — High-Conversion Dark Mode Landing Page',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'React + Tailwind CSS',
      author: 'Cruip',
      stars: '6.2k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/Cruip/open-react-template',
      description: 'Stunning dark-mode SaaS product landing page with glowing gradient headers, interactive feature tabs, pricing calculator, and testimonial carousels.',
      tags: ['React', 'Tailwind', 'SaaS', 'Dark Theme', 'Landing', 'Glow'],
      entrypointUrl: '/open-source-library/cruip-open-react/index.html',
      baseDir: '/open-source-library/cruip-open-react/',
      previewType: 'dev_server'
    },
    {
      id: 'shadcn-taxonomy',
      title: 'Taxonomy — Modern Full-Stack Web Application',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'Next.js App Router + Shadcn UI',
      author: 'Shadcn',
      stars: '19.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/shadcn-ui/taxonomy',
      description: 'The industry-standard open source web application built with Next.js App Router, Radix UI primitives, Lucide icons, and Tailwind CSS.',
      tags: ['Next.js', 'Shadcn UI', 'Radix', 'Tailwind', 'App Router', 'Auth'],
      entrypointUrl: '/open-source-library/shadcn-taxonomy/app/page.tsx',
      baseDir: '/open-source-library/shadcn-taxonomy/',
      previewType: 'dev_server'
    },
    {
      id: 'nextjs-boilerplate-saas',
      title: 'Next.js SaaS Boilerplate — Production App Router Architecture',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'Next.js + TypeScript + Tailwind',
      author: 'Ixartz',
      stars: '7.8k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/ixartz/Next-js-Boilerplate',
      description: 'Production-ready Next.js SaaS boilerplate with App Router, TypeScript, Tailwind CSS, ESLint, Prettier, and Husky hooks.',
      tags: ['Next.js', 'TypeScript', 'Tailwind', 'SaaS', 'ESLint', 'Boilerplate'],
      entrypointUrl: '/open-source-library/nextjs-boilerplate-saas/src/app/page.tsx',
      baseDir: '/open-source-library/nextjs-boilerplate-saas/',
      previewType: 'dev_server'
    },
    {
      id: 'horizon-ui-tailwind',
      title: 'Horizon UI — Clean Glassmorphism Admin & Analytics Dashboard',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'React + Tailwind CSS',
      author: 'Horizon UI',
      stars: '2.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/horizon-ui/horizon-tailwind-react',
      description: 'Trendiest open-source React admin dashboard featuring glassmorphism cards, ApexCharts widgets, NFT marketplace views, and dark mode.',
      tags: ['React', 'Tailwind', 'Dashboard', 'Analytics', 'Glassmorphism', 'Charts'],
      entrypointUrl: '/open-source-library/horizon-ui-tailwind/src/App.jsx',
      baseDir: '/open-source-library/horizon-ui-tailwind/',
      previewType: 'dev_server'
    },
    {
      id: 'scaffold-eth-2',
      title: 'Scaffold-ETH 2 — Full-Stack Web3 DApp Development Suite',
      category: '08-crypto-web3',
      categoryLabel: 'Web3 & Crypto DApps',
      framework: 'Next.js + RainbowKit + Wagmi + Viem',
      author: 'BuidlGuidl',
      stars: '3.2k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/scaffold-eth/scaffold-eth-2',
      description: 'Complete toolkit for building decentralized applications on Ethereum with smart contract debuggers and burner wallets.',
      tags: ['Web3', 'Ethereum', 'Next.js', 'RainbowKit', 'Wagmi', 'Viem', 'Smart Contracts'],
      entrypointUrl: '/open-source-library/scaffold-eth-2/packages/nextjs/app/page.tsx',
      baseDir: '/open-source-library/scaffold-eth-2/packages/nextjs/',
      previewType: 'dev_server'
    },
    {
      id: 'solana-dapp-scaffold',
      title: 'Solana DApp Scaffold — React Web3 Wallet & Program Hub',
      category: '08-crypto-web3',
      categoryLabel: 'Web3 & Crypto DApps',
      framework: 'Next.js + Solana Web3.js + Tailwind',
      author: 'Solana Labs',
      stars: '1.8k ★',
      license: 'Apache-2.0',
      repoUrl: 'https://github.com/solana-labs/dapp-scaffold',
      description: 'Official Solana decentralized application starter with Phantom/Backpack wallet adapter, RPC network selector, and token balances.',
      tags: ['Solana', 'Web3', 'Phantom', 'Wallet Adapter', 'Rust Programs', 'Next.js'],
      entrypointUrl: '/open-source-library/solana-dapp-scaffold/src/pages/index.tsx',
      baseDir: '/open-source-library/solana-dapp-scaffold/',
      previewType: 'dev_server'
    },
    {
      id: 'tailwind-nextjs-starter-blog',
      title: 'Tailwind Next.js Starter Blog — Rich Typography & MDX Content',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Next.js + Tailwind + Contentlayer',
      author: 'Timothy Lin',
      stars: '7.3k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/timlrx/tailwind-nextjs-starter-blog',
      description: 'The most popular Next.js blogging template with out-of-the-box dark mode, Pliny CMS integration, and math typesetting.',
      tags: ['Next.js', 'Tailwind', 'MDX', 'Contentlayer', 'Blog', 'Typography'],
      entrypointUrl: '/open-source-library/tailwind-nextjs-starter-blog/app/page.tsx',
      baseDir: '/open-source-library/tailwind-nextjs-starter-blog/',
      previewType: 'dev_server'
    },
    {
      id: 'precedent-starter',
      title: 'Precedent — Opinionated Next.js Foundation & Radix UI Kit',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'Next.js + Tailwind + Framer Motion',
      author: 'Steven Tey',
      stars: '5.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/steven-tey/precedent',
      description: 'High-craft Next.js starter featuring Framer Motion micro-animations, Lucide icons, modal managers, and Radix primitives.',
      tags: ['Next.js', 'Framer Motion', 'Radix UI', 'Tailwind', 'Landing', 'Modals'],
      entrypointUrl: '/open-source-library/precedent-starter/app/page.tsx',
      baseDir: '/open-source-library/precedent-starter/',
      previewType: 'dev_server'
    },
    {
      id: 'nextra-docs-theme',
      title: 'Nextra — Modern Markdown & Documentation Hub Theme',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Next.js + MDX + Tailwind',
      author: 'Shu Ding',
      stars: '10.8k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/shuding/nextra',
      description: 'Framework on top of Next.js that lets you build next-generation content-focused websites with simple MDX syntax.',
      tags: ['Nextra', 'Next.js', 'MDX', 'Docs', 'Dark Mode', 'Search'],
      entrypointUrl: '/open-source-library/nextra-docs-theme/pages/index.mdx',
      baseDir: '/open-source-library/nextra-docs-theme/',
      previewType: 'dev_server'
    },
    {
      id: 'shadcn-admin-vite',
      title: 'Shadcn Admin — Vite + React 18 Modular Dashboard Cockpit',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'Vite + React 18 + Shadcn UI',
      author: 'Sat Naing',
      stars: '4.5k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/satnaing/shadcn-admin',
      description: 'Fast, modular admin dashboard template built with React, Vite, Tailwind CSS, TanStack Table, and Shadcn UI components.',
      tags: ['React', 'Vite', 'Shadcn UI', 'Dashboard', 'TanStack Table', 'Cockpit'],
      entrypointUrl: '/open-source-library/shadcn-admin-vite/index.html',
      baseDir: '/open-source-library/shadcn-admin-vite/',
      previewType: 'dev_server'
    },
    {
      id: 'astrowind-marketing',
      title: 'AstroWind — High-Conversion Astro + Tailwind SaaS Landing',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'Astro 5 + Tailwind CSS',
      author: 'onWidget',
      stars: '3.9k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/onwidget/astrowind',
      description: 'Free, high-performance Astro template for startups and SaaS products with SEO, Open Graph images, and Tailwind styles.',
      tags: ['Astro', 'Tailwind', 'SaaS', 'Marketing', 'Landing', 'Fast'],
      entrypointUrl: '/open-source-library/astrowind-marketing/src/pages/index.astro',
      baseDir: '/open-source-library/astrowind-marketing/',
      previewType: 'dev_server'
    },
    {
      id: 'astro-cactus',
      title: 'Astro Cactus — Ultra-Clean Opinionated Blog & Portfolio',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Astro + Tailwind CSS',
      author: 'Chris Williams',
      stars: '3.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/chrismwilliams/astro-theme-cactus',
      description: 'Opinionated Astro theme with accessible dark mode, RSS, sitemap, SEO, and fast client page transitions.',
      tags: ['Astro', 'Tailwind', 'Cactus', 'Clean', 'Portfolio', 'Markdown'],
      entrypointUrl: '/open-source-library/astro-cactus/src/pages/index.astro',
      baseDir: '/open-source-library/astro-cactus/',
      previewType: 'dev_server'
    },
    {
      id: 'leerob-portfolio',
      title: 'Lee Robinson — Clean Minimalist Next.js Personal Site',
      category: '04-portfolios-resume',
      categoryLabel: 'Portfolios & Resumes',
      framework: 'Next.js App Router + Tailwind',
      author: 'Lee Robinson',
      stars: '6.7k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/leerob/leerob.io',
      description: 'Iconic personal portfolio and essay publication built with Next.js App Router, Tailwind CSS, and Postgres analytics.',
      tags: ['Next.js', 'Tailwind', 'Portfolio', 'Essays', 'App Router', 'Minimalist'],
      entrypointUrl: '/open-source-library/leerob-portfolio/app/page.tsx',
      baseDir: '/open-source-library/leerob-portfolio/',
      previewType: 'dev_server'
    },
    {
      id: 'nextjs-subscription-payments',
      title: 'Next.js Subscription Payments — Stripe + Supabase SaaS Starter',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'Next.js + Stripe + Supabase',
      author: 'Vercel',
      stars: '8.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/vercel/nextjs-subscription-payments',
      description: 'Complete high-converting SaaS subscription foundation with Stripe Checkout, customer billing portal, and Supabase Auth.',
      tags: ['Next.js', 'Stripe', 'Supabase', 'Payments', 'Subscriptions', 'SaaS'],
      entrypointUrl: '/open-source-library/nextjs-subscription-payments/app/page.tsx',
      baseDir: '/open-source-library/nextjs-subscription-payments/',
      previewType: 'dev_server'
    },
    {
      id: 'r3f-starter',
      title: 'React Three Fiber Starter — 3D WebGL Canvas Arena',
      category: '09-games-experiments',
      categoryLabel: '3D, Games & Experiments',
      framework: 'React + Three.js + R3F',
      author: 'Poimandres',
      stars: '26.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/pmndrs/react-three-fiber',
      description: 'Declarative Three.js WebGL canvas ecosystem with OrbitControls, PBR materials, bloom postprocessing, and 60 FPS animation loops.',
      tags: ['Three.js', 'WebGL', 'R3F', 'React', '3D Canvas', 'Shaders'],
      entrypointUrl: '/open-source-library/r3f-starter/packages/fiber/src/index.tsx',
      baseDir: '/open-source-library/r3f-starter/',
      previewType: 'dev_server'
    },
    {
      id: 'vitesse-vue-starter',
      title: 'Vitesse — Opinionated Vite + Vue 3 Starter Architecture',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'Vite + Vue 3 + UnoCSS',
      author: 'Anthony Fu',
      stars: '8.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/antfu/vitesse',
      description: 'The golden standard opinionated Vite starter template for Vue 3 with file-based routing, UnoCSS, i18n, and auto-imported components.',
      tags: ['Vue 3', 'Vite', 'UnoCSS', 'TypeScript', 'PWA', 'Fast'],
      entrypointUrl: '/open-source-library/vitesse-vue-starter/src/pages/index.vue',
      baseDir: '/open-source-library/vitesse-vue-starter/',
      previewType: 'dev_server'
    },
    {
      id: 'vitepress-docs',
      title: 'VitePress — Ultra-Fast Vite-Powered Documentation Generator',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Vite + Vue 3 + Markdown',
      author: 'Evan You',
      stars: '14.2k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/vuejs/vitepress',
      description: 'Vite & Vue-powered static site generator designed for building blazingly fast documentation hubs with instant hot-module reload.',
      tags: ['Vite', 'Vue 3', 'Docs', 'Markdown', 'Static Site', 'Speed'],
      entrypointUrl: '/open-source-library/vitepress-docs/docs/index.md',
      baseDir: '/open-source-library/vitepress-docs/',
      previewType: 'dev_server'
    },
    {
      id: 'tabler-html5-dashboard',
      title: 'Tabler — Premium HTML5 & Bootstrap Admin Architecture',
      category: '03-fullstack-saas',
      categoryLabel: 'Full-Stack Applications',
      framework: 'HTML5 + CSS3 + Vanilla JS',
      author: 'Tabler Team',
      stars: '36.5k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/tabler/tabler',
      description: 'World-famous open source web application UI kit with hundreds of responsive components, vector maps, charts, and auth layouts.',
      tags: ['HTML5', 'Dashboard', 'Admin', 'Bootstrap', 'Charts', 'Maps'],
      entrypointUrl: '/open-source-library/tabler-html5-dashboard/demo/index.html',
      baseDir: '/open-source-library/tabler-html5-dashboard/',
      previewType: 'static'
    },
    {
      id: 'ts-nextjs-tailwind-starter',
      title: 'TS Next.js Starter — Strict TypeScript & Scalable Architecture',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'Next.js + TypeScript + Tailwind',
      author: 'Theodorus Clarence',
      stars: '2.6k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/theodorusclarence/ts-nextjs-tailwind-starter',
      description: 'Developer-focused Next.js starter with strict TypeScript configs, SEO presets, components gallery, and light/dark theme toggles.',
      tags: ['Next.js', 'TypeScript', 'Tailwind', 'Architecture', 'Theme'],
      entrypointUrl: '/open-source-library/ts-nextjs-tailwind-starter/src/pages/index.tsx',
      baseDir: '/open-source-library/ts-nextjs-tailwind-starter/',
      previewType: 'dev_server'
    },
    {
      id: 'react-audio-synth-game',
      title: 'Web Audio Synthesizer & Canvas Visualizer Playground',
      category: '09-games-experiments',
      categoryLabel: '3D, Games & Experiments',
      framework: 'HTML5 + Web Audio API + Canvas',
      author: 'James Simpson',
      stars: '24.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/goldfire/howler.js',
      description: 'Interactive audio engine and frequency visualizer for browser games, spatial soundscapes, and procedural audio synthesis.',
      tags: ['Web Audio', 'Canvas', 'Visualizer', 'Game Audio', 'Interactive'],
      entrypointUrl: '/open-source-library/react-audio-synth-game/tests/index.html',
      baseDir: '/open-source-library/react-audio-synth-game/',
      previewType: 'static'
    },
    {
      id: 'astro-nano',
      title: 'Astro Nano — Ultra-Clean Developer Space & Showcase',
      category: '04-portfolios-resume',
      categoryLabel: 'Portfolios & Resumes',
      framework: 'Astro + Tailwind CSS',
      author: 'Mark Horn',
      stars: '2.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/markhorn-dev/astro-nano',
      description: 'Ultra-clean, lightweight portfolio and documentation blog with responsive typography, micro-interactions, and zero runtime JS payload.',
      tags: ['Astro', 'Tailwind', 'Clean', 'Portfolio', 'Lightweight', 'Markdown'],
      entrypointUrl: '/open-source-library/astro-nano/src/pages/index.astro',
      baseDir: '/open-source-library/astro-nano/',
      previewType: 'dev_server'
    },
    {
      id: 'shadcn-landing-page',
      title: 'Shadcn Landing Page — Modern Radix UI Kit Showcase',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'React + Vite + Shadcn UI',
      author: 'Leo Miranda',
      stars: '3.7k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/leoMirandaa/shadcn-landing-page',
      description: 'Complete landing page kit with hero animations, bento features, pricing tables, team showcase, and dark mode toggles.',
      tags: ['React', 'Shadcn UI', 'Tailwind', 'Vite', 'Bento', 'Animations'],
      entrypointUrl: '/open-source-library/shadcn-landing-page/index.html',
      baseDir: '/open-source-library/shadcn-landing-page/',
      previewType: 'dev_server'
    },
    {
      id: 'dopefolio',
      title: 'Dopefolio — High-Performance Multipurpose Portfolio',
      category: '04-portfolios-resume',
      categoryLabel: 'Portfolios & Resumes',
      framework: 'HTML5 + CSS3 + Vanilla JS',
      author: 'Ram Maheshwari',
      stars: '1.9k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/rammcodes/Dopefolio',
      description: 'Fast, responsive, and accessible developer portfolio template optimized for hiring managers, recruiters, and client showcases.',
      tags: ['HTML5', 'CSS3', 'Vanilla JS', 'Portfolio', 'Resume', 'Fast'],
      entrypointUrl: '/open-source-library/dopefolio/index.html',
      baseDir: '/open-source-library/dopefolio/',
      previewType: 'static'
    },
    {
      id: 'tailspark-devtool',
      title: 'Tailspark DevTool — Clean Developer Tools Landing Page',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'HTML5 + Tailwind CSS',
      author: 'Cruip',
      stars: '1.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/cruip/tailwind-landing-page-template',
      description: 'Minimalist developer landing page tailored for CLI tools, open-source APIs, SDK packages, and technical startups.',
      tags: ['Tailwind', 'Developer', 'Tools', 'API', 'Landing', 'HTML5'],
      entrypointUrl: '/open-source-library/tailspark-devtool/index.html',
      baseDir: '/open-source-library/tailspark-devtool/',
      previewType: 'static'
    },
    {
      id: 'astro-micro',
      title: 'Astro Micro — Minimal Theme with View Transitions',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Astro + Tailwind CSS',
      author: 'Trevor Tyler Lee',
      stars: '1.2k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/trevortylerlee/astro-micro',
      description: 'Accessible Astro blog theme featuring seamless View Transitions, interactive Table of Contents, and reading progress indicators.',
      tags: ['Astro', 'View Transitions', 'Tailwind', 'TOC', 'Blog', 'Typography'],
      entrypointUrl: '/open-source-library/astro-micro/src/pages/index.astro',
      baseDir: '/open-source-library/astro-micro/',
      previewType: 'dev_server'
    },
    {
      id: 'hyperui-ecommerce',
      title: 'HyperUI Commerce — Clean Component Storefront',
      category: '05-ecommerce-store',
      categoryLabel: 'E-Commerce & Stores',
      framework: 'Tailwind CSS + Alpine.js',
      author: 'Mark Mead',
      stars: '13.1k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/markmead/hyperui',
      description: 'Free open-source Tailwind CSS e-commerce layouts and marketing components designed for clean modern storefronts.',
      tags: ['Tailwind', 'E-Commerce', 'Storefront', 'Alpine.js', 'Components', 'Shop'],
      entrypointUrl: '/open-source-library/hyperui-ecommerce/index.html',
      baseDir: '/open-source-library/hyperui-ecommerce/',
      previewType: 'static'
    },
    {
      id: 'bchiang7-v4',
      title: 'Brittany Chiang v4 — Dark Emerald Developer Resume',
      category: '04-portfolios-resume',
      categoryLabel: 'Portfolios & Resumes',
      framework: 'React + Styled Components',
      author: 'Brittany Chiang',
      stars: '8.9k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/bchiang7/v4',
      description: 'The iconic dark emerald developer portfolio with smooth scrollspy navigation, experience timeline tabs, and project cards.',
      tags: ['React', 'Dark Emerald', 'Portfolio', 'Timeline', 'Icons', 'Scrollspy'],
      entrypointUrl: '/open-source-library/bchiang7-v4/src/pages/index.js',
      baseDir: '/open-source-library/bchiang7-v4/',
      previewType: 'dev_server'
    },
    {
      id: 'tailblocks',
      title: 'Tailblocks — Ready-to-use Modular Tailwind Layouts',
      category: '02-saas-landing',
      categoryLabel: 'SaaS & Landing Pages',
      framework: 'Tailwind CSS + HTML5',
      author: 'Mert Kahyaoğlu',
      stars: '18.2k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/mertjf/tailblocks',
      description: '60+ ready-to-use responsive Tailwind CSS blocks including heroes, bento grids, pricing cards, stats counters, and contact modals.',
      tags: ['Tailwind', 'Blocks', 'Heroes', 'Pricing', 'Grid', 'Modular'],
      entrypointUrl: '/open-source-library/tailblocks/index.html',
      baseDir: '/open-source-library/tailblocks/',
      previewType: 'static'
    },
    {
      id: 'starlight-docs-starter',
      title: 'Starlight Docs — High-Performance Documentation Hub',
      category: '01-blogs-content',
      categoryLabel: 'Blogs & Publishing',
      framework: 'Astro Starlight',
      author: 'Astro Core Team',
      stars: '6.4k ★',
      license: 'MIT',
      repoUrl: 'https://github.com/withastro/starlight',
      description: 'Everything you need to build a stellar documentation website: search, i18n, dark mode, code tabs, and table of contents.',
      tags: ['Astro', 'Starlight', 'Docs', 'Search', 'i18n', 'Markdown'],
      entrypointUrl: '/open-source-library/starlight-docs-starter/packages/starlight/index.ts',
      baseDir: '/open-source-library/starlight-docs-starter/',
      previewType: 'dev_server'
    }
  ];

  return {
    VERSION: VERSION,
    getAll: function() {
      return TEMPLATES.slice();
    },
    getById: function(id) {
      if (!id) return null;
      var match = id.toLowerCase().trim();
      for (var i = 0; i < TEMPLATES.length; i++) {
        if (TEMPLATES[i].id.toLowerCase() === match) return TEMPLATES[i];
      }
      return null;
    },
    getCategories: function() {
      var map = {};
      TEMPLATES.forEach(function(t) {
        if (!map[t.category]) {
          map[t.category] = { id: t.category, label: t.categoryLabel, count: 0 };
        }
        map[t.category].count++;
      });
      return Object.values(map);
    },
    getFrameworks: function() {
      var set = {};
      TEMPLATES.forEach(function(t) {
        set[t.framework] = (set[t.framework] || 0) + 1;
      });
      return Object.keys(set).map(function(k) {
        return { name: k, count: set[k] };
      });
    },
    search: function(opts) {
      opts = opts || {};
      var q = (opts.query || '').toLowerCase().trim();
      var cat = opts.category || 'all';
      var fw = opts.framework || 'all';

      return TEMPLATES.filter(function(t) {
        if (cat !== 'all' && t.category !== cat) return false;
        if (fw !== 'all' && t.framework !== fw) return false;
        if (q) {
          var matchTitle = t.title.toLowerCase().includes(q);
          var matchDesc = t.description.toLowerCase().includes(q);
          var matchAuthor = t.author.toLowerCase().includes(q);
          var matchTags = t.tags.some(function(tg) { return tg.toLowerCase().includes(q); });
          if (!matchTitle && !matchDesc && !matchAuthor && !matchTags) return false;
        }
        return true;
      });
    },
    getFeatured: function() {
      return TEMPLATES.slice(0, 8);
    }
  };
}));

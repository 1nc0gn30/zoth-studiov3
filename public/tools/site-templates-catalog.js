/**
 * Zoth's In-House Website Templates — 200+ Authentic In-House Web Applications & Sovereign Projects
 * Version: 4.5.0
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZothTemplatesCatalog = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '4.5.0';
  var LIBRARY_NAME = "Zoth's In-House Website Templates";

  var TEMPLATE_DATABASE = [
  {
    "id": "100-websites-in-30-days",
    "title": "100 Websites In 30 Days",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "100 Websites in 30 Days",
    "defaultPrompt": "Rebrand and deploy 100 Websites In 30 Days with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/100-websites-in-30-days/index.html",
    "baseDir": "/templates-source/06-learning-courses/100-websites-in-30-days/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/100-websites-in-30-days"
  },
  {
    "id": "2025-tackathon-website-MAXX-Potential",
    "title": "2025 Tackathon Website Maxx Potential",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy 2025 Tackathon Website Maxx Potential with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/2025-tackathon-website-MAXX-Potential/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/2025-tackathon-website-MAXX-Potential/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/2025-tackathon-website-MAXX-Potential"
  },
  {
    "id": "30-Days-Of-Python",
    "title": "30 Days Of Python",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "30 Days of Python",
    "defaultPrompt": "Rebrand and deploy 30 Days Of Python with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/30-Days-Of-Python/index.html",
    "baseDir": "/templates-source/06-learning-courses/30-Days-Of-Python/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/30-Days-Of-Python"
  },
  {
    "id": "30-Days-of-Python-Math",
    "title": "30 Days Of Python Math",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "30 Days of Python Math",
    "defaultPrompt": "Rebrand and deploy 30 Days Of Python Math with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/30-Days-of-Python-Math/index.html",
    "baseDir": "/templates-source/06-learning-courses/30-Days-of-Python-Math/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/30-Days-of-Python-Math"
  },
  {
    "id": "757-gas-shop-app",
    "title": "757 Gas Shop App",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "757 Gas Shop App",
    "defaultPrompt": "Rebrand and deploy 757 Gas Shop App with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/757-gas-shop-app/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/757-gas-shop-app/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/757-gas-shop-app"
  },
  {
    "id": "AI-Mastery-In-30-Days",
    "title": "Ai Mastery In 30 Days",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "AI Mastery in 30 Days",
    "defaultPrompt": "Rebrand and deploy Ai Mastery In 30 Days with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/AI-Mastery-In-30-Days/index.html",
    "baseDir": "/templates-source/06-learning-courses/AI-Mastery-In-30-Days/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/AI-Mastery-In-30-Days"
  },
  {
    "id": "AudioCipher",
    "title": "Audiocipher",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "AudioCipher by Tech Pro",
    "defaultPrompt": "Rebrand and deploy Audiocipher with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/AudioCipher/index.html",
    "baseDir": "/templates-source/11-tools-scripts/AudioCipher/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/AudioCipher"
  },
  {
    "id": "BOOMPOW",
    "title": "Boompow",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#fbbf24",
    "bg": "#0e0a05",
    "surface": "#1c1308",
    "description": "Boom Pow",
    "defaultPrompt": "Rebrand and deploy Boompow with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/BOOMPOW/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/BOOMPOW/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/BOOMPOW"
  },
  {
    "id": "Coffee-meetup",
    "title": "Coffee Meetup",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "vanilla",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Coffee Meetup with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Coffee-meetup/public/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Coffee-meetup/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/Coffee-meetup"
  },
  {
    "id": "Conscious-Cat-Guardianship",
    "title": "Conscious Cat Guardianship",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Conscious Cat Guardianship",
    "defaultPrompt": "Rebrand and deploy Conscious Cat Guardianship with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Conscious-Cat-Guardianship/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Conscious-Cat-Guardianship/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/Conscious-Cat-Guardianship"
  },
  {
    "id": "Duck-Duck-Ducky",
    "title": "Duck Duck Ducky",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Duck Duck Ducky with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Duck-Duck-Ducky/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Duck-Duck-Ducky/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/Duck-Duck-Ducky"
  },
  {
    "id": "Edgar-cayce-app",
    "title": "Edgar Cayce App",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "vanilla",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Edgar Cayce App with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Edgar-cayce-app/public/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Edgar-cayce-app/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/Edgar-cayce-app"
  },
  {
    "id": "Feral-tide-strategy",
    "title": "Feral Tide Strategy",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Feral Tide Strategy with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Feral-tide-strategy/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Feral-tide-strategy/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/Feral-tide-strategy"
  },
  {
    "id": "HTML-To-PDF-Invoice-Generator",
    "title": "Html To Pdf Invoice Generator",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "vanilla",
    "stack": [],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\ud83e\uddfe Invoice Generator (HTML + PDF Export)",
    "defaultPrompt": "Rebrand and deploy Html To Pdf Invoice Generator with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/HTML-To-PDF-Invoice-Generator/index.html",
    "baseDir": "/templates-source/11-tools-scripts/HTML-To-PDF-Invoice-Generator/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/HTML-To-PDF-Invoice-Generator"
  },
  {
    "id": "Hampton-Roads-Lawn-Care",
    "title": "Hampton Roads Lawn Care",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#34d399",
    "bg": "#040d08",
    "surface": "#09180e",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Hampton Roads Lawn Care with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/Hampton-Roads-Lawn-Care/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/Hampton-Roads-Lawn-Care/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/Hampton-Roads-Lawn-Care"
  },
  {
    "id": "Learn-PowerShell-In-30-Days",
    "title": "Learn Powershell In 30 Days",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance FreeCodeCamp, 30-day challenges, courses, tutorials application.",
    "defaultPrompt": "Rebrand and deploy Learn Powershell In 30 Days with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/Learn-PowerShell-In-30-Days/index.html",
    "baseDir": "/templates-source/06-learning-courses/Learn-PowerShell-In-30-Days/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/Learn-PowerShell-In-30-Days"
  },
  {
    "id": "Local-Business-Lead-Scanner",
    "title": "Local Business Lead Scanner",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Local Business Lead Scanner with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/Local-Business-Lead-Scanner/dist/index.html",
    "baseDir": "/templates-source/07-security-osint/Local-Business-Lead-Scanner/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "07-security-osint/Local-Business-Lead-Scanner"
  },
  {
    "id": "Mundane-Oracle",
    "title": "Mundane Oracle",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Mundane Oracle with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Mundane-Oracle/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Mundane-Oracle/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/Mundane-Oracle"
  },
  {
    "id": "Neon-Icon-The-Ultimate-Riff-Raff-Diction-Library-Generator",
    "title": "Neon Icon The Ultimate Riff Raff Diction Library Generator",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Neon Icon The Ultimate Riff Raff Diction Library Generator with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/Neon-Icon-The-Ultimate-Riff-Raff-Diction-Library-Generator/index.html",
    "baseDir": "/templates-source/11-tools-scripts/Neon-Icon-The-Ultimate-Riff-Raff-Diction-Library-Generator/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/Neon-Icon-The-Ultimate-Riff-Raff-Diction-Library-Generator"
  },
  {
    "id": "Netlify-Hall-of-Fame",
    "title": "Netlify Hall Of Fame",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Netlify Hall Of Fame with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/Netlify-Hall-of-Fame/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/Netlify-Hall-of-Fame/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/Netlify-Hall-of-Fame"
  },
  {
    "id": "O-N-E",
    "title": "O N E",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy O N E with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/O-N-E/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/O-N-E/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/O-N-E"
  },
  {
    "id": "Paws-and-Paths",
    "title": "Paws And Paths",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Paws and Paths Virginia Beach",
    "defaultPrompt": "Rebrand and deploy Paws And Paths with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Paws-and-Paths/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Paws-and-Paths/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/Paws-and-Paths"
  },
  {
    "id": "PiedPiper",
    "title": "Piedpiper",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Piedpiper with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/PiedPiper/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/PiedPiper/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/PiedPiper"
  },
  {
    "id": "PixelVerse",
    "title": "Pixelverse",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "astro"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#f43f5e",
    "bg": "#0a0512",
    "surface": "#140b24",
    "description": "\ud83c\udfa8 PixelVerse",
    "defaultPrompt": "Rebrand and deploy Pixelverse with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/PixelVerse/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/PixelVerse/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/PixelVerse"
  },
  {
    "id": "Quick-QR",
    "title": "Quick Qr",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "vanilla",
    "stack": [],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance CLI, scripts, generators, small utilities application.",
    "defaultPrompt": "Rebrand and deploy Quick Qr with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/Quick-QR/index.html",
    "baseDir": "/templates-source/11-tools-scripts/Quick-QR/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/Quick-QR"
  },
  {
    "id": "SignalBridge-AI",
    "title": "Signalbridge Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Signalbridge Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/SignalBridge-AI/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/SignalBridge-AI/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/SignalBridge-AI"
  },
  {
    "id": "SonicVision-AI",
    "title": "Sonicvision Ai",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Sonicvision Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/SonicVision-AI/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/SonicVision-AI/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/SonicVision-AI"
  },
  {
    "id": "SubSweep",
    "title": "Subsweep",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Subsweep with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/SubSweep/dist/index.html",
    "baseDir": "/templates-source/07-security-osint/SubSweep/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "07-security-osint/SubSweep"
  },
  {
    "id": "SunCycle",
    "title": "Suncycle",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "astro",
    "stack": [
      "node",
      "astro"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\u2600\ufe0f SunCycle",
    "defaultPrompt": "Rebrand and deploy Suncycle with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/SunCycle/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/SunCycle/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/SunCycle"
  },
  {
    "id": "Thumb-Journey",
    "title": "Thumb Journey",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Thumb Journey",
    "defaultPrompt": "Rebrand and deploy Thumb Journey with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Thumb-Journey/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Thumb-Journey/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/Thumb-Journey"
  },
  {
    "id": "Vite-Mui-React-Framer-Motion-Starter-App",
    "title": "Vite Mui React Framer Motion Starter App",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\u26a1 Vite + MUI + React + Framer Motion Starter App",
    "defaultPrompt": "Rebrand and deploy Vite Mui React Framer Motion Starter App with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/Vite-Mui-React-Framer-Motion-Starter-App/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/Vite-Mui-React-Framer-Motion-Starter-App/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/Vite-Mui-React-Framer-Motion-Starter-App"
  },
  {
    "id": "adytum-alchemist-ai-workflow",
    "title": "Adytum Alchemist Ai Workflow",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Adytum Alchemist Guide",
    "defaultPrompt": "Rebrand and deploy Adytum Alchemist Ai Workflow with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/adytum-alchemist-ai-workflow/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/adytum-alchemist-ai-workflow/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/adytum-alchemist-ai-workflow"
  },
  {
    "id": "aether",
    "title": "Aether",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "AETHER",
    "defaultPrompt": "Rebrand and deploy Aether with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/aether/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/aether/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/aether"
  },
  {
    "id": "aetheris",
    "title": "Aetheris",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Aetheris with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/aetheris/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/aetheris/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/aetheris"
  },
  {
    "id": "ai-agent-ui-gallery",
    "title": "Ai Agent Ui Gallery",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "AI Agent UI Gallery",
    "defaultPrompt": "Rebrand and deploy Ai Agent Ui Gallery with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/ai-agent-ui-gallery/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/ai-agent-ui-gallery/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/ai-agent-ui-gallery"
  },
  {
    "id": "ai-talk-ai-go",
    "title": "Ai Talk Ai Go",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Ai Talk Ai Go with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/ai-talk-ai-go/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/ai-talk-ai-go/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/ai-talk-ai-go"
  },
  {
    "id": "ai-university",
    "title": "Ai University",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "AI University",
    "defaultPrompt": "Rebrand and deploy Ai University with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/ai-university/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/ai-university/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/ai-university"
  },
  {
    "id": "aiandcoffee",
    "title": "Aiandcoffee",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "aiandcoffee",
    "defaultPrompt": "Rebrand and deploy Aiandcoffee with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/aiandcoffee/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/aiandcoffee/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "03-ai-agents-llm/aiandcoffee"
  },
  {
    "id": "all-pc-repair-2026",
    "title": "All Pc Repair 2026",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\u2699\ufe0f All PC Repair \u2014 Vite + React Web App",
    "defaultPrompt": "Rebrand and deploy All Pc Repair 2026 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/all-pc-repair-2026/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/all-pc-repair-2026/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/all-pc-repair-2026"
  },
  {
    "id": "all-your-wares",
    "title": "All Your Wares",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy All Your Wares with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/all-your-wares/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/all-your-wares/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/all-your-wares"
  },
  {
    "id": "astro-for-ai",
    "title": "Astro For Ai",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "astro",
    "stack": [
      "node",
      "astro"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Astro For AI",
    "defaultPrompt": "Rebrand and deploy Astro For Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/astro-for-ai/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/astro-for-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/astro-for-ai"
  },
  {
    "id": "aura-ai",
    "title": "Aura Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Aura by Tech Pro",
    "defaultPrompt": "Rebrand and deploy Aura Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/aura-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/aura-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/aura-ai"
  },
  {
    "id": "aura-map",
    "title": "Aura Map",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Aura Map with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/aura-map/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/aura-map/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/aura-map"
  },
  {
    "id": "avatar-studio",
    "title": "Avatar Studio",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Avatar Studio",
    "defaultPrompt": "Rebrand and deploy Avatar Studio with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/avatar-studio/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/avatar-studio/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/avatar-studio"
  },
  {
    "id": "badge3d-logo-to-coin-generator",
    "title": "Badge3D Logo To Coin Generator",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Badge3D - Logo to Coin Generator",
    "defaultPrompt": "Rebrand and deploy Badge3D Logo To Coin Generator with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/badge3d-logo-to-coin-generator/dist/index.html",
    "baseDir": "/templates-source/11-tools-scripts/badge3d-logo-to-coin-generator/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "11-tools-scripts/badge3d-logo-to-coin-generator"
  },
  {
    "id": "bautista-built",
    "title": "Bautista Built",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Bautista Built with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/bautista-built/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/bautista-built/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/bautista-built"
  },
  {
    "id": "bigger-picture-get-richer-inquiry",
    "title": "Bigger Picture Get Richer Inquiry",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "bigger-picture-get-richer-inquiry",
    "defaultPrompt": "Rebrand and deploy Bigger Picture Get Richer Inquiry with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/bigger-picture-get-richer-inquiry/index.html",
    "baseDir": "/templates-source/13-creative-media/bigger-picture-get-richer-inquiry/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/bigger-picture-get-richer-inquiry"
  },
  {
    "id": "blicki",
    "title": "Blicki",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Zoth Studio Team Tech Bliki",
    "defaultPrompt": "Rebrand and deploy Blicki with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/blicki/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/blicki/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/blicki"
  },
  {
    "id": "blockfans",
    "title": "Blockfans",
    "category": "08-crypto-web3",
    "categoryShort": "crypto-web3",
    "categoryLabel": "Crypto & Web3 DEX",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\ude90",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "BlockFans",
    "defaultPrompt": "Rebrand and deploy Blockfans with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/08-crypto-web3/blockfans/dist/index.html",
    "baseDir": "/templates-source/08-crypto-web3/blockfans/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "08-crypto-web3/blockfans"
  },
  {
    "id": "blog-template",
    "title": "Blog Template",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Blog Template with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/blog-template/public/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/blog-template/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/blog-template"
  },
  {
    "id": "boompowdesign",
    "title": "Boompowdesign",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#fbbf24",
    "bg": "#0e0a05",
    "surface": "#1c1308",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Boompowdesign with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/boompowdesign/index.html",
    "baseDir": "/templates-source/13-creative-media/boompowdesign/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/boompowdesign"
  },
  {
    "id": "brainwidth",
    "title": "Brainwidth",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "BrainBandwidth",
    "defaultPrompt": "Rebrand and deploy Brainwidth with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/brainwidth/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/brainwidth/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/brainwidth"
  },
  {
    "id": "budscan-ai",
    "title": "Budscan Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Budscan Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/budscan-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/budscan-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/budscan-ai"
  },
  {
    "id": "buildestimate-ai",
    "title": "Buildestimate Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Buildestimate Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/buildestimate-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/buildestimate-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/buildestimate-ai"
  },
  {
    "id": "bullseye",
    "title": "Bullseye",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Bullseye with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/bullseye/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/bullseye/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/bullseye"
  },
  {
    "id": "c-and-c-landservices",
    "title": "C And C Landservices",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "C&C Land Services \u2014 Website",
    "defaultPrompt": "Rebrand and deploy C And C Landservices with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/c-and-c-landservices/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/c-and-c-landservices/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/c-and-c-landservices"
  },
  {
    "id": "c-in-30-days",
    "title": "C In 30 Days",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#38bdf8",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "C in 30 Days",
    "defaultPrompt": "Rebrand and deploy C In 30 Days with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/c-in-30-days/index.html",
    "baseDir": "/templates-source/06-learning-courses/c-in-30-days/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/c-in-30-days"
  },
  {
    "id": "certpath-interactive-certification-roadmaps",
    "title": "Certpath Interactive Certification Roadmaps",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "CertPath: Interactive Certification Roadmaps",
    "defaultPrompt": "Rebrand and deploy Certpath Interactive Certification Roadmaps with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/certpath-interactive-certification-roadmaps/index.html",
    "baseDir": "/templates-source/11-tools-scripts/certpath-interactive-certification-roadmaps/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/certpath-interactive-certification-roadmaps"
  },
  {
    "id": "cisa-grc-study-portal",
    "title": "Cisa Grc Study Portal",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Cisa Grc Study Portal with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/cisa-grc-study-portal/dist/index.html",
    "baseDir": "/templates-source/07-security-osint/cisa-grc-study-portal/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "07-security-osint/cisa-grc-study-portal"
  },
  {
    "id": "creatorplaybooks",
    "title": "Creatorplaybooks",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "MayaGrowth - Creator Playbooks Platform",
    "defaultPrompt": "Rebrand and deploy Creatorplaybooks with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/creatorplaybooks/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/creatorplaybooks/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/creatorplaybooks"
  },
  {
    "id": "crypto-tracker-agent",
    "title": "Crypto Tracker Agent",
    "category": "08-crypto-web3",
    "categoryShort": "crypto-web3",
    "categoryLabel": "Crypto & Web3 DEX",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\ude90",
    "accent": "#c084fc",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Crypto Tracker Agent",
    "defaultPrompt": "Rebrand and deploy Crypto Tracker Agent with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/08-crypto-web3/crypto-tracker-agent/dist/index.html",
    "baseDir": "/templates-source/08-crypto-web3/crypto-tracker-agent/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "08-crypto-web3/crypto-tracker-agent"
  },
  {
    "id": "cyber-turtle",
    "title": "Cyber Turtle",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Cyber Turtle with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/cyber-turtle/index.html",
    "baseDir": "/templates-source/13-creative-media/cyber-turtle/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/cyber-turtle"
  },
  {
    "id": "datamosh-studio",
    "title": "Datamosh Studio",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Datamosh Studio with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/datamosh-studio/index.html",
    "baseDir": "/templates-source/13-creative-media/datamosh-studio/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/datamosh-studio"
  },
  {
    "id": "deepsearch-ai",
    "title": "Deepsearch Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Deepsearch Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/deepsearch-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/deepsearch-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/deepsearch-ai"
  },
  {
    "id": "deseo-media-company-maintenance",
    "title": "Deseo Media Company Maintenance",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Deseo Media Company Maintenance with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/deseo-media-company-maintenance/public/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/deseo-media-company-maintenance/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "03-ai-agents-llm/deseo-media-company-maintenance"
  },
  {
    "id": "deseomedia",
    "title": "Deseomedia",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Deseomedia with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/deseomedia/public/index.html",
    "baseDir": "/templates-source/13-creative-media/deseomedia/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/deseomedia"
  },
  {
    "id": "dunkin-donut-maker",
    "title": "Dunkin Donut Maker",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Dunkin Donut Maker with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/dunkin-donut-maker/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/dunkin-donut-maker/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/dunkin-donut-maker"
  },
  {
    "id": "echo-shrine",
    "title": "Echo Shrine",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Echo Shrine",
    "defaultPrompt": "Rebrand and deploy Echo Shrine with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/echo-shrine/index.html",
    "baseDir": "/templates-source/13-creative-media/echo-shrine/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/echo-shrine"
  },
  {
    "id": "edge-forge",
    "title": "Edge Forge",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Edge-Forge MVP",
    "defaultPrompt": "Rebrand and deploy Edge Forge with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/edge-forge/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/edge-forge/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/edge-forge"
  },
  {
    "id": "eliteconnectllc",
    "title": "Eliteconnectllc",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "astro",
    "stack": [
      "node",
      "astro"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Elite Connect Astro Rebuild",
    "defaultPrompt": "Rebrand and deploy Eliteconnectllc with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/eliteconnectllc/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/eliteconnectllc/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/eliteconnectllc"
  },
  {
    "id": "envguard-pro",
    "title": "Envguard Pro",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "EnvGuard Pro - Enterprise Secret Security",
    "defaultPrompt": "Rebrand and deploy Envguard Pro with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/envguard-pro/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/envguard-pro/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/envguard-pro"
  },
  {
    "id": "evergreenadulthomecare",
    "title": "Evergreenadulthomecare",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Evergreenadulthomecare with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/evergreenadulthomecare/public/index.html",
    "baseDir": "/templates-source/01-clients-services/evergreenadulthomecare/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "01-clients-services/evergreenadulthomecare"
  },
  {
    "id": "forge-and-fracture",
    "title": "Forge And Fracture",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Forge & Fracture",
    "defaultPrompt": "Rebrand and deploy Forge And Fracture with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/forge-and-fracture/index.html",
    "baseDir": "/templates-source/13-creative-media/forge-and-fracture/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/forge-and-fracture"
  },
  {
    "id": "fxckthesystem",
    "title": "Fxckthesystem",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Fxckthesystem with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/fxckthesystem/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/fxckthesystem/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/fxckthesystem"
  },
  {
    "id": "gav2",
    "title": "Gav2",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Gav2 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/gav2/index.html",
    "baseDir": "/templates-source/13-creative-media/gav2/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/gav2"
  },
  {
    "id": "gazzadm-app",
    "title": "Gazzadm App",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Gazzadm App with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/gazzadm-app/index.html",
    "baseDir": "/templates-source/13-creative-media/gazzadm-app/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/gazzadm-app"
  },
  {
    "id": "gorillafunk",
    "title": "Gorillafunk",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Gorillafunk with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/gorillafunk/public/index.html",
    "baseDir": "/templates-source/13-creative-media/gorillafunk/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/gorillafunk"
  },
  {
    "id": "gorillafunkskateboards",
    "title": "Gorillafunkskateboards",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Gorilla Funk Skateboards",
    "defaultPrompt": "Rebrand and deploy Gorillafunkskateboards with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/gorillafunkskateboards/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/gorillafunkskateboards/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/gorillafunkskateboards"
  },
  {
    "id": "green-horizon",
    "title": "Green Horizon",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Nature Harmony Landscaping",
    "defaultPrompt": "Rebrand and deploy Green Horizon with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/green-horizon/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/green-horizon/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/green-horizon"
  },
  {
    "id": "grindstone-athletics",
    "title": "Grindstone Athletics",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Grindstone Athletics with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/grindstone-athletics/public/index.html",
    "baseDir": "/templates-source/01-clients-services/grindstone-athletics/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "01-clients-services/grindstone-athletics"
  },
  {
    "id": "grip-and-grime-game-of-skate",
    "title": "Grip And Grime Game Of Skate",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Grip And Grime Game Of Skate with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/grip-and-grime-game-of-skate/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/grip-and-grime-game-of-skate/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/grip-and-grime-game-of-skate"
  },
  {
    "id": "gyro-spin-the-bottle",
    "title": "Gyro Spin The Bottle",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Gyro Spin The Bottle with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/gyro-spin-the-bottle/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/gyro-spin-the-bottle/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/gyro-spin-the-bottle"
  },
  {
    "id": "hack-the-world",
    "title": "Hack The World",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Hack The World",
    "defaultPrompt": "Rebrand and deploy Hack The World with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/hack-the-world/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/hack-the-world/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/hack-the-world"
  },
  {
    "id": "hacker-portfolio-v2",
    "title": "Hacker Portfolio V2",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#10b981",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Hacker Portfolio V2",
    "defaultPrompt": "Rebrand and deploy Hacker Portfolio V2 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/hacker-portfolio-v2/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/hacker-portfolio-v2/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/hacker-portfolio-v2"
  },
  {
    "id": "hermes-parrot-os-workhouse",
    "title": "Hermes Parrot Os Workhouse",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Agent Loom",
    "defaultPrompt": "Rebrand and deploy Hermes Parrot Os Workhouse with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/hermes-parrot-os-workhouse/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/hermes-parrot-os-workhouse/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/hermes-parrot-os-workhouse"
  },
  {
    "id": "i-got-you",
    "title": "I Got You",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy I Got You with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/i-got-you/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/i-got-you/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/i-got-you"
  },
  {
    "id": "idlekey",
    "title": "Idlekey",
    "category": "11-tools-scripts",
    "categoryShort": "tools-scripts",
    "categoryLabel": "Developer Utilities",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u2699\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "IdleKey",
    "defaultPrompt": "Rebrand and deploy Idlekey with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/11-tools-scripts/idlekey/index.html",
    "baseDir": "/templates-source/11-tools-scripts/idlekey/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "11-tools-scripts/idlekey"
  },
  {
    "id": "js-mastery-zero-to-hero",
    "title": "Js Mastery Zero To Hero",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Js Mastery Zero To Hero with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/js-mastery-zero-to-hero/index.html",
    "baseDir": "/templates-source/06-learning-courses/js-mastery-zero-to-hero/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/js-mastery-zero-to-hero"
  },
  {
    "id": "justice-stack",
    "title": "Justice Stack",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Justice Stack with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/justice-stack/index.html",
    "baseDir": "/templates-source/13-creative-media/justice-stack/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/justice-stack"
  },
  {
    "id": "justice-watch",
    "title": "Justice Watch",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "JusticeWatch",
    "defaultPrompt": "Rebrand and deploy Justice Watch with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/justice-watch/index.html",
    "baseDir": "/templates-source/13-creative-media/justice-watch/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/justice-watch"
  },
  {
    "id": "kane-korsos",
    "title": "Kane Korsos",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "stripe",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "kane-korsos",
    "defaultPrompt": "Rebrand and deploy Kane Korsos with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/kane-korsos/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/kane-korsos/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/kane-korsos"
  },
  {
    "id": "kids-hacker-game",
    "title": "Kids Hacker Game",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "vanilla",
    "stack": [
      "python",
      "python-app"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#10b981",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "KidGame3",
    "defaultPrompt": "Rebrand and deploy Kids Hacker Game with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/kids-hacker-game/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/kids-hacker-game/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/kids-hacker-game"
  },
  {
    "id": "kitchen-forge",
    "title": "Kitchen Forge",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Kitchen Forge with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/kitchen-forge/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/kitchen-forge/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/kitchen-forge"
  },
  {
    "id": "letsdoit",
    "title": "Letsdoit",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Navi \u2014 Hampton Roads Explorer",
    "defaultPrompt": "Rebrand and deploy Letsdoit with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/letsdoit/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/letsdoit/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/letsdoit"
  },
  {
    "id": "libsignal",
    "title": "Libsignal",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "vanilla",
    "stack": [
      "node",
      "rust",
      "java",
      "docker"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "> **\ud83d\udce3 If you were previously using libsignal from Maven or Gradle, our repository location has changed with the 0.86.6 release. See below for more information.**",
    "defaultPrompt": "Rebrand and deploy Libsignal with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/libsignal/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/libsignal/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "03-ai-agents-llm/libsignal"
  },
  {
    "id": "linguabot",
    "title": "Linguabot",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Linguabot with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/linguabot/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/linguabot/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/linguabot"
  },
  {
    "id": "lumina-builder",
    "title": "Lumina Builder",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Lumina Builder",
    "defaultPrompt": "Rebrand and deploy Lumina Builder with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/lumina-builder/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/lumina-builder/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/lumina-builder"
  },
  {
    "id": "mechshift-vr",
    "title": "Mechshift Vr",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Mechshift Vr with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/mechshift-vr/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/mechshift-vr/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/mechshift-vr"
  },
  {
    "id": "mentorship-marketplace",
    "title": "Mentorship Marketplace",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Unstuck",
    "defaultPrompt": "Rebrand and deploy Mentorship Marketplace with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/mentorship-marketplace/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/mentorship-marketplace/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/mentorship-marketplace"
  },
  {
    "id": "migratex",
    "title": "Migratex",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Migratex with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/migratex/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/migratex/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/migratex"
  },
  {
    "id": "mosesart",
    "title": "Mosesart",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Moses Art",
    "defaultPrompt": "Rebrand and deploy Mosesart with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/mosesart/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/mosesart/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/mosesart"
  },
  {
    "id": "multi-page-portfolio",
    "title": "Multi Page Portfolio",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Description",
    "defaultPrompt": "Rebrand and deploy Multi Page Portfolio with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/multi-page-portfolio/public/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/multi-page-portfolio/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "05-portfolio-agency/multi-page-portfolio"
  },
  {
    "id": "neal-bliki",
    "title": "Neal Bliki",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->",
    "defaultPrompt": "Rebrand and deploy Neal Bliki with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/neal-bliki/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/neal-bliki/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/neal-bliki"
  },
  {
    "id": "neon-pulse",
    "title": "Neon Pulse",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Neon Pulse",
    "defaultPrompt": "Rebrand and deploy Neon Pulse with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/neon-pulse/index.html",
    "baseDir": "/templates-source/13-creative-media/neon-pulse/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/neon-pulse"
  },
  {
    "id": "neowardrive",
    "title": "Neowardrive",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "neowardrive",
    "defaultPrompt": "Rebrand and deploy Neowardrive with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/neowardrive/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/neowardrive/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/neowardrive"
  },
  {
    "id": "netlify-cli-agent-runner",
    "title": "Netlify Cli Agent Runner",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "netlify-cli-agent-runner",
    "defaultPrompt": "Rebrand and deploy Netlify Cli Agent Runner with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/netlify-cli-agent-runner/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/netlify-cli-agent-runner/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/netlify-cli-agent-runner"
  },
  {
    "id": "netlify-client-dev-portal",
    "title": "Netlify Client Dev Portal",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Netlify Client Dev Portal with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/netlify-client-dev-portal/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/netlify-client-dev-portal/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/netlify-client-dev-portal"
  },
  {
    "id": "nexus",
    "title": "Nexus",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Nexus with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/nexus/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/nexus/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/nexus"
  },
  {
    "id": "nexus-3d-editor",
    "title": "Nexus 3D Editor",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Nexus 3D Editor with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/nexus-3d-editor/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/nexus-3d-editor/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/nexus-3d-editor"
  },
  {
    "id": "nfc-link-hub",
    "title": "Nfc Link Hub",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Nfc Link Hub with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/nfc-link-hub/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/nfc-link-hub/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/nfc-link-hub"
  },
  {
    "id": "nft2026",
    "title": "Nft2026",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Nft2026 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/nft2026/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/nft2026/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/nft2026"
  },
  {
    "id": "nftech-api",
    "title": "Nftech Api",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "vanilla",
    "stack": [
      "node"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "// README.md",
    "defaultPrompt": "Rebrand and deploy Nftech Api with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/nftech-api/public/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/nftech-api/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "05-portfolio-agency/nftech-api"
  },
  {
    "id": "nona-2026",
    "title": "Nona 2026",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Nona",
    "defaultPrompt": "Rebrand and deploy Nona 2026 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/nona-2026/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/nona-2026/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/nona-2026"
  },
  {
    "id": "nova-os-analytics",
    "title": "Nova Os Analytics",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Nova OS Analytics",
    "defaultPrompt": "Rebrand and deploy Nova Os Analytics with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/nova-os-analytics/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/nova-os-analytics/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/nova-os-analytics"
  },
  {
    "id": "nullai-ui",
    "title": "Nullai Ui",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Nullai",
    "defaultPrompt": "Rebrand and deploy Nullai Ui with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/nullai-ui/dist/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/nullai-ui/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "02-netlify-ax-creator/nullai-ui"
  },
  {
    "id": "nullai2026",
    "title": "Nullai2026",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Nullai",
    "defaultPrompt": "Rebrand and deploy Nullai2026 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/nullai2026/dist/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/nullai2026/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "02-netlify-ax-creator/nullai2026"
  },
  {
    "id": "off-grid-survival-ai",
    "title": "Off Grid Survival Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "python",
      "vite",
      "python-app"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Off-Grid Survival and AI",
    "defaultPrompt": "Rebrand and deploy Off Grid Survival Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/off-grid-survival-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/off-grid-survival-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/off-grid-survival-ai"
  },
  {
    "id": "omnipost",
    "title": "Omnipost",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "OmniPost - Social Media Manager",
    "defaultPrompt": "Rebrand and deploy Omnipost with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/omnipost/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/omnipost/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/omnipost"
  },
  {
    "id": "one-shot",
    "title": "One Shot",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "ONE SHOT",
    "defaultPrompt": "Rebrand and deploy One Shot with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/one-shot/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/one-shot/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/one-shot"
  },
  {
    "id": "optimalism",
    "title": "Optimalism",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "vanilla",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Optimalism: The Longevity Sandbox",
    "defaultPrompt": "Rebrand and deploy Optimalism with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/optimalism/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/optimalism/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/optimalism"
  },
  {
    "id": "origin-cacao",
    "title": "Origin Cacao",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "ORIGIN Cacao | Oceanfront Waitlist",
    "defaultPrompt": "Rebrand and deploy Origin Cacao with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/origin-cacao/index.html",
    "baseDir": "/templates-source/13-creative-media/origin-cacao/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/origin-cacao"
  },
  {
    "id": "packageforge",
    "title": "Packageforge",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "PackageForge AI",
    "defaultPrompt": "Rebrand and deploy Packageforge with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/packageforge/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/packageforge/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/packageforge"
  },
  {
    "id": "powerapp-templates",
    "title": "Powerapp Templates",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Powerapp Templates with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/powerapp-templates/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/powerapp-templates/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/powerapp-templates"
  },
  {
    "id": "prepped-pigeon",
    "title": "Prepped Pigeon",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Prepped Pigeon with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/prepped-pigeon/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/prepped-pigeon/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/prepped-pigeon"
  },
  {
    "id": "procrastinator-pro",
    "title": "Procrastinator Pro",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Procrastinator Pro with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/procrastinator-pro/index.html",
    "baseDir": "/templates-source/13-creative-media/procrastinator-pro/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/procrastinator-pro"
  },
  {
    "id": "promptmaster",
    "title": "Promptmaster",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "PromptMaster",
    "defaultPrompt": "Rebrand and deploy Promptmaster with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/promptmaster/index.html",
    "baseDir": "/templates-source/13-creative-media/promptmaster/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/promptmaster"
  },
  {
    "id": "reflection",
    "title": "Reflection",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Reflection with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/reflection/index.html",
    "baseDir": "/templates-source/13-creative-media/reflection/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/reflection"
  },
  {
    "id": "reusable-tech-portfolio",
    "title": "Reusable Tech Portfolio",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Portfolio Web App",
    "defaultPrompt": "Rebrand and deploy Reusable Tech Portfolio with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/reusable-tech-portfolio/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/reusable-tech-portfolio/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/reusable-tech-portfolio"
  },
  {
    "id": "security-champions-playbook",
    "title": "Security Champions Playbook",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "[![Mentioned in Awesome DevSecOps](https://awesome.re/mentioned-badge-flat.svg)](https://github.com/devsecops/awesome-devsecopsguidelines)",
    "defaultPrompt": "Rebrand and deploy Security Champions Playbook with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/security-champions-playbook/index.html",
    "baseDir": "/templates-source/07-security-osint/security-champions-playbook/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "07-security-osint/security-champions-playbook"
  },
  {
    "id": "signalnest",
    "title": "Signalnest",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "SignalNest",
    "defaultPrompt": "Rebrand and deploy Signalnest with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/signalnest/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/signalnest/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/signalnest"
  },
  {
    "id": "single-page-portfolio-1",
    "title": "Single Page Portfolio 1",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Portfolio Template",
    "defaultPrompt": "Rebrand and deploy Single Page Portfolio 1 with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/single-page-portfolio-1/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/single-page-portfolio-1/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/single-page-portfolio-1"
  },
  {
    "id": "skate-archive-heaven",
    "title": "Skate Archive Heaven",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Skate Archive Heaven",
    "defaultPrompt": "Rebrand and deploy Skate Archive Heaven with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/skate-archive-heaven/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/skate-archive-heaven/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/skate-archive-heaven"
  },
  {
    "id": "sloppy-joes-ai-slop",
    "title": "Sloppy Joes Ai Slop",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Sloppy Joes Ai Slop with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/sloppy-joes-ai-slop/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/sloppy-joes-ai-slop/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/sloppy-joes-ai-slop"
  },
  {
    "id": "solanaworldmap",
    "title": "Solanaworldmap",
    "category": "08-crypto-web3",
    "categoryShort": "crypto-web3",
    "categoryLabel": "Crypto & Web3 DEX",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\ude90",
    "accent": "#c084fc",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Solana World Map",
    "defaultPrompt": "Rebrand and deploy Solanaworldmap with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/08-crypto-web3/solanaworldmap/dist/index.html",
    "baseDir": "/templates-source/08-crypto-web3/solanaworldmap/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "08-crypto-web3/solanaworldmap"
  },
  {
    "id": "stoicism",
    "title": "Stoicism",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Stoicism with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/stoicism/index.html",
    "baseDir": "/templates-source/13-creative-media/stoicism/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/stoicism"
  },
  {
    "id": "stoicism-nft",
    "title": "Stoicism Nft",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Stoicism Archive",
    "defaultPrompt": "Rebrand and deploy Stoicism Nft with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/stoicism-nft/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/stoicism-nft/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/stoicism-nft"
  },
  {
    "id": "street-fighter-arcade",
    "title": "Street Fighter Arcade",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Street Fighter Arcade",
    "defaultPrompt": "Rebrand and deploy Street Fighter Arcade with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/street-fighter-arcade/dist/index.html",
    "baseDir": "/templates-source/09-games-experiments/street-fighter-arcade/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "09-games-experiments/street-fighter-arcade"
  },
  {
    "id": "stripe-mastery-hub",
    "title": "Stripe Mastery Hub",
    "category": "06-learning-courses",
    "categoryShort": "learning-courses",
    "categoryLabel": "Courses & 30-Day Challenges",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcda",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Stripe Mastery Hub with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/06-learning-courses/stripe-mastery-hub/index.html",
    "baseDir": "/templates-source/06-learning-courses/stripe-mastery-hub/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "06-learning-courses/stripe-mastery-hub"
  },
  {
    "id": "tech-pro",
    "title": "Tech Pro",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "astro"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "757TECH.PRO",
    "defaultPrompt": "Rebrand and deploy Tech Pro with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/tech-pro/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/tech-pro/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/tech-pro"
  },
  {
    "id": "th34ll-react-supabase-app",
    "title": "Th34Ll React Supabase App",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Th34Ll React Supabase App with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/th34ll-react-supabase-app/public/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/th34ll-react-supabase-app/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/th34ll-react-supabase-app"
  },
  {
    "id": "the-con-archive",
    "title": "The Con Archive",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy The Con Archive with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/the-con-archive/index.html",
    "baseDir": "/templates-source/13-creative-media/the-con-archive/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/the-con-archive"
  },
  {
    "id": "the-gazette-hub",
    "title": "The Gazette Hub",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "The Gazette Hub",
    "defaultPrompt": "Rebrand and deploy The Gazette Hub with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/the-gazette-hub/index.html",
    "baseDir": "/templates-source/13-creative-media/the-gazette-hub/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/the-gazette-hub"
  },
  {
    "id": "the-greene-strategist",
    "title": "The Greene Strategist",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy The Greene Strategist with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/the-greene-strategist/index.html",
    "baseDir": "/templates-source/13-creative-media/the-greene-strategist/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/the-greene-strategist"
  },
  {
    "id": "tidepoint-strategic",
    "title": "Tidepoint Strategic",
    "category": "01-clients-services",
    "categoryShort": "clients-services",
    "categoryLabel": "Client & Local Services",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbc",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Tidepoint Strategic with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/01-clients-services/tidepoint-strategic/dist/index.html",
    "baseDir": "/templates-source/01-clients-services/tidepoint-strategic/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "01-clients-services/tidepoint-strategic"
  },
  {
    "id": "tidewaterskateshop",
    "title": "Tidewaterskateshop",
    "category": "09-games-experiments",
    "categoryShort": "games-experiments",
    "categoryLabel": "Games & Interactive Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfae",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Tidewaterskateshop with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/09-games-experiments/tidewaterskateshop/index.html",
    "baseDir": "/templates-source/09-games-experiments/tidewaterskateshop/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "09-games-experiments/tidewaterskateshop"
  },
  {
    "id": "ufo-crop-circle",
    "title": "Ufo Crop Circle",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\ud83d\udef8 Crop Circles \u2014 UFO Experience",
    "defaultPrompt": "Rebrand and deploy Ufo Crop Circle with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/ufo-crop-circle/index.html",
    "baseDir": "/templates-source/13-creative-media/ufo-crop-circle/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/ufo-crop-circle"
  },
  {
    "id": "unthink-ai",
    "title": "Unthink Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Unthink AI",
    "defaultPrompt": "Rebrand and deploy Unthink Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/unthink-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/unthink-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/unthink-ai"
  },
  {
    "id": "url-shortener",
    "title": "Url Shortener",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + Vite",
    "defaultPrompt": "Rebrand and deploy Url Shortener with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/url-shortener/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/url-shortener/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/url-shortener"
  },
  {
    "id": "v-edge-vegan-pizza",
    "title": "V Edge Vegan Pizza",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy V Edge Vegan Pizza with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/v-edge-vegan-pizza/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/v-edge-vegan-pizza/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/v-edge-vegan-pizza"
  },
  {
    "id": "vbtv",
    "title": "Vbtv",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Standalone web apps, SaaS, product experiments application.",
    "defaultPrompt": "Rebrand and deploy Vbtv with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/vbtv/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/vbtv/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/vbtv"
  },
  {
    "id": "veganify-ai",
    "title": "Veganify Ai",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Veganify Ai with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/veganify-ai/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/veganify-ai/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/veganify-ai"
  },
  {
    "id": "virtualcoffee",
    "title": "Virtualcoffee",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Virtual Coffee \u00b7 @buildwithmaya",
    "defaultPrompt": "Rebrand and deploy Virtualcoffee with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/virtualcoffee/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/virtualcoffee/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/virtualcoffee"
  },
  {
    "id": "vision-link",
    "title": "Vision Link",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Vision Link: Face & Hand Control",
    "defaultPrompt": "Rebrand and deploy Vision Link with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/vision-link/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/vision-link/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/vision-link"
  },
  {
    "id": "website",
    "title": "Website",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Getting Started with Create React App",
    "defaultPrompt": "Rebrand and deploy Website with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/website/public/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/website/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "04-web-apps-saas/website"
  },
  {
    "id": "website-fuzzer-clean",
    "title": "Website Fuzzer Clean",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "\ud83e\udde0 Payload Visualizer",
    "defaultPrompt": "Rebrand and deploy Website Fuzzer Clean with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/website-fuzzer-clean/index.html",
    "baseDir": "/templates-source/07-security-osint/website-fuzzer-clean/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "07-security-osint/website-fuzzer-clean"
  },
  {
    "id": "what-would-henry-ford-do",
    "title": "What Would Henry Ford Do",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "WWHFD - What Would Henry Ford Do?",
    "defaultPrompt": "Rebrand and deploy What Would Henry Ford Do with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/what-would-henry-ford-do/index.html",
    "baseDir": "/templates-source/13-creative-media/what-would-henry-ford-do/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/what-would-henry-ford-do"
  },
  {
    "id": "winner-winner-chicken-dinner",
    "title": "Winner Winner Chicken Dinner",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Blackjack Trainer: Count Lab",
    "defaultPrompt": "Rebrand and deploy Winner Winner Chicken Dinner with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/winner-winner-chicken-dinner/index.html",
    "baseDir": "/templates-source/13-creative-media/winner-winner-chicken-dinner/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/winner-winner-chicken-dinner"
  },
  {
    "id": "yell-space",
    "title": "Yell Space",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Yell Space",
    "defaultPrompt": "Rebrand and deploy Yell Space with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/yell-space/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/yell-space/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/yell-space"
  },
  {
    "id": "youtubemixtube",
    "title": "Youtubemixtube",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "<div align=\"center\">",
    "defaultPrompt": "Rebrand and deploy Youtubemixtube with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/youtubemixtube/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/youtubemixtube/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/youtubemixtube"
  },
  {
    "id": "zen-breathing-companion",
    "title": "Zen Breathing Companion",
    "category": "04-web-apps-saas",
    "categoryShort": "web-apps-saas",
    "categoryLabel": "Web Apps & SaaS",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udcbb",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Zen Breathing Companion",
    "defaultPrompt": "Rebrand and deploy Zen Breathing Companion with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/04-web-apps-saas/zen-breathing-companion/dist/index.html",
    "baseDir": "/templates-source/04-web-apps-saas/zen-breathing-companion/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "04-web-apps-saas/zen-breathing-companion"
  },
  {
    "id": "zoth",
    "title": "Zoth",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "NULL AI Agent Framework",
    "defaultPrompt": "Rebrand and deploy Zoth with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/zoth/public/index.html",
    "baseDir": "/templates-source/13-creative-media/zoth/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/zoth"
  },
  {
    "id": "agent-ax",
    "title": "Agent Ax",
    "category": "02-netlify-ax-creator",
    "categoryShort": "netlify-ax-creator",
    "categoryLabel": "Netlify & Creator Tools",
    "framework": "vanilla",
    "stack": [
      "node"
    ],
    "icon": "\u26a1",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance Netlify, AX, CreatorKit, Codex, OpenClaw tooling application.",
    "defaultPrompt": "Rebrand and deploy Agent Ax with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/02-netlify-ax-creator/agent-ax/public/index.html",
    "baseDir": "/templates-source/02-netlify-ax-creator/agent-ax/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "02-netlify-ax-creator/agent-ax"
  },
  {
    "id": "agent-loom",
    "title": "Agent Loom",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Agent Loom",
    "defaultPrompt": "Rebrand and deploy Agent Loom with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/agent-loom/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/agent-loom/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/agent-loom"
  },
  {
    "id": "backup-drive-navigator",
    "title": "Backup Drive Navigator",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Backup Drive Navigator",
    "defaultPrompt": "Rebrand and deploy Backup Drive Navigator with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/backup-drive-navigator/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/backup-drive-navigator/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/backup-drive-navigator"
  },
  {
    "id": "badgeblast",
    "title": "Badgeblast",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "BadgeBlast",
    "defaultPrompt": "Rebrand and deploy Badgeblast with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/badgeblast/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/badgeblast/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/badgeblast"
  },
  {
    "id": "cyphertag",
    "title": "Cyphertag",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "CypherTag",
    "defaultPrompt": "Rebrand and deploy Cyphertag with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/cyphertag/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/cyphertag/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/cyphertag"
  },
  {
    "id": "data-explorer",
    "title": "Data Explorer",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Data Explorer",
    "defaultPrompt": "Rebrand and deploy Data Explorer with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/data-explorer/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/data-explorer/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/data-explorer"
  },
  {
    "id": "gaploom",
    "title": "Gaploom",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + TypeScript + Vite",
    "defaultPrompt": "Rebrand and deploy Gaploom with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/gaploom/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/gaploom/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/gaploom"
  },
  {
    "id": "holo-audio",
    "title": "Holo Audio",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Holo Audio",
    "defaultPrompt": "Rebrand and deploy Holo Audio with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/holo-audio/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/holo-audio/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/holo-audio"
  },
  {
    "id": "hotappsummer-wisdom",
    "title": "Hotappsummer Wisdom",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Hot App Summer \u2014 Wisdom Library",
    "defaultPrompt": "Rebrand and deploy Hotappsummer Wisdom with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/hotappsummer-wisdom/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/hotappsummer-wisdom/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/hotappsummer-wisdom"
  },
  {
    "id": "insanevisualssssss",
    "title": "Insanevisualssssss",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "threejs",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Insane Visuals",
    "defaultPrompt": "Rebrand and deploy Insanevisualssssss with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/insanevisualssssss/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/insanevisualssssss/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/insanevisualssssss"
  },
  {
    "id": "jordanbelford",
    "title": "Jordanbelford",
    "category": "05-portfolio-agency",
    "categoryShort": "portfolio-agency",
    "categoryLabel": "Portfolios & Agencies",
    "framework": "react",
    "stack": [
      "node",
      "python",
      "vite",
      "python-app"
    ],
    "icon": "\ud83c\udfa8",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "StraightLine Desk",
    "defaultPrompt": "Rebrand and deploy Jordanbelford with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/05-portfolio-agency/jordanbelford/dist/index.html",
    "baseDir": "/templates-source/05-portfolio-agency/jordanbelford/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "05-portfolio-agency/jordanbelford"
  },
  {
    "id": "mayagrowth",
    "title": "Mayagrowth",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "MayaGrowth - Creator Playbooks Platform",
    "defaultPrompt": "Rebrand and deploy Mayagrowth with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/mayagrowth/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/mayagrowth/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/mayagrowth"
  },
  {
    "id": "mayaideaforapp",
    "title": "Mayaideaforapp",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Unstuck",
    "defaultPrompt": "Rebrand and deploy Mayaideaforapp with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/mayaideaforapp/dist/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/mayaideaforapp/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "03-ai-agents-llm/mayaideaforapp"
  },
  {
    "id": "neon-annotate",
    "title": "Neon Annotate",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Neon Annotate",
    "defaultPrompt": "Rebrand and deploy Neon Annotate with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/neon-annotate/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/neon-annotate/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/neon-annotate"
  },
  {
    "id": "neural-city",
    "title": "Neural City",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Neural City",
    "defaultPrompt": "Rebrand and deploy Neural City with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/neural-city/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/neural-city/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/neural-city"
  },
  {
    "id": "painting-site",
    "title": "Painting Site",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance 3D, video, audio, art, design, visual experiments application.",
    "defaultPrompt": "Rebrand and deploy Painting Site with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/painting-site/index.html",
    "baseDir": "/templates-source/13-creative-media/painting-site/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/painting-site"
  },
  {
    "id": "precision-paint-pro",
    "title": "Precision Paint Pro",
    "category": "03-ai-agents-llm",
    "categoryShort": "ai-agents-llm",
    "categoryLabel": "AI Agents & LLM Apps",
    "framework": "vanilla",
    "stack": [],
    "icon": "\ud83e\udd16",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "High-performance AI / LLM / agent / chatbot experiments application.",
    "defaultPrompt": "Rebrand and deploy Precision Paint Pro with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/03-ai-agents-llm/precision-paint-pro/index.html",
    "baseDir": "/templates-source/03-ai-agents-llm/precision-paint-pro/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "03-ai-agents-llm/precision-paint-pro"
  },
  {
    "id": "privacy-toolbelt",
    "title": "Privacy Toolbelt",
    "category": "07-security-osint",
    "categoryShort": "security-osint",
    "categoryLabel": "Security & OSINT Tools",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83d\udee1\ufe0f",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Privacy Toolbelt",
    "defaultPrompt": "Rebrand and deploy Privacy Toolbelt with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/07-security-osint/privacy-toolbelt/dist/index.html",
    "baseDir": "/templates-source/07-security-osint/privacy-toolbelt/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "07-security-osint/privacy-toolbelt"
  },
  {
    "id": "regexdroid",
    "title": "Regexdroid",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "RegexDroid",
    "defaultPrompt": "Rebrand and deploy Regexdroid with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/regexdroid/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/regexdroid/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/regexdroid"
  },
  {
    "id": "schema-illustrator",
    "title": "Schema Illustrator",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "Schema Illustrator",
    "defaultPrompt": "Rebrand and deploy Schema Illustrator with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/schema-illustrator/dist/index.html",
    "baseDir": "/templates-source/13-creative-media/schema-illustrator/dist/",
    "hasLiveBuild": true,
    "fileType": "dist",
    "relativePath": "13-creative-media/schema-illustrator"
  },
  {
    "id": "vector-search",
    "title": "Vector Search",
    "category": "13-creative-media",
    "categoryShort": "creative-media",
    "categoryLabel": "3D & Creative Media",
    "framework": "react",
    "stack": [
      "node",
      "vite"
    ],
    "icon": "\ud83c\udfac",
    "accent": "#00f0ff",
    "bg": "#050711",
    "surface": "#0c1122",
    "description": "React + TypeScript + Vite",
    "defaultPrompt": "Rebrand and deploy Vector Search with tailored services catalog, custom branding, and conversion optimization.",
    "entrypointUrl": "/templates-source/13-creative-media/vector-search/index.html",
    "baseDir": "/templates-source/13-creative-media/vector-search/",
    "hasLiveBuild": true,
    "fileType": "static",
    "relativePath": "13-creative-media/vector-search"
  }
];

  var CATEGORIES_METADATA = {
  "00-workspaces": "Multi-app workspace containers",
  "01-clients-services": "Business / client websites and local service apps",
  "02-netlify-ax-creator": "Netlify, AX, CreatorKit, Codex, OpenClaw tooling",
  "03-ai-agents-llm": "AI / LLM / agent / chatbot experiments",
  "04-web-apps-saas": "Standalone web apps, SaaS, product experiments",
  "05-portfolio-agency": "Portfolio, agency, personal brand sites",
  "06-learning-courses": "FreeCodeCamp, 30-day challenges, courses, tutorials",
  "07-security-osint": "Security, OSINT, scraping, infosec tools",
  "08-crypto-web3": "Solana, NFT, crypto, blockchain projects",
  "09-games-experiments": "Games, skate, arcade, VR, creative toys",
  "10-python-tools": "Streamlit / Python utilities",
  "11-tools-scripts": "CLI, scripts, generators, small utilities",
  "12-rust": "Rust projects",
  "13-creative-media": "3D, video, audio, art, design, visual experiments",
  "14-uncategorized": "Needs manual review"
};

  var ZothTemplatesCatalog = {
    VERSION: VERSION,

    getCount: function() {
      return TEMPLATE_DATABASE.length;
    },

    getAll: function() {
      return TEMPLATE_DATABASE.slice();
    },

    getById: function(id) {
      if (!id || typeof id !== 'string') return null;
      var clean = id.trim().toLowerCase();
      for (var i = 0; i < TEMPLATE_DATABASE.length; i++) {
        if (TEMPLATE_DATABASE[i].id.toLowerCase() === clean) {
          return Object.assign({}, TEMPLATE_DATABASE[i]);
        }
      }
      return null;
    },

    getCount: function() {
      return TEMPLATE_DATABASE.length;
    },

    getCategories: function() {
      var map = {};
      TEMPLATE_DATABASE.forEach(function(t) {
        if (!map[t.category]) {
          map[t.category] = {
            id: t.category,
            label: t.categoryLabel || t.categoryShort || t.category,
            short: t.categoryLabel || t.categoryShort || t.category,
            icon: t.icon || '⚡',
            count: 0
          };
        }
        map[t.category].count++;
      });
      return Object.values(map);
    },

    getFrameworks: function() {
      var map = {};
      TEMPLATE_DATABASE.forEach(function(t) {
        var fw = t.framework || 'vanilla';
        map[fw] = (map[fw] || 0) + 1;
      });
      var arr = Object.keys(map).map(function(k) {
        return { id: k, label: k.charAt(0).toUpperCase() + k.slice(1), count: map[k] };
      });
      arr.sort(function(a, b) { return b.count - a.count; });
      return arr;
    },

    search: function(queryOrOptions, maybeOptions) {
      var opts = {};
      var q = '';
      if (typeof queryOrOptions === 'object' && queryOrOptions !== null) {
        opts = queryOrOptions;
        q = (opts.query || '').toLowerCase().trim();
      } else {
        q = (queryOrOptions || '').toLowerCase().trim();
        opts = maybeOptions || {};
      }

      var category = opts.category || '';
      var framework = opts.framework || '';
      var limit = opts.limit || 999;

      var results = TEMPLATE_DATABASE.filter(function(t) {
        if (category && category !== 'all' && t.category !== category) return false;
        if (framework && framework !== 'all' && t.framework !== framework) return false;
        if (!q) return true;

        var str = (t.id + ' ' + t.title + ' ' + t.description + ' ' + t.categoryLabel + ' ' + (t.stack || []).join(' ')).toLowerCase();
        return str.includes(q);
      });

      var limited = results.slice(0, limit);
      // Return array with total and items properties attached for dual compatibility
      limited.items = limited;
      limited.total = results.length;
      return limited;
    },

    getFeatured: function() {
      var featuredIds = [
        'Hampton-Roads-Lawn-Care',
        'SignalBridge-AI',
        'BOOMPOW',
        '100-websites-in-30-days',
        'sand-and-stems-virginia-beach-flower-delivery',
        'PixelVerse',
        '1nc0gn30',
        '30-Days-Of-Python',
        'aplus-active-services-astro',
        '757-gas-shop-app',
        'c-and-c-landservices'
      ];

      var featured = [];
      featuredIds.forEach(function(fid) {
        var found = ZothTemplatesCatalog.getById(fid);
        if (found) featured.push(found);
      });
      return featured.length > 0 ? featured : TEMPLATE_DATABASE.slice(0, 10);
    },

    transformClonedHtml: function(html, baseDir) {
      if (!html || typeof html !== 'string') return '';
      baseDir = baseDir || '/';
      if (!baseDir.endsWith('/')) baseDir += '/';

      var transformed = html;

      // 1. Rewrite root-relative src="/assets/ and href="/assets/
      transformed = transformed.replace(/(src|href)=["']\/assets\//g, '="' + baseDir + 'assets/');
      
      // 2. Rewrite root-relative src="/_astro/ and href="/_astro/
      transformed = transformed.replace(/(src|href)=["']\/_astro\//g, '="' + baseDir + '_astro/');

      // 3. Rewrite root-relative favicons, logos, images
      transformed = transformed.replace(/(src|href)=["']\/favicon/g, '="' + baseDir + 'favicon');
      transformed = transformed.replace(/(src|href)=["']\/logo/g, '="' + baseDir + 'logo');
      transformed = transformed.replace(/(src|href)=["']\/og-image/g, '="' + baseDir + 'og-image');

      // 4. Inject <base href="..."> into <head>
      if (transformed.includes('<head>')) {
        transformed = transformed.replace('<head>', '<head><base href="' + baseDir + '" />');
      } else if (/<head[^>]*>/i.test(transformed)) {
        transformed = transformed.replace(/(<head[^>]*>)/i, '<base href="' + baseDir + '" />');
      } else {
        transformed = '<base href="' + baseDir + '" />' + transformed;
      }

      // 5. Inject in-iframe navigation bridge
      var navBridge = [
        '<script>',
        '  document.addEventListener("click", function(e) {',
        '    var link = e.target.closest("a");',
        '    if (link && link.getAttribute("href")) {',
        '      var href = link.getAttribute("href");',
        '      if (!href.startsWith("http") && !href.startsWith("//") && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {',
        '        if (window.parent && window.parent !== window) {',
        '          e.preventDefault();',
        '          window.parent.postMessage({ type: "ZOTH_NAVIGATE_ROUTE", route: href }, "*");',
        '        }',
        '      }',
        '    });',
        '  </script>'
      ].join('\n');

      if (transformed.includes('</body>')) {
        transformed = transformed.replace('</body>', navBridge + '</body>');
      } else {
        transformed += navBridge;
      }

      return transformed;
    },

    fetchAndTransformTemplateHtml: function(templateIdOrObj, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      callback = callback || function() {};

      var t = (typeof templateIdOrObj === 'string') ? ZothTemplatesCatalog.getById(templateIdOrObj) : templateIdOrObj;
      if (!t) {
        return callback(new Error('Template not found'), null);
      }

      var ep = t.entrypointUrl;
      var baseDir = t.baseDir || '/templates-source/';

      if (typeof window !== 'undefined' && typeof window.fetch === 'function' && ep) {
        var fetchUrl = ep;
        if (options.activePage && options.activePage !== 'index.html') {
          var subName = options.activePage.replace('.html', '');
          fetchUrl = ep.replace('index.html', subName + '/index.html');
        }

        window.fetch(fetchUrl)
          .then(function(res) {
            if (!res.ok) {
              if (fetchUrl !== ep) {
                return window.fetch(ep);
              }
              throw new Error('HTTP ' + res.status);
            }
            return res;
          })
          .then(function(res) { return res.text(); })
          .then(function(html) {
            var transformed = ZothTemplatesCatalog.transformClonedHtml(html, baseDir);
            callback(null, transformed);
          })
          .catch(function(err) {
            var site = ZothTemplatesCatalog.getTemplateSite(t);
            if (typeof ZothSwarmOrchestrator !== 'undefined') {
              var routes = ZothSwarmOrchestrator.generateRouteSuite(site);
              var pageHtml = routes[options.activePage || 'index.html'] || routes['index.html'];
              callback(null, pageHtml);
            } else {
              callback(err, null);
            }
          });
      } else if (typeof require === 'function' && typeof process !== 'undefined') {
        try {
          var fs = require('fs');
          var path = require('path');
          var candidatePaths = [
            path.join('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908', t.relativePath || '', 'dist', 'index.html'),
            path.join('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908', t.relativePath || '', 'index.html'),
            path.join('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908', 'all-netlify-sites', 'downloads', t.id, 'index.html')
          ];
          for (var pIdx = 0; pIdx < candidatePaths.length; pIdx++) {
            if (fs.existsSync(candidatePaths[pIdx])) {
              var raw = fs.readFileSync(candidatePaths[pIdx], 'utf-8');
              var transformed = ZothTemplatesCatalog.transformClonedHtml(raw, baseDir);
              return callback(null, transformed);
            }
          }
        } catch (e) {}

        var site = ZothTemplatesCatalog.getTemplateSite(t);
        if (typeof ZothSwarmOrchestrator !== 'undefined') {
          var routes = ZothSwarmOrchestrator.generateRouteSuite(site);
          return callback(null, routes[options.activePage || 'index.html'] || routes['index.html']);
        }
        return callback(null, '<!DOCTYPE html><html><body><h1>' + t.title + '</h1></body></html>');
      } else {
        var site = ZothTemplatesCatalog.getTemplateSite(t);
        callback(null, '<!DOCTYPE html><html><body><h1>' + t.title + '</h1></body></html>');
      }
    },

    getTemplateSite: function(templateIdOrObj) {
      var t = (typeof templateIdOrObj === 'string') ? ZothTemplatesCatalog.getById(templateIdOrObj) : templateIdOrObj;
      if (!t) return null;

      var cleanId = t.id.toLowerCase();
      var accent = t.accent || '#00f0ff';
      var bg = t.bg || '#040711';
      var surface = t.surface || '#0c1122';
      var border = 'rgba(255, 255, 255, 0.12)';

      var site = {
        name: t.title,
        domain: t.id.toLowerCase() + '.nullai.tech',
        tagline: t.description,
        badge: t.icon + ' ' + t.categoryLabel,
        icon: t.icon || '⚡',
        templateId: t.id,
        category: t.category,
        categoryShort: t.categoryShort,
        entrypointUrl: t.entrypointUrl,
        baseDir: t.baseDir,
        hasLiveBuild: t.hasLiveBuild,
        fileType: t.fileType,
        relativePath: t.relativePath,
        theme: {
          bg: bg,
          surface: surface,
          border: border,
          accent: accent,
          textMuted: '#94a3b8'
        },
        hero: {
          title: t.title + ' — Engineered for Performance',
          sub: t.description,
          cta: '⚡ Explore ' + t.title.split(' ')[0],
          ctaSecondary: '📖 View Documentation'
        },
        bentoFeatures: [
          { icon: t.icon || '⚡', title: 'Domain-Engineered Architecture', desc: 'Crafted specifically with high-fidelity ' + t.categoryShort + ' specifications.' },
          { icon: '🚀', title: 'Edge Performance & Zero CLS', desc: 'Built for instant sub-second page loads with optimal Web Vitals.' },
          { icon: '🛡️', title: 'Enterprise Security & Compliance', desc: 'Strict Content Security Policy headers with zero-cookie privacy compliance.' }
        ],
        itemsCatalog: [
          { name: t.title + ' Core Suite', place: t.categoryShort + ' Edition', time: 'Instant Access', price: '9', rating: '★★★★★ (5.0/5 · 128 Reviews)' },
          { name: t.title + ' Professional Tier', place: 'High-Volume Operations', time: 'Turnkey Setup', price: '49', rating: '★★★★★ (4.9/5 · 84 Reviews)' },
          { name: t.title + ' Enterprise Deployment', place: 'Dedicated SLA', time: 'Custom SLA', price: '99', rating: '★★★★★ (5.0/5 · 42 Reviews)' }
        ],
        pricing: [
          { tier: 'Starter', price: '9', desc: 'Essential capabilities for individuals.', perks: ['Full core access', 'Community support', 'Standard updates'] },
          { tier: 'Professional', price: '49', popular: true, desc: 'Advanced features for scaling teams.', perks: ['All Starter features', 'Priority dispatch', 'Custom domain setup', 'Direct support channel'] },
          { tier: 'Enterprise', price: '99', desc: 'Bespoke customization and 24/7 SLA.', perks: ['Dedicated instance', 'Custom integrations', '24/7 Phone & Signal hotline', 'Quarterly architecture review'] }
        ],
        faq: [
          { q: 'What technology stack powers ' + t.title + '?', a: 'This blueprint is engineered with ' + ((t.stack || []).join(', ') || t.framework) + ' optimized for edge deployment on Netlify or Vercel.' },
          { q: 'Can I rebrand and customize this template?', a: 'Yes! You can rebrand every element including company name, color palette, pricing tiers, services catalog, and logo monograms.' },
          { q: 'How do I export or deploy to production?', a: 'You can download the full repository ZIP with 1-click or deploy directly to Netlify AX with automated CI/CD.' }
        ]
      };

      if (cleanId.includes('lawn') || cleanId.includes('land')) {
        site.icon = '🌱';
        site.hero.title = 'Transforming Hampton Roads into Lush, Manicured Landscapes';
        site.hero.sub = 'Owner-led precision lawn mowing, core aeration, overseeding, and seasonal grounds maintenance throughout Virginia Beach, Norfolk, and Chesapeake.';
        site.hero.cta = '🌱 Request Free Quote';
        site.hero.ctaSecondary = '📞 Call (757) 555-0199';
      } else if (cleanId.includes('boompow') || cleanId.includes('burger') || cleanId.includes('food')) {
        site.icon = '🍔';
        site.hero.title = 'Craving Next-Level Plant-Based Fast Food in Virginia Beach?';
        site.hero.sub = '100% vegan smash burgers, crispy chick\'n sandwiches, loaded seasoned fries, and creamy mac & cheese crafted fresh at the oceanfront.';
        site.hero.cta = '🍔 Order Online Now';
        site.hero.ctaSecondary = '📍 Oceanfront Pickup';
      }

      return site;
    }
  };

  return ZothTemplatesCatalog;
}));

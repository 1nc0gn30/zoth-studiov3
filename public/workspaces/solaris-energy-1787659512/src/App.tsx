/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  List, 
  Calendar, 
  TrendingUp, 
  ExternalLink, 
  Twitter, 
  Linkedin, 
  Instagram,
  Cloud, 
  ArrowRight,
  Globe,
  Terminal,
  Code2,
  Clock,
  Info,
  BookOpen,
  Lock,
  Server,
  Cpu,
  Sparkles,
  BrainCircuit,
  Search,
  Filter,
  Loader2,
  ImageOff,
  Mail,
  MessageSquare,
  ClipboardCheck,
  LifeBuoy,
  Send,
  Menu,
  X
} from 'lucide-react';
import configData from './challenge-config.json';
import AboutPage from './components/AboutPage';
import ArticlePage from './components/ArticlePage';
import ApiDocsPage from './components/ApiDocsPage';
import ChallengeCTA from './components/ChallengeCTA';
import { buttonVariants } from './components/ui/button';
import { Card } from './components/ui/card';
import { Logo } from './components/Logo';

interface Project {
  id: number;
  title: string;
  date: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail: string;
}

interface SocialPost {
  platform: string;
  url: string;
  content: string;
  date: string;
}

interface ResourceItem {
  category: 'The Engine & Environment' | 'The High-Velocity Stack' | 'AI & Data';
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  link: string;
  summary: string;
  start: string;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

interface PollenatorProps {
  title: string;
  seasonId: number;
  compact?: boolean;
  domain: string;
}

function CountUp({ end, duration = 1200, suffix = '', className = '' }: { end: number; duration?: number; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return <span className={className}>{display}{suffix}</span>;
}

function PollenatorThumbnail({ title, seasonId, compact = false, domain }: PollenatorProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const hash = React.useMemo(() => hashString(title), [title]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Pick a curated visual theme based on the title hash
    const colorThemes = [
      { primary: '#4285F4', secondary: '#34A853', bg: 'from-[#EEF4FE] to-[#E6F4EA]' }, // Blue/Green
      { primary: '#EA4335', secondary: '#FBBC05', bg: 'from-[#FCE8E6] to-[#FEF7E0]' }, // Red/Yellow
      { primary: '#4285F4', secondary: '#EA4335', bg: 'from-[#EEF4FE] to-[#FCE8E6]' }, // Blue/Red
      { primary: '#c678dd', secondary: '#61afef', bg: 'from-[#F3E8FD] to-[#E8F4FD]' }, // Purple/Blue
      { primary: '#56b6c2', secondary: '#98c379', bg: 'from-[#EBF7F9] to-[#ECF5E8]' }, // Cyan/Green
    ];
    // Summer (Season 2) uses a warm neon palette on dark base
    const summerThemes = [
      { primary: '#FF6B5B', secondary: '#FFD23F', bg: 'summer-thumb' }, // Coral/Sun
      { primary: '#FF4E8E', secondary: '#FFB547', bg: 'summer-thumb' }, // Rose/Mango
      { primary: '#00C2A8', secondary: '#FFD23F', bg: 'summer-thumb' }, // Turq/Sun
      { primary: '#FF6B5B', secondary: '#00C2A8', bg: 'summer-thumb' }, // Coral/Turq
      { primary: '#FF4E8E', secondary: '#00C2A8', bg: 'summer-thumb' }, // Rose/Turq
    ];
    const theme = (seasonId === 2 ? summerThemes : colorThemes)[hash % (seasonId === 2 ? summerThemes : colorThemes).length];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      angle: number;
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = compact ? 12 : 24;
    const particles: Particle[] = [];
    const colors = [theme.primary, theme.secondary];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + (hash * (i + 1) % 6);
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        vx: (Math.sin(hash + i) * 0.3),
        vy: (Math.cos(hash + i) * 0.3),
        radius,
        color: colors[i % colors.length],
        alpha: 0.15 + (Math.random() * 0.3),
        angle: Math.random() * Math.PI * 2
      });
    }

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.angle += 0.01;
        p.x += p.vx + Math.sin(p.angle) * 0.1;
        p.y += p.vy + Math.cos(p.angle) * 0.1;

        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 60) {
          const force = (60 - dist) / 60;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [title]);

  const isSummerThumb = seasonId === 2;
  const bgGradient = [
    'from-[#EEF4FE] to-[#E6F4EA]',
    'from-[#FCE8E6] to-[#FEF7E0]',
    'from-[#EEF4FE] to-[#FCE8E6]',
    'from-[#F3E8FD] to-[#E8F4FD]',
    'from-[#EBF7F9] to-[#ECF5E8]',
  ][hash % 5];

  const thumbBgClass = isSummerThumb ? 'summer-thumb' : `bg-gradient-to-br ${bgGradient}`;
  const thumbBorder = isSummerThumb ? 'border-summer-sun/25' : 'border-[#DADCE0]';
  const thumbTextTitle = isSummerThumb ? 'text-white' : 'text-google-black';
  const thumbTextSub = isSummerThumb ? 'text-summer-sun/70' : 'text-google-gray';
  const thumbTextDomain = isSummerThumb ? 'text-summer-sun' : 'text-google-blue';
  const thumbHoverTitle = isSummerThumb ? 'group-hover:text-summer-sun' : 'group-hover:text-google-blue';
  const dotColors = isSummerThumb
    ? ['bg-summer-coral', 'bg-summer-sun', 'bg-summer-turq', 'bg-summer-rose']
    : ['bg-google-blue', 'bg-google-red', 'bg-google-yellow', 'bg-google-green'];
  const dotBorder = isSummerThumb ? 'border-summer-sun/30 bg-summer-deep/50' : 'border-[#DADCE0] bg-white';
  const seasonBadge = isSummerThumb
    ? 'text-summer-sun/80 bg-summer-deep/60 border-summer-sun/20'
    : 'text-google-gray bg-white/70 border-black/5 shadow-2xs';

  if (compact) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${thumbBgClass} border ${thumbBorder} p-1.5 text-center select-none overflow-hidden group`}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`grid grid-cols-2 gap-0.5 rounded-full p-0.5 border shadow-sm mb-1 group-hover:scale-110 transition-transform duration-300 ${dotBorder}`}
            aria-hidden="true"
          >
            <span className={`h-1 w-1 rounded-full ${dotColors[0]}`} />
            <span className={`h-1 w-1 rounded-full ${dotColors[1]}`} />
            <span className={`h-1 w-1 rounded-full ${dotColors[2]}`} />
            <span className={`h-1 w-1 rounded-full ${dotColors[3]}`} />
          </div>
          <span className={`text-[9px] font-semibold leading-tight line-clamp-2 truncate max-w-full px-0.5 font-display ${thumbTextTitle}`}>
            {title}
          </span>
          <span className={`text-[8px] font-mono ${thumbTextSub}`}>S{seasonId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-col justify-between p-4 ${thumbBgClass} border ${thumbBorder} text-left select-none overflow-hidden group`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-center w-full">
        <div
          className={`grid grid-cols-2 gap-0.5 rounded-full p-1 border shadow-sm shrink-0 group-hover:rotate-12 transition-transform duration-300 ${dotBorder}`}
          aria-hidden="true"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[0]}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[1]}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[2]}`} />
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[3]}`} />
        </div>
        <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${seasonBadge}`}>
          Season {seasonId}
        </span>
      </div>
      
      <div className="relative z-10 space-y-1 mt-auto">
        <h4 className={`font-display font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${thumbTextTitle} ${thumbHoverTitle}`}>
          {title}
        </h4>
        <p className={`text-[10px] font-semibold truncate hover:underline ${thumbTextDomain}`}>
          {domain}
        </p>
      </div>
    </div>
  );
}

function PreviewImage({
  src,
  alt,
  link,
  wrapperClassName,
  imageClassName,
  seasonId = 1,
  compact = false
}: {
  src: string;
  alt: string;
  link: string;
  wrapperClassName: string;
  imageClassName: string;
  seasonId?: number;
  compact?: boolean;
}) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setState('loading');
  }, [src]);

  const displayDomain = useMemo(() => {
    try {
      return new URL(link).hostname;
    } catch {
      return link.replace(/^https?:\/\//, '');
    }
  }, [link]);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={`${imageClassName} transition-opacity duration-300 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      )}

      {state === 'loading' && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${seasonId === 2 ? 'summer-thumb text-summer-sun/70' : 'bg-[#F8F9FA] text-google-gray'}`}>
          <Loader2 size={18} className={`animate-spin ${seasonId === 2 ? 'text-summer-sun' : 'text-google-blue'}`} />
          <span className="text-xs font-medium">Loading preview...</span>
        </div>
      )}

      {state === 'error' && (
        <PollenatorThumbnail 
          title={alt} 
          seasonId={seasonId} 
          compact={compact} 
          domain={displayDomain} 
        />
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'journey' | 'gallery' | 'social' | 'about' | 'article' | 'resources' | 'contact' | 'api'>('journey');
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [galleryQuery, setGalleryQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    botField: '',
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const tabToPath: Record<typeof activeTab, string> = {
    journey: '/',
    gallery: '/gallery',
    social: '/feed',
    about: '/about',
    article: '/about/article',
    resources: '/resources',
    contact: '/contact',
    api: '/developer',
  };

  const pathToTab = (pathname: string): typeof activeTab => {
    const normalized = pathname.replace(/\/+$/, '') || '/';
    const lookup: Record<string, typeof activeTab> = {
      '/': 'journey',
      '/gallery': 'gallery',
      '/feed': 'social',
      '/about': 'about',
      '/about/article': 'article',
      '/resources': 'resources',
      '/contact': 'contact',
      '/developer': 'api',
    };
    return lookup[normalized] ?? 'journey';
  };

  const navigateToTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const nextPath = tabToPath[tab];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  useEffect(() => {
    setActiveTab(pathToTab(window.location.pathname));
    const onPopState = () => {
      setActiveTab(pathToTab(window.location.pathname));
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    (window as any).setActiveTab = navigateToTab;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [selectedSeasonId, setSelectedSeasonId] = useState<number>(2);

  const isSummer = selectedSeasonId === 2;

  const activeSeason = useMemo(() => {
    return configData.seasons.find(s => s.id === selectedSeasonId) || configData.seasons[configData.seasons.length - 1];
  }, [selectedSeasonId]);

  const { challenge, projects, socialPosts } = activeSeason;
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  const isChallengeEnded = currentTime >= endDate;
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(0, Math.min(totalDays, Math.ceil((currentTime.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));
  
  const progressPercent = (projects.length / challenge.targetCount) * 100;
  const timePercent = (currentDay / totalDays) * 100;
  const velocityPerDay = (projects.length / (currentDay || 1)).toFixed(1);
  const daysRemaining = Math.max(totalDays - currentDay, 0);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [projects]);

  const availableTags = useMemo(() => {
    const unique = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => unique.add(t)));
    return Array.from(unique).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter(p => 
      (activeTag === 'all' || p.tags.includes(activeTag)) &&
      (p.title.toLowerCase().includes(galleryQuery.toLowerCase()) || 
       p.description.toLowerCase().includes(galleryQuery.toLowerCase()))
    );
  }, [sortedProjects, activeTag, galleryQuery]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(value));

  useEffect(() => {
    const seoByTab: Record<typeof activeTab, { title: string; description: string; path: string }> = {
      journey: {
        title: '100 Websites in 30 Days | Zoth Studio Team Challenge Tracker',
        description:
          'Live sprint dashboard showing progress, shipped websites, and daily velocity for Zoth Studio Team’s 100 websites challenge.',
        path: '/',
      },
      gallery: {
        title: 'Project Gallery | 100 Websites in 30 Days',
        description:
          'Browse every shipped site from the 100 Websites in 30 Days sprint, with links, stack tags, and launch dates.',
        path: '/gallery',
      },
      social: {
        title: 'Build Feed | 100 Websites in 30 Days',
        description:
          'Raw social updates and shipping notes from the challenge, including wins, friction, and momentum logs.',
        path: '/feed',
      },
      about: {
        title: 'About the Challenge | Zoth Studio Team',
        description:
          'Background, mission, and systems behind the 100 Websites in 30 Days challenge by Zoth Studio Team.',
        path: '/about',
      },
      article: {
        title: '30-Day Journal | 100 Websites in 30 Days',
        description:
          'Long-form day-by-day journal covering execution, decisions, and lessons learned during the 30-day sprint.',
        path: '/about/article',
      },
      resources: {
        title: "Builder's Toolkit | 100 Websites in 30 Days",
        description:
          'The deployment, frontend, and AI tools used to sustain high-velocity website shipping.',
        path: '/resources',
      },
      contact: {
        title: 'Contact | 100 Websites in 30 Days',
        description: 'Connect with Zoth Studio Team about challenge work, systems, and collaborations.',
        path: '/contact',
      },
      api: {
        title: 'Developer & AI Agent API | 100 Websites in 30 Days',
        description: 'API endpoints and developer documentation for Zoth Studio Team\'s 100 Websites challenge data.',
        path: '/developer',
      },
    };

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const active = seoByTab[activeTab];
    const canonicalUrl = `https://100WebsitesIn30Days.nullai.tech${active.path === '/' ? '/' : active.path}`;

    document.title = active.title;
    setMeta('description', active.description);
    setMeta('og:title', active.title, 'property');
    setMeta('og:description', active.description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('twitter:title', active.title);
    setMeta('twitter:description', active.description);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [activeTab]);

  const primaryTabs = ['journey', 'gallery', 'social', 'about', 'article', 'resources', 'contact', 'api'] as const;
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/nullai', icon: Linkedin },
    { label: 'Instagram', href: 'https://instagram.com/nullaitech', icon: Instagram },
    { label: 'X', href: 'https://x.com/nullaitech', icon: Twitter },
    { label: 'AI Shippers', href: 'https://aishippers.netlify.app/members/neal-frazier', icon: Cloud },
    { label: 'Bluesky', href: 'https://bsky.app/profile/nullaitech.bsky.social', icon: Globe },
  ] as const;

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus('sending');

    try {
      const payload = new URLSearchParams({
        'form-name': 'contact',
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        message: contactForm.message,
        'bot-field': contactForm.botField,
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setContactStatus('success');
      setContactForm({
        name: '',
        email: '',
        company: '',
        message: '',
        botField: '',
      });
    } catch (error) {
      setContactStatus('error');
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-google-blue/30 ${isSummer ? 'bg-gradient-to-br from-summer-deep via-[#2A1850] to-[#4A1B5E] text-white' : 'bg-white text-[#3C4043]'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 md:px-8 min-h-16 py-2 flex items-center justify-between ${isSummer ? 'bg-summer-deep/85 border-summer-sun/15' : 'bg-white/92 border-[#DADCE0]'}`}>
        <div 
          className={`flex items-center gap-2 cursor-pointer group shrink-0 ${isSummer ? 'text-white' : ''}`} 
          onClick={() => navigateToTab('journey')}
        >
          <Logo showTitle />
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {primaryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => navigateToTab(tab)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                activeTab === tab 
                ? (isSummer ? 'text-summer-sun border-summer-sun/30 bg-summer-sun/10' : 'text-google-blue border-google-blue/25 bg-google-blue/8') 
                : (isSummer ? 'text-white/70 border-transparent hover:border-summer-sun/20 hover:bg-summer-sun/5 hover:text-summer-sun' : 'text-google-gray border-transparent hover:border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-google-black')
              }`}
            >
              {tab === 'api' ? 'API' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button 
          className={`lg:hidden p-2 rounded-md transition-colors ${isSummer ? 'hover:bg-summer-sun/10 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed inset-0 z-40 pt-20 px-4 pb-8 lg:hidden ${isSummer ? 'bg-summer-deep/97' : 'bg-white'}`}
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {primaryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    navigateToTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                    activeTab === tab 
                    ? (isSummer ? 'text-summer-sun bg-summer-sun/10 border border-summer-sun/25' : 'text-google-blue bg-google-blue/10 border border-google-blue/20') 
                    : (isSummer ? 'text-white/70 hover:bg-summer-sun/5 border border-transparent' : 'text-google-gray hover:bg-gray-100 border border-transparent')
                  }`}
                >
                  {tab === 'api' ? 'API' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'journey' && (
            <motion.section
              key="journey"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className={`relative overflow-hidden rounded-3xl border ${isSummer ? 'border-summer-mango/25 summer-hero' : 'border-[#DADCE0] bg-white'} p-8 md:p-12 mb-10 shadow-[0_16px_48px_rgba(60,64,67,0.14)]`}>
                {isSummer && (
                  <>
                    <div className="summer-sun-rays" />
                    <div className="summer-blob summer-blob-coral" style={{ top: '-8%', left: '-6%', width: '14rem', height: '14rem' }} />
                    <div className="summer-blob summer-blob-mango" style={{ top: '12%', right: '8%', width: '10rem', height: '10rem', animationDelay: '1.5s' }} />
                    <div className="summer-blob summer-blob-turq" style={{ bottom: '-10%', right: '12%', width: '12rem', height: '12rem', animationDelay: '3s' }} />
                    <div className="summer-blob summer-blob-rose" style={{ bottom: '4%', left: '18%', width: '9rem', height: '9rem', animationDelay: '4.5s' }} />
                  </>
                )}
                {!isSummer && (
                  <>
                    <div className="absolute -top-12 -left-10 w-56 h-56 bg-google-blue/15 blur-3xl rounded-full" />
                    <div className="absolute top-12 right-16 w-44 h-44 bg-google-red/15 blur-3xl rounded-full" />
                    <div className="absolute -bottom-16 right-4 w-56 h-56 bg-google-green/15 blur-3xl rounded-full" />
                    <div className="absolute bottom-2 left-20 w-36 h-36 bg-google-yellow/20 blur-3xl rounded-full" />
                  </>
                )}
                <div className="relative space-y-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${isSummer ? 'border-summer-sun/30 bg-summer-deep/40 text-summer-sun' : 'border-[#DADCE0] bg-[#F8F9FA] text-google-gray'}`}>
                      {isSummer ? <Sparkles size={14} /> : <Globe size={14} />}
                      {isSummer ? 'Summer Sprint — Season 2' : 'Build In Public Challenge'}
                    </div>
                    
                    <div className={`inline-flex p-0.5 rounded-full border shadow-xs ${isSummer ? 'bg-summer-deep/40 border-summer-sun/20' : 'bg-[#F1F3F4] border-[#DADCE0]'}`}>
                      <button
                        onClick={() => { setSelectedSeasonId(1); setActiveTag('all'); }}
                        className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedSeasonId === 1
                            ? 'bg-white text-google-blue shadow-2xs font-semibold'
                            : isSummer ? 'text-summer-sun/70 hover:text-summer-sun' : 'text-google-gray hover:text-[#202124]'
                        }`}
                      >
                        Season 1 (Spring)
                      </button>
                      <button
                        onClick={() => { setSelectedSeasonId(2); setActiveTag('all'); }}
                        className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedSeasonId === 2
                            ? 'summer-toggle-active'
                            : isSummer ? 'text-white/80 hover:text-white font-semibold' : 'text-google-gray hover:text-[#202124]'
                        }`}
                      >
                        Season 2 (Summer)
                      </button>
                    </div>
                  </div>
                  <h1 className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight ${isSummer ? 'text-white' : 'text-[#202124]'}`}>
                    {isSummer ? (
                      <>
                        <span className="summer-gradient-text">100</span>{' '}
                        <span className="text-summer-coral">Websites</span>{' '}
                        <span className="text-summer-sun">in</span>{' '}
                        <span className="text-summer-turq">30 Days</span>
                      </>
                    ) : (
                      <>
                        <span className="text-google-blue">100</span>{' '}
                        <span className="text-google-red">Websites</span>{' '}
                        <span className="text-google-yellow">in</span>{' '}
                        <span className="text-google-green">30 Days</span>
                      </>
                    )}
                  </h1>
                  <p className={`text-base md:text-lg max-w-3xl leading-relaxed ${isSummer ? 'text-white/75' : 'text-google-gray'}`}>
                    {isSummer
                      ? 'The heat is on. A live summer shipping sprint burning through ideas and shipping real products at full throttle. Every build launches, gets documented, and lands in the gallery.'
                      : 'A live shipping sprint and public proof-of-work log. Every build is launched, documented, and indexed as this challenge moves toward 100 shipped websites.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`rounded-2xl border px-4 py-3 ${isSummer ? 'border-summer-coral/30 bg-summer-coral/10' : 'border-google-blue/20 bg-google-blue/5'}`}>
                      <p className={`text-[11px] uppercase tracking-[0.18em] ${isSummer ? 'text-summer-coral' : 'text-google-blue'}`}>{isSummer ? 'Summer Window' : 'Challenge Window'}</p>
                      <p className={`text-sm font-medium ${isSummer ? 'text-white' : 'text-[#202124]'}`}>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</p>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 ${isSummer ? 'border-summer-mango/30 bg-summer-mango/10' : 'border-google-red/20 bg-google-red/5'}`}>
                      <p className={`text-[11px] uppercase tracking-[0.18em] ${isSummer ? 'text-summer-mango' : 'text-google-red'}`}>Velocity Signal</p>
                      <p className={`text-sm font-medium ${isSummer ? 'text-white' : 'text-[#202124]'}`}>{velocityPerDay} launches/day</p>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 ${isSummer ? 'border-summer-turq/30 bg-summer-turq/10' : 'border-google-green/20 bg-google-green/5'}`}>
                      <p className={`text-[11px] uppercase tracking-[0.18em] ${isSummer ? 'text-summer-turq' : 'text-google-green'}`}>{isSummer ? 'Days of Heat Left' : 'Runway Remaining'}</p>
                      <p className={`text-sm font-medium ${isSummer ? 'text-white' : 'text-[#202124]'}`}>{daysRemaining} day{daysRemaining === 1 ? '' : 's'} left</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className={`p-6 flex flex-col items-center text-center space-y-2 ${isSummer ? 'summer-stat rounded-2xl' : 'google-card'}`}>
                  <div className={`p-3 rounded-full mb-2 relative ${isSummer ? 'bg-summer-coral/15 text-summer-coral' : 'bg-google-blue/10 text-google-blue'}`}>
                    {isSummer && <span className="absolute inset-0 rounded-full bg-summer-coral/20 animate-ping" style={{ animationDuration: '2.5s' }} />}
                    <LayoutGrid size={24} className="relative z-10" />
                  </div>
                  <span className={`text-sm font-medium uppercase tracking-wider ${isSummer ? 'text-summer-sun/80' : 'text-google-gray'}`}>Shipped</span>
                  <div className={`text-4xl font-bold ${isSummer ? 'text-white' : ''}`}>
                    <CountUp end={projects.length} className={isSummer ? 'summer-gradient-text' : ''} /><span className={`text-xl ml-1 ${isSummer ? 'text-summer-sun/60' : 'text-google-gray'}`}>/100</span>
                  </div>
                </div>

                <div className={`p-6 flex flex-col items-center text-center space-y-2 ${isSummer ? 'summer-stat rounded-2xl' : 'google-card'}`}>
                  <div className={`p-3 rounded-full mb-2 relative ${isSummer ? 'bg-summer-turq/15 text-summer-turq' : 'bg-google-green/10 text-google-green'}`}>
                    {isSummer && <span className="absolute inset-0 rounded-full bg-summer-turq/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />}
                    <Calendar size={24} className="relative z-10" />
                  </div>
                  <span className={`text-sm font-medium uppercase tracking-wider ${isSummer ? 'text-summer-sun/80' : 'text-google-gray'}`}>Current Day</span>
                  <div className={`text-4xl font-bold ${isSummer ? 'text-white' : ''}`}>
                    <CountUp end={currentDay} className={isSummer ? 'summer-gradient-text' : ''} /><span className={`text-xl ml-1 ${isSummer ? 'text-summer-sun/60' : 'text-google-gray'}`}>/ {totalDays}</span>
                  </div>
                </div>

                <div className={`p-6 flex flex-col items-center text-center space-y-2 ${isSummer ? 'summer-stat rounded-2xl' : 'google-card'}`}>
                  <div className={`p-3 rounded-full mb-2 relative ${isSummer ? 'bg-summer-sun/15 text-summer-sun' : 'bg-google-yellow/10 text-google-yellow'}`}>
                    {isSummer && <span className="absolute inset-0 rounded-full bg-summer-sun/20 animate-ping" style={{ animationDuration: '2.8s', animationDelay: '1s' }} />}
                    <TrendingUp size={24} className="relative z-10" />
                  </div>
                  <span className={`text-sm font-medium uppercase tracking-wider ${isSummer ? 'text-summer-sun/80' : 'text-google-gray'}`}>Velocity</span>
                  <div className={`text-4xl font-bold ${isSummer ? 'text-white' : ''}`}>
                    <CountUp end={parseFloat(velocityPerDay)} className={isSummer ? 'summer-gradient-text' : ''} /><span className={`text-xl ml-1 ${isSummer ? 'text-summer-sun/60' : 'text-google-gray'}`}>/day</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${isSummer ? 'text-summer-sun/80' : 'text-google-gray'}`}>Overall Progress</h3>
                      <span className={`text-2xl font-bold ${isSummer ? 'text-summer-coral' : 'text-google-blue'}`}>{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-[#DADCE0]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progressPercent}%` }} 
                        className={`h-full ${isSummer ? 'summer-progress-fill' : 'bg-google-blue'}`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${isSummer ? 'text-summer-sun/80' : 'text-google-gray'}`}>Time Elapsed</h3>
                      <span className={`text-2xl font-bold ${isSummer ? 'text-summer-turq' : 'text-google-green'}`}>{timePercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-[#DADCE0]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${timePercent}%` }} 
                        className={`h-full ${isSummer ? 'summer-progress-fill' : 'bg-google-green'}`}
                      />
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl border space-y-4 ${isSummer ? 'summer-card' : 'google-card border-[#DADCE0] bg-white'}`}>
                    <div className={`flex items-center gap-2 ${isSummer ? 'text-summer-sun' : 'text-google-blue'}`}>
                      <Sparkles size={20} />
                      <span className="font-bold uppercase tracking-wider text-xs">{isSummer ? 'Summer Focus' : 'Current Focus'}</span>
                    </div>
                    <p className={`leading-relaxed ${isSummer ? 'text-white/75' : 'text-google-gray'}`}>
                      {isSummer
                        ? <>Focusing on <span className="text-summer-sun font-medium">bold visual design, 3D/WebGL, and high-impact product launches</span>. Summer season pushes the limits of what a 30-day sprint can produce — sci-fi-grade UIs, live data dashboards, and AI-powered tools.</>
                        : <>Focusing on <span className="text-google-black font-medium">performance, accessibility, and clean composition</span>. Using a streamlined stack of React, Tailwind, and Vite to keep the feedback loop tight.</>}
                    </p>
                    <button 
                      onClick={() => navigateToTab('gallery')}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${isSummer ? 'bg-gradient-to-r from-summer-coral to-summer-sun text-summer-deep hover:shadow-lg hover:shadow-summer-coral/30' : buttonVariants({ variant: 'default' })}`}
                    >
                      Browse Shipped Work <ArrowRight size={16} className="inline ml-2" />
                    </button>
                  </div>

                  <div className={`p-6 rounded-2xl border space-y-4 ${isSummer ? 'summer-cta' : 'google-card border-google-green/20 bg-google-green/5'}`}>
                    <div className={`flex items-center gap-2 ${isSummer ? 'text-summer-turq' : 'text-google-green'}`}>
                      <Terminal size={20} />
                      <span className="font-bold uppercase tracking-wider text-xs">AI & Developer API Gateway</span>
                    </div>
                    <p className={`leading-relaxed text-sm ${isSummer ? 'text-white/75' : 'text-google-gray'}`}>
                      Query challenge progress, seasons, and shipped websites directly using curl or fetch. Supports custom, LLM-optimized Markdown formatting.
                    </p>
                    <div className="font-mono text-[11px] bg-google-black text-white/95 p-3 rounded-xl border border-white/5 select-all overflow-x-auto whitespace-nowrap">
                      curl https://100websitesin30days.nullai.tech/api/projects?format=markdown
                    </div>
                    <button 
                      onClick={() => navigateToTab('api')}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${isSummer ? 'bg-gradient-to-r from-summer-turq/20 to-summer-sun/20 border border-summer-turq/30 text-summer-turq hover:from-summer-turq hover:to-summer-sun hover:text-summer-deep' : buttonVariants({ variant: 'outline' })}`}
                    >
                      Explore Developer API Docs <ArrowRight size={16} className="inline ml-2" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${isSummer ? 'text-white' : ''}`}>Recent Shipments</h3>
                    <button 
                      onClick={() => navigateToTab('gallery')} 
                      className={`text-sm hover:underline font-medium ${isSummer ? 'text-summer-sun' : 'text-google-blue'}`}
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {sortedProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className={`p-4 flex gap-4 cursor-pointer group ${isSummer ? 'summer-card' : 'google-card hover:border-google-blue transition-colors'}`} onClick={() => navigateToTab('gallery')}>
                        <PreviewImage 
                          src={project.thumbnail} 
                          alt={project.title} 
                          link={project.url} 
                          wrapperClassName="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" 
                          imageClassName="w-full h-full object-cover" 
                          seasonId={selectedSeasonId}
                          compact={true}
                        />
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`font-medium transition-colors ${isSummer ? 'text-white group-hover:text-summer-sun' : 'group-hover:text-google-blue'}`}>{project.title}</h4>
                            <span className={`text-xs font-mono ${isSummer ? 'text-summer-sun/60' : 'text-google-gray'}`}>{formatDate(project.date)}</span>
                          </div>
                          <p className={`text-sm line-clamp-2 ${isSummer ? 'text-white/65' : 'text-google-gray'}`}>{project.description}</p>
                          <div className="flex gap-2 pt-1">
                            {project.tags.slice(0, 2).map(tag => (
                              <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isSummer ? 'summer-tag' : 'bg-gray-100 text-google-gray'}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          {activeTab === 'gallery' && (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="text-center space-y-4 mb-12">
                <h1 className={`text-4xl font-bold tracking-tight ${isSummer ? 'summer-gradient-text' : 'text-google-black'}`}>{isSummer ? 'Summer Gallery' : 'Project Gallery'}</h1>
                <p className={`max-w-2xl mx-auto ${isSummer ? 'text-summer-sun/70' : 'text-google-gray'}`}>
                  {isSummer
                    ? 'Every site shipped during the summer sprint — 3D globes, AI tools, creator labs, and more.'
                    : 'Every website shipped during the 100-website sprint. From tiny utilities to full-scale landing pages.'}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isSummer ? 'text-summer-sun/50' : 'text-google-gray'}`} />
                    <input 
                      type="text" 
                      placeholder="Search projects..." 
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-all text-sm ${isSummer ? 'bg-summer-deep/40 border-summer-sun/25 text-white placeholder:text-summer-sun/40 focus:ring-2 focus:ring-summer-coral/30 focus:border-summer-coral' : 'border-[#DADCE0] focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue'}`}
                      value={galleryQuery}
                      onChange={(e) => setGalleryQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className={`inline-flex p-0.5 rounded-full border shadow-xs shrink-0 ${isSummer ? 'bg-summer-deep/40 border-summer-sun/20' : 'bg-[#F1F3F4] border-[#DADCE0]'}`}>
                    <button
                      onClick={() => { setSelectedSeasonId(1); setActiveTag('all'); }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedSeasonId === 1
                          ? 'bg-white text-google-blue shadow-2xs font-semibold'
                          : isSummer ? 'text-summer-sun/70 hover:text-summer-sun' : 'text-google-gray hover:text-[#202124]'
                      }`}
                    >
                      Season 1
                    </button>
                    <button
                      onClick={() => { setSelectedSeasonId(2); setActiveTag('all'); }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedSeasonId === 2
                          ? 'summer-toggle-active'
                          : isSummer ? 'text-white/80 hover:text-white font-semibold' : 'text-google-gray hover:text-[#202124]'
                      }`}
                    >
                      Season 2
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                  <button 
                    onClick={() => setActiveTag('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      activeTag === 'all' ? (isSummer ? 'summer-tag-active' : 'bg-google-blue text-white') : (isSummer ? 'summer-tag' : 'bg-gray-100 text-google-gray hover:bg-gray-200')
                    }`}
                  >
                    All
                  </button>
                  {availableTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        activeTag === tag ? (isSummer ? 'summer-tag-active' : 'bg-google-blue text-white') : (isSummer ? 'summer-tag' : 'bg-gray-100 text-google-gray hover:bg-gray-200')
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`group overflow-hidden flex flex-col h-full ${isSummer ? 'summer-card' : 'google-card'}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <PreviewImage 
                        src={project.thumbnail} 
                        alt={project.title} 
                        link={project.url} 
                        wrapperClassName="w-full h-full" 
                        imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        seasonId={selectedSeasonId}
                        compact={false}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                    </div>
                    <div className="p-5 flex-grow space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`font-bold transition-colors ${isSummer ? 'text-white group-hover:text-summer-sun' : 'text-google-black group-hover:text-google-blue'}`}>{project.title}</h3>
                        <span className={`text-[10px] font-mono ${isSummer ? 'text-summer-sun/60' : 'text-google-gray'}`}>{formatDate(project.date)}</span>
                      </div>
                      <p className={`text-sm line-clamp-3 leading-relaxed ${isSummer ? 'text-white/65' : 'text-google-gray'}`}>{project.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map(tag => (
                          <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isSummer ? 'summer-tag' : 'bg-gray-100 text-google-gray'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`w-full py-2 rounded-lg font-medium text-center block transition-all ${isSummer ? 'bg-gradient-to-r from-summer-coral/20 to-summer-sun/20 border border-summer-sun/30 text-summer-sun hover:from-summer-coral hover:to-summer-sun hover:text-summer-deep' : buttonVariants({ variant: 'outline', size: 'sm' })}`}
                      >
                        Visit Site <ExternalLink size={14} className="inline ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isSummer ? 'bg-summer-sun/10 text-summer-sun' : 'bg-gray-100 text-google-gray'}`}>
                      <Search size={32} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${isSummer ? 'text-white' : ''}`}>No projects found</h3>
                      <p className={isSummer ? 'text-summer-sun/60' : 'text-google-gray'}>Try adjusting your search or filter criteria.</p>
                    </div>
                    <button 
                      onClick={() => { setGalleryQuery(''); setActiveTag('all'); }}
                      className={`font-medium hover:underline ${isSummer ? 'text-summer-sun' : 'text-google-blue'}`}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.section>
          )}
          {activeTab === 'social' && (
            <motion.section
              key="social"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="text-center space-y-4 mb-12">
                <h1 className={`text-4xl font-bold tracking-tight ${isSummer ? 'summer-gradient-text' : 'text-google-black'}`}>{isSummer ? 'Summer Feed' : 'Build Feed'}</h1>
                <p className={`max-w-2xl mx-auto ${isSummer ? 'text-summer-sun/70' : 'text-google-gray'}`}>
                  The raw stream of updates, struggles, and wins from the {challenge.title} challenge.
                </p>
                
                <div className={`inline-flex p-0.5 rounded-full border shadow-xs mt-2 ${isSummer ? 'bg-summer-deep/40 border-summer-sun/20' : 'bg-[#F1F3F4] border-[#DADCE0]'}`}>
                  <button
                    onClick={() => setSelectedSeasonId(1)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedSeasonId === 1
                        ? 'bg-white text-google-blue shadow-2xs font-semibold'
                        : isSummer ? 'text-summer-sun/70 hover:text-summer-sun' : 'text-google-gray hover:text-[#202124]'
                    }`}
                  >
                    Season 1
                  </button>
                  <button
                    onClick={() => setSelectedSeasonId(2)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedSeasonId === 2
                        ? 'summer-toggle-active'
                        : isSummer ? 'text-white/80 hover:text-white font-semibold' : 'text-google-gray hover:text-[#202124]'
                        }`}
                        >
                        Season 2
                  </button>
                </div>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                {socialPosts.map((post, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="google-card p-6 rounded-2xl border border-[#DADCE0] bg-white space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          post.platform === 'twitter' ? 'bg-sky-100 text-sky-500' : 
                          post.platform === 'linkedin' ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {post.platform === 'twitter' ? <Twitter size={18} /> : <Linkedin size={18} />}
                        </div>
                        <span className="text-sm font-bold text-google-black capitalize">{post.platform}</span>
                      </div>
                      <span className="text-xs text-google-gray font-mono">{post.date}</span>
                    </div>
                    <p className="text-google-gray leading-relaxed">{post.content}</p>
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-google-blue hover:underline font-medium inline-flex items-center gap-1"
                    >
                      View original post <ExternalLink size={14} />
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
          {activeTab === 'resources' && (
            <motion.section
              key="resources"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-google-black">Builder's Toolkit</h1>
                <p className="text-google-gray max-w-3xl mx-auto">
                  The exact stack and resources used to maintain a high-velocity shipping cadence. No gatekeeping, just tools that work.
                </p>
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="google-card p-6 rounded-2xl border border-[#DADCE0] bg-white space-y-4">
                    <div className="p-3 rounded-xl bg-google-blue/10 text-google-blue w-fit">
                      <Server size={24} />
                    </div>
                    <h3 className="font-bold text-lg">Deployment</h3>
                    <p className="text-sm text-google-gray leading-relaxed">
                      Using Netlify for lightning-fast deployments and automatic preview environments for every commit.
                    </p>
                  </div>
                  <div className="google-card p-6 rounded-2xl border border-[#DADCE0] bg-white space-y-4">
                    <div className="p-3 rounded-xl bg-google-green/10 text-google-green w-fit">
                      <Cpu size={24} />
                    </div>
                    <h3 className="font-bold text-lg">Runtime</h3>
                    <p className="text-sm text-google-gray leading-relaxed">
                      React + Vite for the fastest possible dev experience and optimized production builds.
                    </p>
                  </div>
                  <div className="google-card p-6 rounded-2xl border border-[#DADCE0] bg-white space-y-4">
                    <div className="p-3 rounded-xl bg-google-yellow/10 text-google-yellow w-fit">
                      <BrainCircuit size={24} />
                    </div>
                    <h3 className="font-bold text-lg">AI Orchestration</h3>
                    <p className="text-sm text-google-gray leading-relaxed">
                      Leveraging LLMs for scaffolding, rapid prototyping, and solving the "blank page" problem.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-medium">Builder Resources</h3>
                    <p className="text-google-gray max-w-3xl mx-auto">
                      Everything listed here is open and accessible. Use these docs to start small, then scale with confidence. No gatekeeping.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {(Object.entries(groupedResources) as Array<[ResourceItem['category'], ResourceItem[]]>).map(([category, items]) => (
                      <section key={category} className="space-y-4">
                        <h4 className="text-sm font-mono uppercase tracking-wider text-google-gray">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {items.map((resource) => (
                            <article key={resource.name} className="google-card p-5 space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-gray-50">
                                    <resource.icon size={18} className={resource.color} />
                                  </div>
                                  <h5 className="font-medium">{resource.name}</h5>
                                </div>
                                <a
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${buttonVariants({ variant: 'outline', size: 'sm' })}`}
                                >
                                  Docs <ExternalLink size={14} />
                                </a>
                              </div>
                              <p className="text-sm text-google-gray">{resource.summary}</p>
                              <div className="rounded-lg border border-[#E8EAED] bg-[#F8F9FA] px-3 py-2">
                                <p className="text-xs text-google-gray">
                                  <span className="font-semibold text-[#3C4043]">Getting started:</span> {resource.start}
                                </p>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>

                  <div className="google-card p-6 bg-google-blue/5 border-google-blue/20">
                    <div className="flex items-center gap-2 mb-2 text-google-blue">
                      <Lock size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Practical Guidance</span>
                    </div>
                    <p className="text-sm text-google-gray leading-relaxed">
                      If a tool feels advanced, start with its quickstart and copy one small pattern. Ship one tiny improvement, then repeat. The fastest way to learn is building in public with clear notes.
                    </p>
                  </div>

                  <ChallengeCTA
                    title="Take These Tools And Run The Challenge"
                    description="You now have the stack. Turn it into proof by committing to a shipping cadence and documenting your results in public."
                    primaryLabel="Commit To The Challenge"
                    secondaryLabel="See The Journey"
                    onPrimary={() => navigateToTab('contact')}
                    onSecondary={() => navigateToTab('journey')}
                  />
                </div>
              </div>
            </motion.section>
          )}
          {activeTab === 'about' && (
            <motion.section
              key="about"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <AboutPage onBack={() => navigateToTab('journey')} />
            </motion.section>
          )}
          {activeTab === 'article' && (
            <motion.section
              key="article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ArticlePage 
                onBack={() => navigateToTab('about')} 
                seasonId={selectedSeasonId} 
                onSeasonChange={setSelectedSeasonId}
              />
            </motion.section>
          )}
          {activeTab === 'contact' && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center space-y-3 mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-google-black">Contact</h1>
                <p className="text-google-gray max-w-2xl mx-auto">
                  Send a message about the challenge, collabs, or shipping systems.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
                <Card className="google-card p-6 md:p-8">
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={submitContact}
                    className="space-y-5"
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>
                        Don’t fill this out if you're human:
                        <input
                          name="bot-field"
                          value={contactForm.botField}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, botField: e.target.value }))}
                        />
                      </label>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-google-gray">
                        Name
                        <input
                          required
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-white px-3 py-2.5 text-[#202124] focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue"
                        />
                      </label>
                      <label className="text-sm font-medium text-google-gray">
                        Email
                        <input
                          required
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-white px-3 py-2.5 text-[#202124] focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue"
                        />
                      </label>
                    </div>

                    <label className="text-sm font-medium text-google-gray block">
                      Company or Project (optional)
                      <input
                        type="text"
                        name="company"
                        value={contactForm.company}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, company: e.target.value }))}
                        className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-white px-3 py-2.5 text-[#202124] focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue"
                      />
                    </label>

                    <label className="text-sm font-medium text-google-gray block">
                      Message
                      <textarea
                        required
                        name="message"
                        rows={7}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell me what you're building, timeline, and where you need help."
                        className="mt-1.5 w-full rounded-lg border border-[#DADCE0] bg-white px-3 py-2.5 text-[#202124] focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue"
                      />
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-xs text-google-gray">
                        Response target: usually within 24-48 hours.
                      </p>
                      <button
                        type="submit"
                        disabled={contactStatus === 'sending'}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${buttonVariants({ variant: 'default' })}`}
                      >
                        {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                        <Send size={16} />
                      </button>
                    </div>

                    {contactStatus === 'success' && (
                      <div className="rounded-lg border border-google-green/30 bg-google-green/10 px-3 py-2 text-sm text-[#1E8E3E]">
                        Message sent successfully.
                      </div>
                    )}

                    {contactStatus === 'error' && (
                      <div className="rounded-lg border border-google-red/30 bg-google-red/10 px-3 py-2 text-sm text-google-red">
                        Submission failed. Try again in a minute.
                      </div>
                    )}
                  </form>
                </Card>

                <div className="space-y-4">
                  <Card className="google-card p-5">
                    <div className="flex items-center gap-2 mb-2 text-google-blue">
                      <MessageSquare size={16} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Best For</h3>
                    </div>
                    <p className="text-sm text-google-gray">Build strategy, shipping systems, site rebuilds, AI workflows, and deployment cleanup.</p>
                  </Card>
                  <Card className="google-card p-5">
                    <div className="flex items-center gap-2 mb-2 text-google-green">
                      <ClipboardCheck size={16} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Include In Message</h3>
                    </div>
                    <p className="text-sm text-google-gray">Current stack, blocker, deadline, and what “done” looks like for your project.</p>
                  </Card>
                  <Card className="google-card p-5">
                    <div className="flex items-center gap-2 mb-2 text-google-red">
                      <LifeBuoy size={16} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Support Channels</h3>
                    </div>
                    <p className="text-sm text-google-gray">Use this form first. You can also reference links in the Build Feed and About sections for context.</p>
                  </Card>
                  <Card className="google-card p-5 bg-[#F8F9FA]">
                    <div className="flex items-center gap-2 mb-2 text-google-yellow">
                      <Mail size={16} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Response Time</h3>
                    </div>
                    <p className="text-sm text-google-gray">Typical reply within 24-48 hours. Complex requests may take longer if deep review is needed.</p>
                  </Card>
                </div>
              </div>
            </motion.section>
          )}
          {activeTab === 'api' && (
            <motion.section
              key="api"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ApiDocsPage />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t px-4 py-10 md:px-8 ${isSummer ? 'border-summer-sun/15 bg-summer-deep/50' : 'border-[#DADCE0] bg-[#F8F9FA]'}`}>
        <div className={`max-w-7xl mx-auto rounded-3xl border p-5 md:p-8 shadow-sm ${isSummer ? 'border-summer-sun/20 bg-summer-deep/40' : 'border-[#E8EAED] bg-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr_1fr] gap-6 md:gap-8">
            <section className="space-y-4">
              <div className="hidden sm:block">
                <Logo showTitle />
              </div>
              <div className="sm:hidden">
                <Logo showTitle={false} />
                <h3 className={`mt-3 text-lg font-semibold ${isSummer ? 'text-white' : 'text-google-black'}`}>100 Websites in 30 Days</h3>
              </div>
              <p className={`text-sm leading-relaxed max-w-xl ${isSummer ? 'text-white/60' : 'text-google-gray'}`}>
                Public build sprint documenting real launches, systems, and execution from idea to deployment.
              </p>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${isSummer ? 'border-summer-turq/30 bg-summer-turq/10 text-summer-turq' : 'border-[#DADCE0] bg-[#F8F9FA] text-google-gray'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${isSummer ? 'summer-live-dot' : 'bg-google-green'}`} />
                {isSummer ? 'Summer sprint live' : 'Live challenge tracker'}
              </div>
            </section>

            <section className="space-y-3">
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isSummer ? 'text-summer-sun/70' : 'text-google-gray'}`}>Site Links</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <button
                  onClick={() => navigateToTab('about')}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${isSummer ? 'border-summer-sun/15 text-white/70 hover:border-summer-sun/40 hover:text-summer-sun hover:bg-summer-sun/5' : 'border-[#E8EAED] text-google-gray hover:border-google-blue/30 hover:text-google-blue hover:bg-google-blue/5'}`}
                >
                  About Challenge
                </button>
                <button
                  onClick={() => navigateToTab('resources')}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${isSummer ? 'border-summer-sun/15 text-white/70 hover:border-summer-sun/40 hover:text-summer-sun hover:bg-summer-sun/5' : 'border-[#E8EAED] text-google-gray hover:border-google-blue/30 hover:text-google-blue hover:bg-google-blue/5'}`}
                >
                  Resources
                </button>
                <button
                  onClick={() => navigateToTab('article')}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${isSummer ? 'border-summer-sun/15 text-white/70 hover:border-summer-sun/40 hover:text-summer-sun hover:bg-summer-sun/5' : 'border-[#E8EAED] text-google-gray hover:border-google-blue/30 hover:text-google-blue hover:bg-google-blue/5'}`}
                >
                  Article
                </button>
                <button
                  onClick={() => navigateToTab('contact')}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${isSummer ? 'border-summer-sun/15 text-white/70 hover:border-summer-sun/40 hover:text-summer-sun hover:bg-summer-sun/5' : 'border-[#E8EAED] text-google-gray hover:border-google-blue/30 hover:text-google-blue hover:bg-google-blue/5'}`}
                >
                  Contact
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isSummer ? 'text-summer-sun/70' : 'text-google-gray'}`}>Social</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${isSummer ? 'border-summer-sun/15 text-white/70 hover:border-summer-sun/40 hover:text-summer-sun hover:bg-summer-sun/5' : 'border-[#E8EAED] text-google-gray hover:border-google-blue/30 hover:text-google-blue hover:bg-google-blue/5'}`}
                  >
                    <link.icon size={15} />
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          <div className={`mt-6 border-t pt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between ${isSummer ? 'border-summer-sun/15' : 'border-[#E8EAED]'}`}>
            <p className={`text-xs ${isSummer ? 'text-white/50' : 'text-google-gray'}`}>© 2026 Zoth Studio Team. All rights reserved.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
              className={`text-xs font-medium transition-colors text-left sm:text-right ${isSummer ? 'text-summer-sun/70 hover:text-summer-sun' : 'text-google-gray hover:text-google-blue'}`}
            >
              Back to top
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const groupedResources = {
  'The Engine & Environment': [
    {
      name: 'Vite',
      icon: Code2,
      color: 'text-google-blue',
      link: 'https://vitejs.dev/guide/',
      summary: 'Next-generation frontend tooling. Fast dev server, optimized builds.',
      start: 'npm create vite@latest'
    },
    {
      name: 'Netlify',
      icon: Cloud,
      color: 'text-google-green',
      link: 'https://docs.netlify.com/',
      summary: 'Modern web hosting and automation platform for rapid deployment.',
      start: 'netlify init'
    },
    {
      name: 'Hostinger',
      icon: Globe,
      color: 'text-google-red',
      link: 'https://www.hostinger.com/help',
      summary: 'Hosting platform and domain tooling for launches and production ops.',
      start: 'Set DNS + hosting plan, then map your domain'
    },
    {
      name: 'Parrot OS',
      icon: Terminal,
      color: 'text-google-yellow',
      link: 'https://parrotsec.org/docs/',
      summary: 'Security-focused Linux distribution for offensive/defensive workflows.',
      start: 'Read install docs and choose edition'
    },
    {
      name: 'Docker',
      icon: Server,
      color: 'text-google-blue',
      link: 'https://docs.docker.com/',
      summary: 'Container runtime and image tooling for consistent local/prod workflows.',
      start: 'Install Docker Engine/Desktop and run hello-world'
    },
    {
      name: 'Podman',
      icon: Cpu,
      color: 'text-google-green',
      link: 'https://docs.podman.io/',
      summary: 'Daemonless container tooling with Docker-compatible workflows.',
      start: 'Install Podman and run podman ps'
    },
  ],
  'The High-Velocity Stack': [
    {
      name: 'React',
      icon: Sparkles,
      color: 'text-google-blue',
      link: 'https://react.dev/',
      summary: 'The library for web interfaces. Component-driven architecture.',
      start: 'Read the Quick Start guide'
    },
    {
      name: 'Tailwind CSS',
      icon: LayoutGrid,
      color: 'text-google-yellow',
      link: 'https://tailwindcss.com/docs',
      summary: 'Utility-first CSS framework for rapid UI development.',
      start: 'npm install -D tailwindcss'
    },
    {
      name: 'Astro',
      icon: Globe,
      color: 'text-google-red',
      link: 'https://docs.astro.build/',
      summary: 'Content-heavy and hybrid websites with strong performance defaults.',
      start: 'npm create astro@latest'
    },
    {
      name: 'MUI',
      icon: LayoutGrid,
      color: 'text-google-green',
      link: 'https://mui.com/material-ui/getting-started/',
      summary: 'Production-ready React component system with strong accessibility support.',
      start: 'npm install @mui/material @emotion/react @emotion/styled'
    },
  ],
  'AI & Data': [
    {
      name: 'OpenAI API',
      icon: BrainCircuit,
      color: 'text-google-green',
      link: 'https://platform.openai.com/docs',
      summary: 'State-of-the-art LLMs for content generation and logic.',
      start: 'Create an API key in the dashboard'
    },
    {
      name: 'OpenCode',
      icon: Code2,
      color: 'text-google-blue',
      link: 'https://github.com/search?q=opencode&type=repositories',
      summary: 'Open-source coding workflows and tooling references.',
      start: 'Review active repos and clone the one that matches your workflow'
    },
    {
      name: 'OpenClaw',
      icon: Lock,
      color: 'text-google-red',
      link: 'https://github.com/search?q=openclaw&type=repositories',
      summary: 'Open-source security/automation ecosystem references.',
      start: 'Inspect maintained repositories and evaluate fit'
    },
    {
      name: 'Hermes',
      icon: BrainCircuit,
      color: 'text-google-yellow',
      link: 'https://ollama.com/library/hermes3',
      summary: 'Assistant model family often used in local and hybrid AI stacks.',
      start: 'Pull model in Ollama and run a baseline prompt'
    },
    {
      name: 'Ollama',
      icon: Cpu,
      color: 'text-google-green',
      link: 'https://ollama.com/',
      summary: 'Run local LLMs with a simple API and command-line interface.',
      start: 'Install Ollama and run: ollama run llama3'
    },
  ],
};

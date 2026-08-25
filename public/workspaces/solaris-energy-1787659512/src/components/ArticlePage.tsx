import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Calendar,
  Clock, 
  Share2, 
  Quote as QuoteIcon,
  Terminal,
  Zap,
  Camera
} from "lucide-react";
import avatarImage from "../../neal-avatar.jpg";
import configData from "../challenge-config.json";

interface ArticlePageProps {
  onBack: () => void;
  seasonId?: number;
  onSeasonChange?: (seasonId: number) => void;
}

const DAY_IMAGE_MODULES = import.meta.glob("../../day*.{png,jpg,jpeg,webp,avif,gif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const SUMMER_DAY_IMAGE_MODULES = import.meta.glob("../../summer_day*.{png,jpg,jpeg,webp,avif,gif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const EXT_PRIORITY = ["png", "jpg", "jpeg", "webp", "avif", "gif"] as const;

const DAY_IMAGES: Partial<Record<number, string>> = Object.values(DAY_IMAGE_MODULES).reduce(
  (acc, imagePath) => {
    const match = imagePath.match(/day(\d+)(?:-[^/.]+)?\.(png|jpg|jpeg|webp|avif|gif)$/i);
    if (!match) return acc;
    const day = Number(match[1]);
    const ext = match[2].toLowerCase();
    const current = acc[day];

    if (!current) {
      acc[day] = imagePath;
      return acc;
    }

    const currentExt = current.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)?.[1]?.toLowerCase() ?? "gif";
    if (EXT_PRIORITY.indexOf(ext as (typeof EXT_PRIORITY)[number]) < EXT_PRIORITY.indexOf(currentExt as (typeof EXT_PRIORITY)[number])) {
      acc[day] = imagePath;
    }
    return acc;
  },
  {} as Partial<Record<number, string>>
);

const SUMMER_DAY_IMAGES: Partial<Record<number, string>> = Object.values(SUMMER_DAY_IMAGE_MODULES).reduce(
  (acc, imagePath) => {
    const match = imagePath.match(/summer_day(\d+)(?:-[^/.]+)?\.(png|jpg|jpeg|webp|avif|gif)$/i);
    if (!match) return acc;
    const day = Number(match[1]);
    const ext = match[2].toLowerCase();
    const current = acc[day];

    if (!current) {
      acc[day] = imagePath;
      return acc;
    }

    const currentExt = current.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)?.[1]?.toLowerCase() ?? "gif";
    if (EXT_PRIORITY.indexOf(ext as (typeof EXT_PRIORITY)[number]) < EXT_PRIORITY.indexOf(currentExt as (typeof EXT_PRIORITY)[number])) {
      acc[day] = imagePath;
    }
    return acc;
  },
  {} as Partial<Record<number, string>>
);

const buildImageIdea = (day: number, title: string, retrospect: string) => {
  const styles = [
    "editorial documentary photo",
    "cinematic natural light shot",
    "moody workstation capture",
    "clean product-style composition",
    "street-level lifestyle frame",
  ];
  const lenses = ["35mm look", "50mm look", "wide environmental framing", "tight portrait crop"];
  const accents = [
    "subtle grain",
    "high-detail texture",
    "warm dusk tones",
    "cool neon highlights",
    "balanced daylight color",
  ];

  const style = styles[(day - 1) % styles.length];
  const lens = lenses[(day + 1) % lenses.length];
  const accent = accents[(day + 2) % accents.length];

  return `Day ${day} visual prompt: ${title}. Scene inspired by: ${retrospect} Composition: ${style}, ${lens}, ${accent}.`;
};

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

const season1Data = configData.seasons.find(s => s.id === 1) || configData.seasons[0];

export default function ArticlePage({ onBack, seasonId = 1, onSeasonChange }: ArticlePageProps) {
  const activeSeason = React.useMemo(() => {
    return configData.seasons.find(s => s.id === seasonId) || configData.seasons[0];
  }, [seasonId]);

  const { challenge } = activeSeason;
  const now = new Date();
  const challengeStart = new Date(challenge.startDate);
  const challengeEnd = new Date(challenge.endDate);
  const challengeDateLabel = `${challengeStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${challengeEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const DAYS_CONTENT = React.useMemo(() => {
    if (seasonId === 1) {
      return Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const dayStart = new Date(activeSeason.challenge.startDate);
        dayStart.setUTCDate(dayStart.getUTCDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

        const dayLabel = dayStart.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const weekday = dayStart.getUTCDay();
        const isWeekend = weekday === 0 || weekday === 6;
        const thinkTankDay = day % 2 === 0;
        const workBlock = isWeekend
          ? "Weekend structure today: no 9-5 contractor block, focus shifted to challenge builds and business systems."
          : "Worked 9am-5pm at MaxxPotential as a private-contractor Security Analyst, then moved into evening build mode.";
        const catSittingBlock = "Cat-sitting stayed part of the daily rhythm and kept the schedule grounded between work and shipping blocks.";
        const thinkTankBlock = thinkTankDay
          ? "Met at a cafe/workspace for think-tank time on real businesses launching this year, then translated those notes into product scope."
          : "Ran a focused solo execution block after work, tightening scope and moving directly into build + publish reps.";
        const skateBlock = isWeekend
          ? "Weekend note: if weather held, I got skateboard sessions in; that includes this weekend cadence and the prior weekend rhythm."
          : "Skate sessions were held for weekend weather windows so weekday momentum stayed clean.";

        const shippedSites = activeSeason.projects
          .filter((project) => {
            const posted = new Date(project.date);
            return posted >= dayStart && posted < dayEnd;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const shippedTitles = shippedSites.map((site) => site.title);
        const shippedToday = shippedTitles.length;
        const cumulativeShipped = activeSeason.projects.filter((project) => new Date(project.date) < dayEnd).length;
        const targetCount = activeSeason.challenge.targetCount;
        const remainingToTarget = Math.max(targetCount - cumulativeShipped, 0);
        const progressPercent = Math.min(100, (cumulativeShipped / targetCount) * 100);
        const targetByNow = Math.min(
          targetCount,
          Math.round((day / 30) * targetCount)
        );
        const paceDelta = cumulativeShipped - targetByNow;
        const shipBlock =
          shippedTitles.length > 0
            ? `Shipped site${shippedTitles.length > 1 ? "s" : ""} today: ${shippedTitles.join(", ")}. Logged the public progress on X as part of the build-in-public record.`
            : "No new site was posted this day; the focus was system work, planning, and preparing the next release wave.";
        const progressBlock = `Progress checkpoint: ${cumulativeShipped}/${targetCount} shipped (${progressPercent.toFixed(
          0
        )}%). Today's output: ${shippedToday}. Remaining: ${remainingToTarget}. Pace check: ${paceDelta >= 0 ? "+" : ""}${paceDelta} vs day-${day} target (${targetByNow}).`;
        const tryHackMeBlock = `TryHackMe streak stayed active: completed coursework today and protected the hot streak while pushing toward 365 consecutive days.`;

        const dayTitle = `Day ${day}: ${isWeekend ? "Weekend Shipping + Systems" : "Workday Execution + Night Build"} (${dayLabel})`;
        const content = `${workBlock} ${catSittingBlock} ${thinkTankBlock} ${shipBlock} ${progressBlock} ${tryHackMeBlock}`;
        const retrospect = `${isWeekend ? "Weekend cadence emphasized long creative blocks and deeper experimentation." : "Workday cadence stayed strict: professional delivery first, challenge output second, then public documentation."} ${skateBlock}`;

        return {
          day,
          title: dayTitle,
          content,
          retrospect,
          quote: QUOTES[i % QUOTES.length],
          imageIdea: buildImageIdea(day, dayTitle, retrospect),
          shippedTitles,
        };
      });
    }

    // Season 2: Summer 2026 (Days 1 to 8)
    return [
      {
        day: 1,
        title: "Day 1: Solana Globes, Mentor Labs, Coffee Chats, & Winking Smilies (Wed, Jul 1, 2026)",
        content: "Season 2 opened with six ships in one day. Solana World Map dropped a live Three.js globe tracking wallets and validator activity. CreatorPlaybooks Mentor Lab shipped reusable creator execution playbooks. Spark a Smile added a winking 3D lift-me-up. Coffee Meet made it easy to book win-win coffee chats. A+ Active Services Review summarized Jai's compound-intelligence offering. You Are What You Eat closed the day as a nutrition-awareness micro-app.",
        retrospect: "Opening day with six live sites sets a high bar for the season: global data, creator systems, social tooling, partner pages, and wellness micro-apps all in 24 hours.",
        quote: { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        imageIdea: "Day 1 visual prompt: A wide desk with six glowing browser windows — a 3D Solana globe, mentor cards, a coffee calendar, a partner scorecard, a winking smiley, and a food plate infographic.",
        shippedTitles: ["Solana World Map", "CreatorPlaybooks Mentor Lab", "Spark a Smile", "Coffee Meet", "A+ Active Services Review", "You Are What You Eat"]
      },
      {
        day: 2,
        title: "Day 2: Contractor Schedules, Location Blobs, Cost Math & Daily Timelines (Thu, Jul 2, 2026)",
        content: "Day 2 tightened execution tools. Reno Scheduler gave renovators and contractors a clean timeline for crews and trade blocks. Spark Something Cute turned device tilt and coordinates into an interactive Three.js blob. Agent Runner Calculator forecasted credit use and token costs before heavy pipeline runs. Dogged Studio Daily Timeline gave ChaiWithJai a public build cadence tracker.",
        retrospect: "Pure utility day: scheduling, reactive WebGL, cost math, and a publishing timeline. These are the systems that keep high-volume shipping sustainable.",
        quote: { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        imageIdea: "Day 2 visual prompt: A split screen showing a contractor Gantt chart, a neon Three.js blob reacting to a tilting phone, a calculator dashboard, and a vertical daily timeline.",
        shippedTitles: ["Reno Scheduler", "Spark Something Cute", "Agent Runner Calculator", "Dogged Studio Daily Timeline"]
      },
      {
        day: 3,
        title: "Day 3: Mobile AI Dev & Browser Datamoshing (Fri, Jul 3, 2026)",
        content: "Day 3 proved the pipeline can run from anywhere. Cosmos Flow is a self-healing liquid canvas built entirely inside Termux on Android. Data Moshy followed as a client-side media glitch engine that datamoshes uploaded videos and images with color smears and keyframe distortions.",
        retrospect: "Building on a phone with Hermes Agent + Termux, then shipping a browser media tool, shows the stack is portable and the output is still production-grade.",
        quote: { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
        imageIdea: "Day 3 visual prompt: A mobile phone running a green Termux terminal with fluid particle simulation, next to a desktop canvas applying datamosh to a video frame.",
        shippedTitles: ["Cosmos Flow", "Data Moshy"]
      },
      {
        day: 4,
        title: "Day 4: Dimension Lab & 2D vs 3D Design (Sat, Jul 4, 2026)",
        content: "Day 4 focused on spatial decision-making. Dimension Lab compares 2D layout cards against full 3D WebGL scenes, rendering parameters and camera behavior side-by-side so builders know when to go flat and when to go dimensional.",
        retrospect: "A single deep tool can save hours of layout debate. Dimension Lab turns the 2D-vs-3D choice into a visual, interactive experiment.",
        quote: { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        imageIdea: "Day 4 visual prompt: A dark UI with a flat 2D layout card on the left and a rotating 3D isometric cube on the right, glowing blue grid lines connecting both panels.",
        shippedTitles: ["Dimension Lab"]
      },
      {
        day: 5,
        title: "Day 5: Wonderland Escapes & Netlify Agent Runner (Sun, Jul 5, 2026)",
        content: "Day 5 balanced play and operations. Whimsical Wonderland built a Garden of Happy Nonsense — lighthearted interactive browser magic. Netlify Agent Runner went live as a sci-fi dashboard to manage Netlify Agent Runners from one console.",
        retrospect: "Creative velocity needs operational backbone. Pairing a whimsical scene with an agent-runner dashboard keeps the work both fun and runnable at scale.",
        quote: { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        imageIdea: "Day 5 visual prompt: A fairy-tale garden of happy nonsense on the left, and a neon sci-fi dashboard monitoring Netlify Agent Runners on the right.",
        shippedTitles: ["Whimsical Wonderland", "Netlify Agent Runner"]
      },
      {
        day: 6,
        title: "Day 6: CreatorPlaybooks System Pass & Agent Runner Console (Mon, Jul 6, 2026)",
        content: "Day 6 was workflow and tooling. CreatorPlaybooks System Pass standardized prompt templates, cleared pipeline friction, and added cross-day navigation. Netlify Agent Runner Console hardened the runner GUI with status views and deployment orchestration.",
        retrospect: "Reducing daily setup time is the highest-leverage move for continuous shipping. The system pass and console make tomorrow start faster.",
        quote: { text: "Without data, you're just another person with an opinion.", author: "W. Edwards Deming" },
        imageIdea: "Day 6 visual prompt: A clean workflow map with connected step indicators beside a console grid of live Netlify Agent Runners and status lights.",
        shippedTitles: ["CreatorPlaybooks System Pass", "Netlify Agent Runner Console"]
      },
      {
        day: 7,
        title: "Day 7: Live Mentor Lab, Moon Phases & Solana Payments (Tue, Jul 7, 2026)",
        content: "Day 7 wired real data and WebGPU together. CreatorPlaybooks Virtual Mentor Lab now loads all 13 mentors from a live API, renders real cover art, and falls back to animated canvases when media is missing. LunaWebGPU visualized moon phases in 3D with real-time lighting. SolPay added a simple SOL payment request flow.",
        retrospect: "Live API integrations, WebGPU visuals, and Web3 payments in one day show the stack is maturing fast. Fallbacks keep every surface polished.",
        quote: { text: "We all need people who will give us feedback. That's how we improve.", author: "Bill Gates" },
        imageIdea: "Day 7 visual prompt: A dark dashboard with dynamic mentor cards, a 3D moon phase visualizer, and a Solana checkout flow glowing in purple and teal.",
        shippedTitles: ["CreatorPlaybooks Virtual Mentor Lab", "LunaWebGPU", "SolPay"]
      },
      {
        day: 8,
        title: "Day 8: Feedback Loops, Matrix Rain, Vector Decoders, VectorCam & Agent Loom (Wed, Jul 8, 2026)",
        content: "Day 8 was the biggest ship day yet. CreatorPlaybooks Feedback Loops added a glassmorphic localStorage feedback board. Matrix Rain Chamber dropped a WebGPU Matrix fan scene with Neo, Morpheus, and Trinity. Matrix Vector Live Decoder visualized cascading code signals in real time. VectorCam applied Three.js shaders to the webcam feed. Agent Loom wove multiple AI agent threads into one orchestrated execution canvas.",
        retrospect: "Five distinct projects in one day — feedback UX, retro gaming, live decoding, webcam effects, and agent orchestration. Peak creative velocity with zero blank media.",
        quote: { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        imageIdea: "Day 8 visual prompt: A montage of a glassmorphic feedback board, green Matrix digital rain, a vector decoder feed, a distorted webcam view, and an agent loom weaving thread nodes.",
        shippedTitles: ["CreatorPlaybooks Feedback Loops", "Matrix Rain Chamber", "Matrix Vector Live Decoder", "VectorCam", "Agent Loom"]
      },
      {
        day: 9,
        title: "Day 9: Virtual Coffee, Unstuck Marketplace, Aeropulse & Ideas Wall (Thu, Jul 9, 2026)",
        content: "Day 9 was a high-velocity sprint shipping four distinct platforms. Shipped Virtual Coffee with Maya (booking and brew-bar custom physics), Unstuck (niche marketplace for SaaS founders with Stripe booking and Netlify Forms), Aeropulse (live weather recommendations app for #HotARSummer), and CreatorPlaybooks Shareable Ideas Wall (exportable localStorage JSON feedback module).",
        retrospect: "Transitioning from single-user features to marketplace checkout routing and public feedback walls enables real transaction value.",
        quote: { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        imageIdea: "Day 9 visual prompt: A dark dashboard showing a virtual coffee brew-bar on the left, Stripe payment inputs in the middle, and a glowing neon ideas wall on the right.",
        shippedTitles: ["Virtual Coffee with Maya", "Unstuck", "Aeropulse", "CreatorPlaybooks Shareable Ideas Wall"]
      },
      {
        day: 10,
        title: "Day 10: Interactive Upvote Ladders & Role Filters (Fri, Jul 10, 2026)",
        content: "Day 10 focused on interactive voting and filter systems. We shipped the CreatorPlaybooks Interactive Voting Ladder on the ideas wall, enabling visitors to upvote submissions, store upvote signals locally in localStorage, sort dynamically by upvote rank, and filter ideas by creator role using clean vanilla JS.",
        retrospect: "Dynamic sorting and client-side filtering turn a static list into an engaging community product with zero database overhead.",
        quote: { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
        imageIdea: "Day 10 visual prompt: A neon upvote board displaying cards with dynamic green counter badges and active filter pills lit in turquoise.",
        shippedTitles: ["CreatorPlaybooks Interactive Voting Ladder"]
      }
    ];
  }, [seasonId, activeSeason]);

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalChallengeDays = DAYS_CONTENT.length;
  const visibleDayCount = Math.max(
    0,
    Math.min(
      totalChallengeDays,
      Math.ceil((Math.min(now.getTime(), challengeEnd.getTime()) - challengeStart.getTime()) / msPerDay)
    )
  );
  const visibleDays = DAYS_CONTENT.slice(0, visibleDayCount);
  const activeImages = seasonId === 1 ? DAY_IMAGES : SUMMER_DAY_IMAGES;

  const handleHoloMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${Math.max(0, Math.min(100, mx)).toFixed(2)}%`);
    el.style.setProperty("--my", `${Math.max(0, Math.min(100, my)).toFixed(2)}%`);
  };

  const handleHoloLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto pb-24"
    >
      {/* Navigation & Meta */}
      <div className="flex items-center justify-between mb-12 sticky top-20 bg-[#F8F9FA]/80 backdrop-blur-md py-4 z-20 border-b border-gray-100 gap-4 flex-wrap md:flex-nowrap">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-google-blue font-medium hover:bg-google-blue/5 px-4 py-2 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={18} />
          Back to About
        </button>

        {onSeasonChange && (
          <div className="inline-flex bg-[#F1F3F4] p-0.5 rounded-full border border-[#DADCE0] shadow-xs shrink-0">
            <button
              onClick={() => onSeasonChange(1)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                seasonId === 1
                  ? 'bg-white text-google-blue shadow-2xs font-semibold'
                  : 'text-google-gray hover:text-[#202124]'
              }`}
            >
              Season 1 (Spring)
            </button>
            <button
              onClick={() => onSeasonChange(2)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                seasonId === 2
                  ? 'bg-white text-google-blue shadow-2xs font-semibold'
                  : 'text-google-gray hover:text-[#202124]'
              }`}
            >
              Season 2 (Summer)
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 text-google-gray shrink-0">
          <div className="flex items-center gap-1 text-sm">
            <Clock size={16} />
            {seasonId === 1 ? "20 min read" : "3 min read"}
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="mb-16 text-center md:text-left">
        <div className="inline-block px-3 py-1 bg-google-blue/10 text-google-blue rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          The 30-Day Journal
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
          30 Days of <span className="gradient-text">Creation</span>: The Zoth Studio Team Log
        </h1>
        <p className="text-xl text-google-gray leading-relaxed mb-8">
          A day-by-day breakdown of the "100 Websites in 30 Days" challenge. This is more than just a build log; it's a reflection on life, work, and the relentless pursuit of doing what you love.
        </p>
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-google-blue flex items-center justify-center text-white font-bold text-xl">
            NF
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">Zoth Studio Team</div>
            <div className="text-google-gray text-sm">{challengeDateLabel}</div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <div className="space-y-24">
        {visibleDays.length === 0 && (
          <div className="google-card rounded-3xl border border-[#DADCE0] bg-white p-8 text-center">
            <h2 className="text-2xl font-bold text-google-black mb-2">Journal unlocks at challenge start</h2>
            <p className="text-google-gray">
              Entries appear automatically as each challenge day passes.
            </p>
          </div>
        )}
        {visibleDays.map((day, idx) => (
          <motion.section 
            key={day.day}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Day Marker */}
            <div className="absolute -left-12 top-0 hidden lg:flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center text-white text-xs font-bold">
                {day.day}
              </div>
              <div className="w-px h-full bg-gray-100" />
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-google-blue">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-mono font-bold uppercase tracking-widest">Day {day.day}</span>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight">{day.title}</h2>
              
              <div className="prose prose-lg prose-zinc max-w-none">
                <p>{day.content}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {day.shippedTitles.length > 0 ? (
                  day.shippedTitles.map((title) => (
                    <span
                      key={`${day.day}-${title}`}
                      className="inline-flex items-center rounded-full border border-google-blue/25 bg-google-blue/10 px-3 py-1 text-xs font-medium text-google-blue"
                    >
                      {title}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#DADCE0] bg-[#F8F9FA] px-3 py-1 text-xs font-medium text-google-gray">
                    System and planning day
                  </span>
                )}
              </div>

              {/* Day Image */}
              <div className="group relative">
                {activeImages[day.day] ? (
                  <motion.div
                    initial={{ opacity: 0.88, y: 22, scale: 0.985, rotateX: 6 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="journal-image-shell journal-holo-shell aspect-video"
                    onMouseMove={handleHoloMove}
                    onMouseLeave={handleHoloLeave}
                  >
                    <img
                      src={activeImages[day.day]}
                      alt={`Day ${day.day} journal visual`}
                      className="journal-image-base"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                    <img
                      src={activeImages[day.day]}
                      alt=""
                      aria-hidden="true"
                      className="journal-image-glitch journal-image-glitch-red"
                      loading="lazy"
                    />
                    <img
                      src={activeImages[day.day]}
                      alt=""
                      aria-hidden="true"
                      className="journal-image-glitch journal-image-glitch-cyan"
                      loading="lazy"
                    />
                    <img
                      src={avatarImage}
                      alt=""
                      aria-hidden="true"
                      className="journal-avatar-datamosh"
                      loading="lazy"
                    />
                    <div className="journal-image-vignette" />
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/55 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/90 border border-white/20">
                      DAY {day.day} CAPTURE
                    </div>
                  </motion.div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center text-center p-8 transition-all group-hover:bg-gray-50">
                    <Camera className="w-12 h-12 text-gray-300 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-gray-400 font-medium max-w-sm italic">
                      "{day.imageIdea}"
                    </p>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold text-google-gray border border-gray-100">
                      PLACEHOLDER IMAGE
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-google-gray text-center italic">
                  {activeImages[day.day]
                    ? `Caption: Day ${day.day} field note visual`
                    : `Caption: Idea for Day ${day.day} visual — ${day.imageIdea.split("—")[0]}`}
                </p>
              </div>

              {/* Retrospect Section */}
              <div className="bg-google-blue/5 border-l-4 border-google-blue p-8 rounded-r-3xl">
                <div className="flex items-center gap-2 text-google-blue mb-4">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">The Retrospect</span>
                </div>
                <p className="text-google-gray leading-relaxed italic">
                  "{day.retrospect}"
                </p>
              </div>

              {/* Quote Section */}
              <div className="flex flex-col items-center text-center py-8 px-4 border-y border-gray-50">
                <QuoteIcon className="w-8 h-8 text-google-blue/20 mb-4" />
                <p className="text-xl font-light text-zinc-700 italic max-w-2xl">
                  "{day.quote.text}"
                </p>
                <span className="mt-4 text-sm font-bold text-google-gray">— {day.quote.author}</span>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer CTA */}
      <footer className="mt-32 pt-16 border-t border-gray-100 text-center">
        <h3 className="text-3xl font-bold mb-6">The Journey Continues</h3>
        <p className="text-google-gray max-w-2xl mx-auto mb-12">
          This log is a living document. As the challenge progresses, so does the story. Thank you for being part of this journey.
        </p>
        <button 
          onClick={onBack}
          className="google-button google-button-primary px-12 py-4 text-lg"
        >
          Back to Dashboard
        </button>
      </footer>
    </motion.div>
  );
}

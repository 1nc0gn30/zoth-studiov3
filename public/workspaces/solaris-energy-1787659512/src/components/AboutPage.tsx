import React from "react";
import { motion } from "motion/react";
import { 
  Terminal, 
  Shield, 
  Music, 
  Zap, 
  Globe, 
  Waves, 
  Apple,
  Briefcase,
  Rocket,
  BrainCircuit,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import visionaryImage from "../../neal-avatar.jpg";
import ChallengeCTA from "./ChallengeCTA";

interface AboutPageProps {
  onBack: () => void;
}

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`google-card p-6 hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-google-gray"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold tracking-tight">About the <span className="text-google-blue">Challenge</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Intro Card */}
        <BentoCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between" delay={0.1}>
          <div>
            <div className="flex items-center gap-2 text-google-blue mb-4">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">The Visionary</span>
            </div>
            <h3 className="text-3xl font-bold mb-4">Zoth Studio Team</h3>
            <p className="text-google-gray leading-relaxed text-lg">
              Virginia Beach builder with a T-shaped background across product, security, and automation. I care about practical execution: ship useful work, document the process, and make the path easier for the next person.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="rounded-full p-1.5 bg-gradient-to-br from-google-blue via-google-green to-google-red shadow-lg">
                <div className="rounded-full p-1.5 bg-white">
                  <img
                    src={visionaryImage}
                    alt="Zoth Studio Team"
                    className="w-44 h-44 md:w-52 md:h-52 object-cover rounded-full border border-[#DADCE0]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-[#DADCE0] bg-[#F8F9FA] px-4 py-3">
                <p className="text-sm text-[#3C4043] italic leading-relaxed">
                  "Build in public. Keep scope tight. Ship daily. Let momentum do the heavy lifting."
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs text-google-gray">
                  <span className="font-semibold text-google-blue">Operating Mode:</span> Secure by default
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs text-google-gray">
                  <span className="font-semibold text-google-red">Build Cadence:</span> Daily shipping
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs text-google-gray">
                  <span className="font-semibold text-google-green">North Star:</span> Useful outcomes
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-8">
            <div className="flex flex-col items-center gap-1 group">
              <Waves className="text-google-gray group-hover:text-google-blue transition-colors w-6 h-6" />
              <span className="text-[10px] text-google-gray uppercase">Beach</span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <Music className="text-google-gray group-hover:text-google-red transition-colors w-6 h-6" />
              <span className="text-[10px] text-google-gray uppercase">Music</span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <Apple className="text-google-gray group-hover:text-google-green transition-colors w-6 h-6" />
              <span className="text-[10px] text-google-gray uppercase">Fruit</span>
            </div>
          </div>
        </BentoCard>

        {/* Professional Hat */}
        <BentoCard className="md:col-span-3 lg:col-span-2" delay={0.2}>
          <div className="flex items-center gap-2 text-google-red mb-4">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Professional Hat</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Security Analysis & AI Deployment Specialist</h3>
          <p className="text-xs font-mono uppercase tracking-wide text-google-gray mb-4">
            Cybersecurity Analyst | Netlify Deployment Architect | AI Implementation Lead
          </p>
          <p className="text-sm text-google-gray mb-4 leading-relaxed">
            High-velocity developer and entrepreneur specializing in stripping away the complexity of technical deployments. I bridge the gap between enterprise-grade security and rapid-fire production, making it "damn easy" for organizations to launch secure sites and for individuals to master the AI revolution.
          </p>
          <div className="space-y-4 text-sm text-google-gray">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-google-red mb-1">The Mission: Deployment & Empowerment</h4>
              <p className="leading-relaxed">
                I focus on two core pillars: Velocity and Mastery. Whether I am automating a Fortune 500 compliance audit or building a decentralized web app, my goal is to eliminate friction. I do not just ship code; I build workflows that help others become great with the same tools.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-google-red mb-2">Core Competencies</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 text-xs text-google-gray bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Terminal className="w-4 h-4 text-google-blue mt-0.5 shrink-0" />
                  Rapid Web Deployment: Netlify Shippers Program participant using a no-Next.js architecture (Astro, Vite, React) to launch high-performance, secure sites fast.
                </div>
                <div className="flex items-start gap-3 text-xs text-google-gray bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Briefcase className="w-4 h-4 text-google-red mt-0.5 shrink-0" />
                  Security & Compliance Automation: SOX and logical access specialist building PowerShell and Power Apps workflows for audit-ready reliability.
                </div>
                <div className="flex items-start gap-3 text-xs text-google-gray bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <BrainCircuit className="w-4 h-4 text-google-green mt-0.5 shrink-0" />
                  AI Orchestration & Mentorship: local AI implementation via Ollama and Docker, with secure team onboarding for practical adoption.
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-google-red mb-1">Professional Impact</h4>
              <p className="leading-relaxed text-xs">
                Built the "100 Websites" protocol for high-scale Netlify edge deployment, reduced compliance friction through automation-first analyst workflows, and integrated Web3 and privacy-focused infrastructure into accessible business models.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wide text-google-red mb-1">The Entrepreneurial Edge</h4>
              <p className="leading-relaxed text-xs">
                Operating out of Virginia Beach, I run service-based and digital ventures with a hacker mindset: optimize, automate, and scale.
              </p>
              <p className="text-xs font-medium mt-2">
                Digital HQ: nullai.tech | 757tech.pro
              </p>
            </div>
          </div>
        </BentoCard>

        {/* AI Stack */}
        <BentoCard className="lg:col-span-2" delay={0.3}>
          <div className="flex items-center gap-2 text-google-green mb-4">
            <BrainCircuit className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">AI Stack</span>
          </div>
          <h3 className="text-xl font-bold mb-4">Everyday AI Integration</h3>
          <p className="text-sm text-google-gray mb-4">
            Tools are shared openly here. If you see something useful, you can start with the same stack today.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Gemini', 'Codex', 'Ollama', 'LocalAI', 'Netlify Agents'].map((tech) => (
              <div key={tech} className="flex items-center gap-2 text-xs text-google-gray border border-gray-100 p-2 rounded-xl bg-gray-50/50">
                <Zap className="w-3 h-3 text-google-yellow fill-google-yellow" />
                {tech}
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Ventures */}
        <BentoCard className="md:col-span-2 lg:col-span-1" delay={0.4}>
          <div className="flex items-center gap-2 text-google-yellow mb-4">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Ventures</span>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-google-blue">Valet Ninjas</h4>
              <p className="text-[10px] text-google-gray uppercase tracking-tighter">Premium Valet Company</p>
            </div>
            <div>
              <h4 className="font-bold text-google-red">Zoth Studio Team Tech</h4>
              <p className="text-[10px] text-google-gray uppercase tracking-tighter">Custom Digital Services</p>
            </div>
            <div>
              <h4 className="font-bold text-google-green">Tech Pro</h4>
              <p className="text-[10px] text-google-gray uppercase tracking-tighter">Upcoming Innovation</p>
            </div>
          </div>
        </BentoCard>

        {/* The Challenge */}
        <BentoCard className="md:col-span-3 lg:col-span-1 bg-google-blue/5 border-google-blue/20" delay={0.5}>
          <div className="flex items-center gap-2 text-google-blue mb-4">
            <Rocket className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">The Challenge</span>
          </div>
          <p className="text-sm text-google-gray leading-relaxed italic">
            "Set a clear target, keep the scope small, and ship daily. Momentum beats perfection."
          </p>
          <div className="mt-4 pt-4 border-t border-google-blue/10 flex items-center justify-between">
            <p className="text-[10px] font-bold text-google-blue uppercase">Netlify AI Shippers Program</p>
            <button 
              onClick={() => (window as any).setActiveTab('article')}
              className="text-xs font-bold text-google-blue hover:underline flex items-center gap-1 group"
            >
              Read My Journey
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </BentoCard>
      </div>

      <ChallengeCTA
        title="Take The 100-in-30 Challenge"
        description="You do not need perfect tools to start. Commit to daily shipping, keep your scope tight, and publish every win. The reps compound faster than you think."
        primaryLabel="I'm In - Start Now"
        secondaryLabel="See Builder Resources"
        onPrimary={() => (window as any).setActiveTab("contact")}
        onSecondary={() => (window as any).setActiveTab("resources")}
      />

      {/* Main CTA for Article */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="google-card p-8 md:p-12 bg-gradient-to-r from-google-blue to-indigo-600 text-white rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="max-w-xl text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4">Want to know the full story?</h3>
          <p className="text-indigo-100 text-lg opacity-90">
            I documented the full story from self-taught experiments to security and AI product work, including what worked, what failed, and what I would repeat.
          </p>
        </div>
        <button 
          onClick={() => (window as any).setActiveTab('article')}
          className="px-8 py-4 bg-white text-google-blue rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl flex items-center gap-2 group whitespace-nowrap"
        >
          Read the Full Article
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}

import React from "react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";

interface ChallengeCTAProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  className?: string;
}

export default function ChallengeCTA({
  title = "Run Your Own 30-Day Build Sprint",
  description = "Pick a scope, commit publicly, and ship daily. Use this challenge as your framework for momentum, proof-of-work, and real skill growth.",
  primaryLabel = "Start the Challenge",
  secondaryLabel = "View Resources",
  onPrimary,
  onSecondary,
  className = "",
}: ChallengeCTAProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#DADCE0] bg-white p-6 md:p-10 shadow-sm transition-all hover:shadow-md ${className}`}>
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="max-w-2xl space-y-3">
          <h3 className="text-2xl md:text-3xl font-semibold text-google-black tracking-tight">
            {title}
          </h3>
          <p className="text-base text-google-gray leading-relaxed px-4">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={onPrimary} 
            className={`px-6 py-2.5 rounded-full font-medium text-white bg-google-blue hover:bg-google-blue/90 transition-all inline-flex items-center gap-2 ${buttonVariants({ className: "w-full sm:w-auto" })}`}
            style={{ backgroundColor: '#1a73e8' }} 
          >
            {primaryLabel} <ArrowRight size={18} />
          </button>
          {onSecondary && (
            <button 
              onClick={onSecondary} 
              className={`px-6 py-2.5 rounded-full font-medium text-google-blue border border-google-blue/30 hover:bg-google-blue/5 transition-all ${buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}`}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
      
      {/* Subtle Google-style accent blobs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-google-blue/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-google-green/5 rounded-full blur-3xl" />
    </div>
  );
}

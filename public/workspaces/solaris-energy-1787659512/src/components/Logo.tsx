import React from 'react';

export const Logo = ({
  className = "",
  showTitle = true,
}: {
  className?: string;
  showTitle?: boolean;
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="grid grid-cols-2 gap-1 rounded-full bg-white p-1.5 border border-[#DADCE0] shadow-sm"
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-google-blue" />
        <span className="h-2.5 w-2.5 rounded-full bg-google-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-google-yellow" />
        <span className="h-2.5 w-2.5 rounded-full bg-google-green" />
      </div>
      {showTitle && (
        <div className="leading-tight">
          <p className="font-display text-[0.95rem] md:text-base font-semibold text-[#202124]">
            100 Websites in 30 Days
          </p>
          <p className="text-[0.67rem] md:text-[0.7rem] uppercase tracking-[0.18em] text-google-gray">
            Zoth Studio Team Challenge
          </p>
        </div>
      )}
    </div>
  );
};

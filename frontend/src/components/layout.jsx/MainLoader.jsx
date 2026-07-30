import React, { useState, useEffect } from "react";

const MainLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFading(true);
            if (onComplete) setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        // Smooth semi-randomized increment
        const increment = Math.floor(Math.random() * 12) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#0b1320] text-white transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Bar Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#0088ff] to-transparent opacity-80" />

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        {/* Brand Logo & Animated Icon */}
        <div className="relative flex flex-col items-center">
          <div className="relative flex items-center justify-center w-24 h-24 mb-4">
            {/* Outer Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#0088ff]/30 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border-2 border-t-[#0088ff] border-r-transparent border-b-transparent border-l-transparent animate-spin" />

            {/* AUTONEX Steering Wheel / Speedometer Icon */}
            <svg
              className="w-10 h-10 text-[#0088ff] drop-shadow-[0_0_12px_rgba(0,136,255,0.6)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-black tracking-widest text-white uppercase">
            AUTO<span className="text-[#0088ff]">NEX</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mt-1">
            Parts That Perform
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-64 space-y-2 text-center">
          <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#0066cc] to-[#00aaff] rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_#0088ff]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>STARTING ENGINE...</span>
            <span className="text-[#0088ff] font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pb-8 text-xs text-slate-500 tracking-wider">
        PREMIUM AUTOMOTIVE PARTS & ACCESSORIES
      </div>
    </div>
  );
};

export default MainLoader;

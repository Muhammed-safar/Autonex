import React from "react";
import { useNavigate } from "react-router-dom";


const HeroBanner = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative bg-[#1A232E] text-white overflow-hidden py-12 lg:py-16">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=1200')`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Banner Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                PARTS THAT PERFORM
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Every Part Counts. <br />
                Choose the Best.
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                From engine to exhaust, we provide top-tier parts that keep your
                vehicle running smoothly.
              </p>

              <div>
                <button onClick={()=> navigate("/shop")} className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-sm px-6 py-3 rounded-md transition-all shadow-md active:scale-95">
                  View All Products
                </button>
              </div>

              {/* Countdown / Campaign info */}
              <p className="text-xs text-gray-400 pt-2">
                Time remaining until the end of the campaign:{" "}
                <span className="font-medium text-gray-200">
                  08 day, 09 hours, 31 min, 52 sec.
                </span>
              </p>
            </div>

            {/* Right Column: Vehicle Part Finder Form */}
           
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;

import React from "react";

const FeaturedBanner = () => {
  return (
    <div>
      <section className="w-full px-4">
        <div className="">
          {/* Left: Interactive Feature Banner */}
          <div className="lg:col-span-7 relative rounded-lg overflow-hidden min-h-[380px] bg-gray-100 flex flex-col justify-between p-8 sm:p-10">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-right bg-no-repeat pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800')`,
              }}
            />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

            <div className="relative z-10 max-w-sm space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                FROM GARAGE TO ROAD
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Fits Your Ride. <br />
                Fuels Your Drive.
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add your vehicle once and enjoy personalized shopping forever.
                Get parts fast, accurate, and stress-free.
              </p>
              <button className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-xs px-5 py-2.5 rounded transition-all shadow">
                Shop Now
              </button>
            </div>
          </div>

          {/* Right: Deal Product List */}
         
        </div>
      </section>
    </div>
  );
};

export default FeaturedBanner;

import React, { useEffect, useRef, useState } from "react";

const banners = [
  {
    id: 1,
    tagline: "YOUR RIDE, OUR PARTS",
    title: "Save Your Vehicle.\nShop Smarter.",
    subtitle: "Get the part. Make the fix. Enjoy the drive.",
    btnText: "Shop Now",
    btnStyle: "bg-[#0066CC] text-white hover:bg-blue-700",
    bgGradient: "from-sky-100 via-sky-50 to-amber-100/30",
    textColor: "text-slate-900",
    taglineColor: "text-slate-500",
    subtitleColor: "text-slate-600",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    tagline: "SPEED MEETS PRECISION",
    title: "Search by Vehicle.\nShop with Ease.",
    subtitle: "Perfect fit, fast delivery, dependable quality.",
    btnText: "Shop Now",
    btnStyle: "bg-white text-slate-900 hover:bg-gray-100",
    bgGradient: "from-stone-900 via-amber-950/80 to-amber-600/40",
    textColor: "text-white",
    taglineColor: "text-stone-400",
    subtitleColor: "text-stone-300",
    image:
      "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    tagline: "FROM GARAGE TO ROAD",
    title: "Add Your Car. Find\nPerfect Parts.",
    subtitle: "Boost performance with high-quality parts.",
    btnText: "Shop Now",
    btnStyle: "bg-white text-slate-900 hover:bg-gray-100",
    bgGradient: "from-slate-950 via-slate-900 to-sky-900/60",
    textColor: "text-white",
    taglineColor: "text-slate-400",
    subtitleColor: "text-slate-300",
    image:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600",
  },
];

const FeatureBanners = () => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // AUTO-SCROLL FUNCTIONALITY (Active only on Mobile & Tablet)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      // Don't auto-scroll if user is hovering/touching OR if we are on Desktop (lg screen)
      if (isPaused || window.innerWidth >= 1024) return;

      const cardWidth = container.firstElementChild?.offsetWidth || 0;
      const gap = 16; // 16px flex gap
      const scrollAmount = cardWidth + gap;

      // Check if we reached the end of the scroll container
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500); // Scroll every 3.5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* 
        LAYOUT CONTROLLER:
        - Mobile (< sm): 1 Card visible (w-full) + Scroll
        - Tablet (md): 2 Cards visible (w-[calc(50%-8px)]) + Scroll
        - Desktop (lg): 3 Columns Grid (lg:grid lg:grid-cols-3)
      */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            /* 
              Responsive Card Widths:
              - Mobile: w-full (Fits 1 card)
              - Tablet: md:w-[calc(50%-8px)] (Fits 2 cards)
              - Desktop: lg:w-full (Grid mode)
            */
            className={`w-full md:w-[calc(50%-8px)] lg:w-full shrink-0 lg:shrink snap-start relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b ${banner.bgGradient} shadow-sm border border-gray-100/10 group cursor-pointer`}
          >
            {/* Background Texture / Image Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 ease-out">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* TOP CONTENT SECTION */}
            <div className="relative z-10 space-y-3">
              {/* Tagline */}
              <p
                className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${banner.taglineColor}`}
              >
                {banner.tagline}
              </p>

              {/* Title */}
              <h2
                className={`text-2xl sm:text-3xl font-extrabold leading-tight whitespace-pre-line ${banner.textColor}`}
              >
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p
                className={`text-xs sm:text-sm font-medium ${banner.subtitleColor}`}
              >
                {banner.subtitle}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all transform active:scale-95 shadow-sm ${banner.btnStyle}`}
                >
                  {banner.btnText}
                </button>
              </div>
            </div>

            {/* BOTTOM IMAGE CONTAINER */}
            <div className="relative z-10 w-full h-36 sm:h-44 mt-4 flex items-end justify-center">
              <img
                src={banner.image}
                alt={banner.title}
                className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Indicator Dots (Mobile & Tablet only) */}
      <div className="flex lg:hidden justify-center items-center gap-1.5 mt-4">
        <span className="w-2.5 h-2.5 rounded-full bg-[#0066CC]"></span>
        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
      </div>
    </section>
  );
};

export default FeatureBanners;

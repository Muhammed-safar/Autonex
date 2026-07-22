import React, { useEffect, useRef, useState } from "react";
import { Award, Wallet, Target } from "lucide-react";

// Feature Icons Section Data
const features = [
  {
    icon: Award,
    title: "Original Products",
    desc: "Vestibulum ante ipsum primis in faucibus.",
  },
  {
    icon: Wallet,
    title: "Affordable Rates",
    desc: "Vestibulum ante ipsum primis in faucibus.",
  },
  {
    icon: Target,
    title: "Wide variety",
    desc: "Vestibulum ante ipsum primis in faucibus.",
  },
];

// Category Grid Data
const categories = [
  {
    id: 1,
    title: "Air Condition",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    title: "Bearings",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    title: "Brakes",
    count: 5,
    image:
      "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    title: "Car Accessories",
    count: 5,
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 5,
    title: "Engine",
    count: 4,
    image:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 6,
    title: "Engine cooling system",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300",
  },
];

const CategorySection = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic active only on small mobile screens (< md)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused || window.innerWidth >= 768) return;

      const cardWidth = container.firstElementChild?.offsetWidth || 0;
      const gap = 12;
      const scrollAmount = cardWidth + gap;

      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* 1. TOP CTA BANNER */}
      <div className="w-full bg-[#0066CC] rounded-xl px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-sm">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Need Help Finding the Right Product?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Our Parts Experts Can Help, Call for immediate assistance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <button className="bg-white text-[#0066CC] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
            Request a Call
          </button>
          <div className="text-center sm:text-left">
            <a
              href="tel:+180012345678"
              className="text-base sm:text-lg font-extrabold block hover:underline"
            >
              +(800) 1234 5678 90
            </a>
            <span className="text-[10px] text-blue-100 block">
              You can contact us 24/7.
            </span>
          </div>
        </div>
      </div>

      {/* 2. FEATURES STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-b border-gray-100 pb-8">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 px-2 ${
                idx !== features.length - 1
                  ? "md:border-r md:border-gray-100"
                  : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0066CC] flex items-center justify-center shrink-0">
                <Icon size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {feat.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CATEGORIES SECTION */}
      <div>
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          /* 
            - Mobile (< md): Flex + scroll 
            - Medium & Large (md+): Grid view with all full cards visible
          */
          className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-4
                    lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              /* Fixed balanced height across viewports */
              className="w-[48%] md:w-[24%] lg:w-full h-[240px] sm:h-[260px] lg:h-[280px] shrink-0 lg:shrink snap-start
                         bg-[#F8FAFC] rounded-2xl p-4 flex flex-col items-center justify-between border border-slate-100
                         hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Image Container */}
              <div className="w-full flex-1 flex items-center justify-center p-2 min-h-0">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Count */}
              <div className="pt-2 shrink-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#0066CC] transition-colors">
                  {cat.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                  {cat.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-[#0066CC]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

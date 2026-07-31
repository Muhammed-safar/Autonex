import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navidate = useNavigate();

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218474/banner-10.jpg_fv2uku.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-slate-500">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-slate-900 font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-slate-700 text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button
              onClick={() => navidate("/shop")}
              className="mt-6 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218782/banner-11.jpg_onsnvn.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-white">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-white font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-white  text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button
              onClick={() => navidate("/category/tires-wheels")}
              className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text- transition hover:bg-gray-200"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218844/banner-12.jpg_vr9pha.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-white">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-white font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-white  text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button
              onClick={() => navidate("/category/headlights-lighting")}
              className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text- transition hover:bg-gray-200"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBanners;

import { useState, useEffect } from "react";

// One slide's content — add more objects here later for a full carousel
const slides = [
  {
    eyebrow: "Refreshing Spring Deals",
    heading: (
      <>
        Add Your Car. <br className="hidden md:block" />
        Find Perfect Parts.
      </>
    ),
    description:
      "Upgrade your ride with premium auto parts built for reliability. Quality-tested components that deliver peace of mind on any road.",
    ctaLabel: "View All Products",
    ctaLink: "/shop",
    image: "https://placehold.co/600x500/f1f5f9/94a3b8?text=Product+Image",
    campaignEndsAt: Date.now() + 1000 * 60 * 60 * 24 * 9, // 9 days from now
  },
];

const getTimeLeft = (targetTime) => {
  const diff = Math.max(targetTime - Date.now(), 0);
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const sec = Math.floor((diff / 1000) % 60);
  return { day, hours, min, sec };
};

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(slide.campaignEndsAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(slide.campaignEndsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [slide.campaignEndsAt]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="grid md:grid-cols-2 items-center gap-10">
        {/* Left: text content */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
            {slide.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {slide.heading}
          </h1>

          <p className="mt-4 text-gray-500 text-sm md:text-base max-w-md">
            {slide.description}
          </p>

          <a
            href={slide.ctaLink}
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-md transition-colors"
          >
            {slide.ctaLabel}
          </a>

          <p className="mt-6 text-xs text-gray-400">
            Time remaining until the end of the campaign:{" "}
            <span className="text-gray-600 font-medium">
              {pad(timeLeft.day)} Day {pad(timeLeft.hours)} hours,{" "}
              {pad(timeLeft.min)} min. {pad(timeLeft.sec)} sec.
            </span>
          </p>
        </div>

        {/* Right: product image */}
        <div className="relative flex justify-center md:justify-end">
          <span className="absolute -top-4 right-0 text-[11px] text-gray-400 hidden md:block">
            Total discount in the campaign
          </span>
          <img
            src={slide.image}
            alt={slide.eyebrow}
            className="max-h-[380px] w-auto object-contain"
          />
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
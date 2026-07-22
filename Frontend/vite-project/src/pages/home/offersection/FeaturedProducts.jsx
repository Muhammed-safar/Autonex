import React, { useEffect, useRef, useState } from "react";
import { Heart, Star } from "lucide-react";

// Left & Right Grid Products Data
const sideProducts = {
  left: [
    {
      id: 1,
      discount: "-28%",
      title: "Vauxhall Zafira MK2 2008-2014 Tail Back Rear Light Lamp Lens",
      price: "$64.95",
      originalPrice: "$89.15",
      available: 3,
      sold: 4,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 2,
      discount: "-25%",
      title: "TYPE S - Remote-Controlled 194_T10 Multicolor LED Mini Bul",
      price: "$7.55",
      originalPrice: "$9.99",
      available: 12,
      sold: 10,
      image: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 3,
      discount: "-30%",
      title: "Sylvania H11 SilverStar ULTRA Halogen Headlight Bulb, 2 Pack",
      price: "$20.19",
      originalPrice: "$28.66",
      available: 11,
      sold: 30,
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300",
    },
  ],
  right: [
    {
      id: 4,
      discount: "-24%",
      title: "ATK Engines HP32C Replace High Performance 350HP Complete",
      price: "$759.25",
      originalPrice: "$998.29",
      available: 5,
      sold: 12,
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 5,
      discount: "-19%",
      title: "Crate Engine - SBC 396 491HP Dressed Model",
      price: "$745.99",
      originalPrice: "$917.77",
      available: 20,
      sold: 15,
      image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 6,
      discount: "-9%",
      title: "SBC 383 Crate Engine - Base Dressed w/Alm Heads",
      price: "$855.26",
      originalPrice: "$936.86",
      available: 20,
      sold: 21,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300",
    },
  ],
};

// Center Spotlight Product Data
const featuredSpotlight = {
  id: 99,
  title: "AKKON - For Dodge Grand Caravan Black Headlights Head Lamps Driver",
  rating: 4.0,
  reviews: 3,
  price: "$129.99",
  image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600",
};

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState([]);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Auto-scroll logic for mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused || window.innerWidth >= 1024) return;

      const cardWidth = container.firstElementChild?.offsetWidth || 0;
      const gap = 16;
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

  // Reusable Horizontal Side Card
  const HorizontalCard = ({ product }) => {
    const total = product.available + product.sold;
    const progressPercent = (product.sold / total) * 100;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-2 flex items-center gap-2.5 hover:shadow-md transition-shadow group h-full w-full min-h-0 overflow-hidden">
        {/* Thumbnail Box */}
        <div className="relative w-24 sm:w-28 h-full bg-[#F8FAFC] rounded-lg shrink-0 flex items-center justify-center p-1.5 min-h-0">
          {/* Discount Badge */}
          <span className="absolute -top-1 -left-1 bg-[#F43F5E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            {product.discount}
          </span>
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div className="min-h-0">
            <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#00A651]">
                {product.price}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                {product.originalPrice}
              </span>
            </div>
          </div>

          {/* Progress Bar & Availability */}
          <div className="space-y-0.5 shrink-0">
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#F43F5E] h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-gray-400 font-medium">
              <span>
                Available:<strong className="text-gray-700 ml-0.5">{product.available}</strong>
              </span>
              <span>
                Sold:<strong className="text-gray-700 ml-0.5">{product.sold}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-4">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Featured Products
          </h2>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Our most ordered products.
          </span>
        </div>
        <a
          href="#"
          className="text-xs font-semibold text-[#0066CC] hover:underline"
        >
          View All
        </a>
      </div>

      {/* 
        MAIN GRID/CAROUSEL CONTAINER
        - Desktop height fixed to 75% of viewport height (75vh) without overflow
      */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto pb-2 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar lg:h-[75vh]"
      >
        {/* LEFT COLUMN (3 Cards stacked evenly inside 75vh) */}
        <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start flex flex-col justify-between gap-2 h-[480px] lg:h-full min-h-0">
          {sideProducts.left.map((item) => (
            <div key={item.id} className="flex-1 min-h-0">
              <HorizontalCard product={item} />
            </div>
          ))}
        </div>

        {/* CENTER COLUMN (Spotlight Card) */}
        <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start bg-white rounded-2xl border-2 border-[#F43F5E] p-3 sm:p-4 flex flex-col justify-between shadow-sm relative group h-[480px] lg:h-full min-h-0 overflow-hidden">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(featuredSpotlight.id)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              size={15}
              className={
                wishlist.includes(featuredSpotlight.id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
          </button>

          {/* Product Image Area */}
          <div className="relative w-full flex-1 bg-[#F8FAFC] rounded-xl p-3 flex items-center justify-center mb-2 min-h-0 overflow-hidden">
            <img
              src={featuredSpotlight.image}
              alt={featuredSpotlight.title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info & CTA */}
          <div className="space-y-1.5 shrink-0">
            {/* Rating */}
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-gray-800 ml-1">
                {featuredSpotlight.rating.toFixed(2)}
              </span>
              <span className="text-gray-400">({featuredSpotlight.reviews})</span>
            </div>

            {/* Title */}
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
              {featuredSpotlight.title}
            </h3>

            {/* Price */}
            <div className="text-base sm:text-lg font-black text-gray-900">
              {featuredSpotlight.price}
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm active:scale-98">
              Add to cart
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (3 Cards stacked evenly inside 75vh) */}
        <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start flex flex-col justify-between gap-2 h-[480px] lg:h-full min-h-0">
          {sideProducts.right.map((item) => (
            <div key={item.id} className="flex-1 min-h-0">
              <HorizontalCard product={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Pagination Indicator Dots */}
      <div className="flex lg:hidden justify-center items-center gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-[#0066CC]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
      </div>
    </section>
  );
};

export default FeaturedProducts;
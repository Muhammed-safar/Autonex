import React, { useState } from "react";
import { Heart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    discount: "32%",
    title: "Zerex G05 Phosphate Free Antifreeze Coolant Concentrate 1",
    rating: 4.33,
    reviews: 3,
    price: "$33.43",
    originalPrice: "$48.55",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    discount: "39%",
    title: "Rislone High Mileage Steering Stop Whine with Leak Repair 4604",
    rating: 4.33,
    reviews: 3,
    price: "$9.88",
    originalPrice: "$15.99",
    image:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    discount: "43%",
    title: "Pennzoil Platinum Full Synthetic 0W-20 Motor Oil, 5 Quart",
    rating: 3.33,
    reviews: 3,
    price: "$26.96",
    originalPrice: "$47.11",
    image:
      "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    discount: "28%",
    title: "Oil Filter - Compatible with 2011 - 2022 Ford",
    rating: 4.33,
    reviews: 3,
    price: "$65.33",
    originalPrice: "$89.99",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 5,
    discount: "39%",
    title: "Mobil 1 Advanced Fuel Economy Full Synthetic Motor Oil 0W-20, 5",
    rating: 4.33,
    reviews: 3,
    price: "$24.72",
    originalPrice: "$39.99",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=300",
  },
];

const categories = ["Oils and fluids", "Tires & Wheels", "Tools & Equipment"];

const BestSeller = () => {
  const [activeCategory, setActiveCategory] = useState("Oils and fluids");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-100 gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Best Seller
          </h2>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors border ${
                  activeCategory === cat
                    ? "border-[#0066CC] text-[#0066CC] bg-blue-50/50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <a
          href="#"
          className="text-xs font-semibold text-[#0066CC] hover:underline shrink-0 hidden sm:block"
        >
          View All
        </a>
      </div>

      {/* PRODUCTS CONTAINER: 
          Mobile (xs/sm): 2 cards per view + scroll
          Tablet (md): 3 cards per view + scroll
          Desktop (lg): Grid 5 cols
      */}
      <div className="flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar">
        {products.map((product) => {
          const isLiked = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              /* 
                - Mobile: w-[calc(50%-6px)] -> Fits 2 cards exactly
                - Tablet: md:w-[calc(33.333%-11px)] -> Fits 3 cards exactly
                - Desktop: lg:w-full -> Fits 5 in grid
              */
              className="w-[calc(50%-6px)] md:w-[calc(33.333%-11px)] lg:w-full shrink-0 lg:shrink snap-start bg-white rounded-xl border border-gray-100 p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
            >
              {/* Image & Badges Container */}
              <div className="relative w-full aspect-square bg-gray-50 rounded-lg p-2 flex items-center justify-center mb-2">
                {/* Discount Badge */}
                <span className="absolute top-1.5 left-1.5 bg-[#0066CC] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {product.discount}
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={13}
                    className={isLiked ? "fill-red-500 text-red-500" : ""}
                  />
                </button>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 mb-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800 ml-0.5">
                      {product.rating}
                    </span>
                    <span className="text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[11px] sm:text-xs font-medium sm:font-semibold text-gray-800 line-clamp-2 leading-snug"
                    title={product.title}
                  >
                    {product.title}
                  </h3>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-sm sm:text-base font-bold text-[#00A651]">
                    {product.price}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicator Dots for Mobile & Tablet */}
      <div className="flex lg:hidden justify-center items-center gap-1.5 mt-3">
        <span className="w-2 h-2 rounded-full bg-[#0066CC]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
      </div>
    </section>
  );
};

export default BestSeller;
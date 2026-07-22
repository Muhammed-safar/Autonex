import React, { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Format price safely to prevent double $ signs (e.g. "$$215.00" -> "$215.00")
  const rawPrice = typeof product.price === 'string' ? product.price.replace(/^\$+/, '') : product.price;
  const formattedPrice = typeof rawPrice === 'number' ? rawPrice.toFixed(2) : rawPrice;

  return (
    <div className="group relative bg-white rounded-xl  shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden p-2 sm:p-3">
      {/* Top Image Section (Reduced aspect ratio & padding to lower overall height) */}
      <div className="relative w-full h-32 sm:h-40 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center mb-2">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-1.5 left-1.5 bg-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
            {product.discount}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
          className="absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all z-10 shadow-xs"
        >
          <Heart
            size={13}
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.title}
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Ratings */}
          <div className="flex items-center gap-1 mb-0.5">
            <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-700 leading-none">
              {product.rating}
            </span>
            <span className="text-[9px] text-slate-400 leading-none">
              ({product.reviewsCount || 0})
            </span>
          </div>

          {/* Title - Strict 2 Line Limit */}
          <h3 className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight mb-1.5 hover:text-[#006bc0] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Action Section */}
        <div className="mt-1">
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-emerald-600">
              ${formattedPrice}
            </span>
            {product.oldPrice && (
              <span className="text-[9px] text-slate-400 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>

          {/* Compact Button */}
          <button className="w-full bg-[#006bc0] hover:bg-[#005aa3] active:bg-[#004a87] text-white font-semibold text-[11px] sm:text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-2xs">
            <ShoppingCart size={13} className="hidden sm:inline-block" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext"; // Adjust path if needed

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const active = isWishlisted(product.id);

  const rawPrice =
    typeof product.price === "string"
      ? product.price.replace(/^\$+/, "")
      : product.price;
  const formattedPrice =
    typeof rawPrice === "number" ? rawPrice.toFixed(2) : rawPrice;

  // --- LIST VIEW ITEM ---
  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-slate-100 p-3 sm:p-4">
        {/* Left: Image Box */}
        <div className="relative w-full sm:w-48 h-40 bg-slate-50 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
          {product.discount && (
            <span className="absolute top-2 left-2 bg-cyan-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
              {product.discount}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Add to wishlist"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all z-10 shadow-xs cursor-pointer"
          >
            <Heart
              size={14}
              className={active ? "fill-red-500 text-red-500" : ""}
            />
          </button>

          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Right: Content & Actions */}
        <div className="flex flex-col flex-1 justify-between w-full h-full py-1">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">
                {product.rating}
              </span>
              <span className="text-[10px] text-slate-400">
                ({product.reviewsCount || 0})
              </span>
            </div>

            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm font-semibold text-slate-800 hover:text-[#006bc0] transition-colors mb-2">
                {product.title}
              </h3>
            </Link>

            {product.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-50">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-600">
                ${formattedPrice}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <button className="bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold text-xs py-2 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs w-full sm:w-auto cursor-pointer">
              <ShoppingCart size={14} />
              <span>Add to cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW ITEM ---
  return (
    <div className="group relative bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden p-2 sm:p-3 border border-slate-100">
      {/* Top Image Section */}
      <div className="relative w-full h-32 sm:h-40 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center mb-2">
        {product.discount && (
          <span className="absolute top-1.5 left-1.5 bg-cyan-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
            {product.discount}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label="Add to wishlist"
          className="absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all z-10 shadow-xs cursor-pointer"
        >
          <Heart
            size={13}
            className={active ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.title}
            className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-700 leading-none">
              {product.rating}
            </span>
            <span className="text-[9px] text-slate-400 leading-none">
              ({product.reviewsCount || 0})
            </span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight mb-1.5 hover:text-[#006bc0] transition-colors">
              {product.title}
            </h3>
          </Link>
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

          <button className="w-full bg-[#006bc0] hover:bg-[#005aa3] active:bg-[#004a87] text-white font-semibold text-[11px] sm:text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer">
            <ShoppingCart size={13} className="hidden sm:inline-block" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
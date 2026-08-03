import React, { useEffect, useRef, useState } from "react";
import { Heart, Star, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/products/useProducts.js";
import { useAddWishlist } from "../../../hooks/wishlist/useAddWishlist.js";
import { useRemoveWishlist } from "../../../hooks/wishlist/useRemoveWishlist.js";
import { useWishlist } from "../../../hooks/wishlist/useWishlist.js";

const FeaturedProducts = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const { mutate: addWishlist } = useAddWishlist();
  const { mutate: removeWishlist } = useRemoveWishlist();
  const { data: wishlistData } = useWishlist();

  // Fetch first 7 featured products
  const { data, isLoading, isError, error, refetch } = useProducts({
    featured: "true",
    limit: 7,
  });

  const wishlistItems = wishlistData?.data || [];
  const products = Array.isArray(data) ? data : data?.data || [];

  const handleWishlist = (product) => {
    const id = product._id || product.id;
    const isLiked = wishlistItems.some(
      (item) => item._id === id || item.product?._id === id
    );

    if (isLiked) {
      removeWishlist(id);
      return;
    }

    addWishlist({
      _id: id,
      name: product.name || product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock ?? 0,
      images: product.images?.length
        ? product.images
        : [{ url: product.image || "" }],
      brand: product.brand,
      category: product.category,
    });
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

  // Horizontal product card (for left/right side columns — uses first 3 and last 3)
  const HorizontalCard = ({ product }) => {
    const id = product._id || product.id;
    const title = product.name || product.title;
    const image =
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      "https://via.placeholder.com/300";
    const price =
      typeof product.price === "number"
        ? `$${product.price.toFixed(2)}`
        : product.price || "";
    const originalPrice =
      typeof product.discountPrice === "number" && product.discountPrice > 0
        ? `$${product.discountPrice.toFixed(2)}`
        : null;
    const available = product.stock ?? 0;
    const sold = product.totalSold ?? 0;
    const total = available + sold || 1;
    const progressPercent = Math.min((sold / total) * 100, 100);

    const discountPct =
      product.discountPrice > 0 && product.price > 0
        ? `-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`
        : null;

    const isLiked = wishlistItems.some(
      (item) => item._id === id || item.product?._id === id
    );

    return (
      <Link
        to={`/product/${id}`}
        className="bg-white rounded-xl border border-gray-100 p-2 flex items-center gap-2.5 hover:shadow-md transition-shadow group h-full w-full min-h-0 overflow-hidden"
      >
        {/* Thumbnail Box */}
        <div className="relative w-24 sm:w-28 h-full bg-[#F8FAFC] rounded-lg shrink-0 flex items-center justify-center p-1.5 min-h-0">
          {/* Discount Badge */}
          {discountPct && (
            <span className="absolute -top-1 -left-1 bg-[#F43F5E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
              {discountPct}
            </span>
          )}
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlist(product);
            }}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              size={11}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />
          </button>
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div className="min-h-0">
            <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
              {title}
            </h3>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#00A651]">
                {price}
              </span>
              {originalPrice && (
                <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
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
                Available:<strong className="text-gray-700 ml-0.5">{available}</strong>
              </span>
              <span>
                Sold:<strong className="text-gray-700 ml-0.5">{sold}</strong>
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // ─── Loading State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Featured Products</h2>
        </div>
        <div className="lg:grid lg:grid-cols-3 gap-3 lg:h-[75vh] hidden">
          {[...Array(3)].map((_, col) => (
            <div key={col} className="flex flex-col gap-2 h-full">
              {[...Array(3)].map((_, row) => (
                <div key={row} className="flex-1 bg-white rounded-xl border border-gray-100 p-2 animate-pulse flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-lg h-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────
  if (isError) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Featured Products</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="text-red-500 mb-2" size={32} />
          <p className="text-sm font-medium text-gray-700">Failed to load featured products.</p>
          <p className="text-xs text-gray-400 mb-4">{error?.message || "Something went wrong."}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0066CC] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={12} /> Try Again
          </button>
        </div>
      </section>
    );
  }

  // Distribute: left (3), center spotlight (1), right (3)
  const leftProducts = products.slice(0, 3);
  const spotlightProduct = products[3] || null;
  const rightProducts = products.slice(4, 7);

  // Spotlight product derived values
  const spotlightId = spotlightProduct?._id || spotlightProduct?.id;
  const spotlightTitle = spotlightProduct?.name || spotlightProduct?.title || "";
  const spotlightImage =
    spotlightProduct?.images?.[0]?.url ||
    spotlightProduct?.images?.[0] ||
    spotlightProduct?.image ||
    "https://via.placeholder.com/600";
  const spotlightPrice =
    typeof spotlightProduct?.price === "number"
      ? `$${spotlightProduct.price.toFixed(2)}`
      : spotlightProduct?.price || "";
  const spotlightRating = spotlightProduct?.rating || 4.5;
  const spotlightReviews = spotlightProduct?.reviewCount || spotlightProduct?.reviews || 0;
  const spotlightIsLiked = wishlistItems.some(
    (item) => item._id === spotlightId || item.product?._id === spotlightId
  );

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
        <Link
          to="/shop"
          className="text-xs font-semibold text-[#0066CC] hover:underline"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          No featured products available right now.
        </div>
      ) : (
        <>
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
              {leftProducts.map((product) => (
                <div key={product._id || product.id} className="flex-1 min-h-0">
                  <HorizontalCard product={product} />
                </div>
              ))}
              {/* Fill empty slots if fewer than 3 */}
              {leftProducts.length < 3 &&
                [...Array(3 - leftProducts.length)].map((_, i) => (
                  <div key={`empty-left-${i}`} className="flex-1 min-h-0" />
                ))}
            </div>

            {/* CENTER COLUMN (Spotlight Card) */}
            {spotlightProduct ? (
              <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start bg-[#fff5f7] rounded-2xl border-2 border-[#F43F5E] p-3 sm:p-4 flex flex-col justify-between relative group h-[480px] lg:h-full min-h-0 overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.12)]">
                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlist(spotlightProduct)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={15}
                    className={spotlightIsLiked ? "fill-red-500 text-red-500" : ""}
                  />
                </button>

                {/* Product Image Area */}
                <Link
                  to={`/product/${spotlightId}`}
                  className="relative w-full flex-1 bg-[#F8FAFC] rounded-xl p-3 flex items-center justify-center mb-2 min-h-0 overflow-hidden"
                >
                  <img
                    src={spotlightImage}
                    alt={spotlightTitle}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

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
                      {spotlightRating}
                    </span>
                    <span className="text-gray-400">({spotlightReviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {spotlightTitle}
                  </h3>

                  {/* Price */}
                  <div className="text-base sm:text-lg font-black text-gray-900">
                    {spotlightPrice}
                  </div>

                  {/* View Product Button */}
                  <Link
                    to={`/product/${spotlightId}`}
                    className="block w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm text-center"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start" />
            )}

            {/* RIGHT COLUMN (3 Cards stacked evenly inside 75vh) */}
            <div className="w-[280px] sm:w-[340px] lg:w-full shrink-0 lg:shrink snap-start flex flex-col justify-between gap-2 h-[480px] lg:h-full min-h-0">
              {rightProducts.map((product) => (
                <div key={product._id || product.id} className="flex-1 min-h-0">
                  <HorizontalCard product={product} />
                </div>
              ))}
              {/* Fill empty slots if fewer than 3 */}
              {rightProducts.length < 3 &&
                [...Array(3 - rightProducts.length)].map((_, i) => (
                  <div key={`empty-right-${i}`} className="flex-1 min-h-0" />
                ))}
            </div>
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="flex lg:hidden justify-center items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#0066CC]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
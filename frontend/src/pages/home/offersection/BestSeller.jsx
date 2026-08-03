import React, { useState, useMemo } from "react";
import { Heart, Star, AlertCircle, RefreshCw } from "lucide-react";
import { useProducts } from "../../../hooks/products/useProducts.js";
import { Link } from "react-router-dom";
import { useAddWishlist } from "../../../hooks/wishlist/useAddWishlist.js";
import { useRemoveWishlist } from "../../../hooks/wishlist/useRemoveWishlist.js";
import { useWishlist } from "../../../hooks/wishlist/useWishlist.js";
import { useCategories } from "../../../hooks/categories/useCategories.js";

// Tab definitions with the exact category names as stored in DB
const CATEGORY_TABS = [
  {
    id: 1,
    name: "Oils & Fluids",
    categoryNames: ["Engine Oil", "Brake Fluid", "Transmission Oil"],
  },
  {
    id: 2,
    name: "Tires & Wheels",
    categoryNames: ["Tyre", "Wheel"],
  },
  {
    id: 3,
    name: "Tools & Equipment",
    categoryNames: ["Spark Plug", "Lifting Equipment", "Brake System"],
  },
];

const BestSeller = () => {
  const { mutate: addWishlist } = useAddWishlist();
  const { mutate: removeWishlist } = useRemoveWishlist();
  const { data: wishlistData } = useWishlist();

  const [activeTab, setActiveTab] = useState(CATEGORY_TABS[0]);

  // Fetch all categories to resolve names → IDs
  const { data: categoryData } = useCategories({ page: 1, search: "" });
  const allCategories = categoryData?.data || [];

  // Find category IDs matching the active tab's category names (case-insensitive)
  const activeCategoryIds = useMemo(() => {
    if (!allCategories.length) return [];
    return allCategories
      .filter((cat) =>
        activeTab.categoryNames.some(
          (name) => name.toLowerCase() === cat.name?.toLowerCase()
        )
      )
      .map((cat) => cat._id);
  }, [allCategories, activeTab]);

  // Join the IDs as a comma-separated string for the API (backend parses CSV IDs)
  const categoryParam = activeCategoryIds.join(",") || undefined;

  const { data, isLoading, isError, error, refetch } = useProducts({
    category: categoryParam,
    limit: 5,
  });

  const wishlistItems = wishlistData?.data || [];
  const products = Array.isArray(data) ? data : data?.data || [];

  // Fixed handleWishlist — now correctly receives the product object
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
      stock: product.stock ?? (product.inStock ? 1 : 0),
      images: product.images?.length
        ? product.images
        : [{ url: product.image || "" }],
      brand: product.brand,
      category: product.category,
    });
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
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors border ${
                  activeTab.id === tab.id
                    ? "border-[#0066CC] text-[#0066CC] bg-blue-50/50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {tab.name}
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

      {/* PRODUCTS CONTAINER */}
      {isLoading ? (
        // Skeleton Loader (5 Items)
        <div className="flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-[calc(50%-6px)] md:w-[calc(33.333%-11px)] lg:w-full shrink-0 lg:shrink bg-white rounded-xl border border-gray-100 p-2.5 sm:p-3 animate-pulse"
            >
              <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-1" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        // Error State
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="text-red-500 mb-2" size={32} />
          <p className="text-sm font-medium text-gray-700">
            Failed to load products.
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {error?.message || "Something went wrong."}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0066CC] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={12} /> Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        // Empty State
        <div className="py-12 text-center text-gray-500 text-sm">
          No best sellers found for "{activeTab.name}".
        </div>
      ) : (
        // Products Display Grid/Carousel
        <div className="flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar">
          {products.slice(0, 5).map((product) => {
            const id = product._id || product.id;

            const isLiked = wishlistItems.some(
              (item) => item._id === id || item.product?._id === id
            );
            const title = product.title || product.name;
            const image =
              product.image ||
              product.images?.[0]?.url ||
              product.images?.[0] ||
              "https://via.placeholder.com/300";
            const price =
              typeof product.price === "number"
                ? `$${product.price.toFixed(2)}`
                : product.price;
            const originalPrice =
              typeof product.originalPrice === "number"
                ? `$${product.originalPrice.toFixed(2)}`
                : product.originalPrice;
            const rating = product.rating || 4.5;
            const reviews = product.reviews || product.reviewCount || 0;
            const discount = product.discountPrice || null;

            return (
              <Link
                to={`/product/${id}`}
                key={id}
                className="w-[calc(50%-6px)] md:w-[calc(33.333%-11px)] lg:w-full shrink-0 lg:shrink snap-start bg-white rounded-xl border border-gray-100 p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
              >
                {/* Image & Badges Container */}
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg p-2 flex items-center justify-center mb-2">
                  {/* Discount Badge */}
                  {discount && (
                    <span className="absolute top-1.5 left-1.5 bg-[#0066CC] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                      {discount}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlist(product);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={13}
                      className={isLiked ? "fill-red-500 text-red-500" : ""}
                    />
                  </button>

                  {/* Product Image */}
                  <img
                    src={image}
                    alt={title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
                        {rating}
                      </span>
                      <span className="text-gray-400">({reviews})</span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-[11px] sm:text-xs font-medium sm:font-semibold text-gray-800 line-clamp-2 leading-snug"
                      title={title}
                    >
                      {title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-sm sm:text-base font-bold text-[#00A651]">
                      {price}
                    </span>
                    {originalPrice && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        {originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

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
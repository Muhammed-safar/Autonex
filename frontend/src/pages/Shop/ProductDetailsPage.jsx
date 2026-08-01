import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import ProductCard from "./ProductCard.jsx";
import {
  Call,
  Facebook,
  MiniCart,
  Pinterest,
  Twitter,
  Whatsapp,
} from "../../assets/icon.js";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useProduct } from "../../hooks/products/useProduct.js";
import { useAddToCart } from "../../hooks/cart/useAddToCart";

const ProductDetailsPage = ({ productId: propProductId }) => {
  const params = useParams();
  const productId = propProductId || params.id;

  const { data, isLoading, isError } = useProduct(productId);

  const { mutate: addToCart, isPending } = useAddToCart();

  // UI Interactive States
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const { toggleWishlist, isWishlisted } = useWishlist();

  // 3. Locate active product details from dynamic response or fallback
  const currentProduct = useMemo(() => {
    const found = data?.data;

    if (found) {
      return {
        id: found._id,
        title: found.name || "Untitled Product",
        price: found.price || 0,
        oldPrice:
          found.discountPrice > 0 && found.discountPrice < found.price
            ? found.price
            : null,
        rating: found.rating || 5,
        category:
          typeof found.category === "object" ? found.category?.name : "General",
        brand: typeof found.brand === "object" ? found.brand?.name : "Generic",
        images:
          found.images?.length > 0 ? found.images.map((img) => img.url) : [],
        description: found.description || "",
        inStock: (found.stock || 0) > 0,
        sku: found.sku || found._id?.substring(0, 10).toUpperCase(),
      };
    }

    // Fallback static mock object if fetching single ID directly or loading
    return {
      id: productId,
      title: "Zerex G05 Phosphate Free Antifreeze Coolant Concentrate 1 GA",
      price: 33.43,
      oldPrice: 48.55,
      rating: 5,
      category: "Oils and fluids",
      brand: "Castrol",
      images: [],
      description:
        "High-quality additives protect against leaks and won't harm gaskets...",
      inStock: true,
      sku: "UGW7674051",
    };
  }, [data, productId]);

  // Map images gallery from real product data or use placeholder frames
  const imageGallery = useMemo(() => {
    if (currentProduct.images && currentProduct.images.length > 0) {
      return currentProduct.images;
    }
    return ["Asset 1", "Asset 2", "Asset 3"];
  }, [currentProduct]);

  // Extract related items (excluding current product)
  const relatedProducts = useMemo(() => {
    const rawList = Array.isArray(data?.data) ? data.data : [];
    return rawList
      .filter((item) => item._id !== productId)
      .slice(0, 5)
      .map((product) => ({
        id: product._id,
        sku: product.sku || product._id?.substring(0, 8),
        title: product.name || "Untitled Product",
        price: product.price ? `$${product.price}` : "$0.00",
        oldPrice: product.discountPrice ? `$${product.discountPrice}` : null,
        rating: product.rating || 4,
        reviewsCount: product.reviewsCount || 0,
        discount:
          product.discountPrice && product.price
            ? `${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`
            : null,
      }));
  }, [data, productId]);

  const isCurrentWishlisted = isWishlisted(currentProduct.id);

  const handleAddToCart = () => {
    addToCart({
      productId: currentProduct.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="animate-pulse flex flex-col gap-4 w-full">
          <div className="h-6 sm:h-8 bg-slate-200 rounded w-1/2 sm:w-1/3"></div>
          <div className="h-64 sm:h-96 bg-slate-100 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 px-3 sm:px-6 md:px-8 font-sans text-slate-600 antialiased">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-xs">
        {/* Breadcrumbs */}
        <nav className="flex text-xs text-slate-400 mb-4 items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:underline cursor-pointer">
            Home
          </Link>{" "}
          /
          <span className="hover:underline cursor-pointer shrink-0">
            {currentProduct.category}
          </span>{" "}
          /
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">
            {currentProduct.title}
          </span>
        </nav>

        {/* Product Heading Info */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2 leading-tight">
            {currentProduct.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`fill-current ${
                    i < Math.floor(currentProduct.rating)
                      ? "text-[#f5b300]"
                      : "text-slate-200"
                  }`}
                />
              ))}
              <span className="text-slate-900 font-bold ml-1">
                {currentProduct.rating}
              </span>
            </div>

            <span className="text-slate-500">
              Sku:{" "}
              <strong className="text-slate-800">{currentProduct.sku}</strong>
            </span>

            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
              {currentProduct.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-10">
          {/* Left Column: Image Area */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="w-full border border-slate-100 aspect-square bg-white rounded-md flex items-center justify-center overflow-hidden relative">
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#0062bd] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs z-10">
                22%
              </span>

              {imageGallery[selectedImage]?.startsWith("http") ? (
                <img
                  src={imageGallery[selectedImage]}
                  alt={currentProduct.title}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-10/12 h-10/12 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-300 text-sm font-medium border border-slate-100 p-4 text-center">
                  <span className="text-lg font-bold text-slate-400 block mb-1">
                    {currentProduct.brand}
                  </span>
                  Product Asset Large Image ({selectedImage + 1})
                </div>
              )}
            </div>

            {/* Gallery Selector */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
              {imageGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-white overflow-hidden p-1 flex items-center justify-center text-[10px] text-slate-300 transition-all cursor-pointer ${
                    selectedImage === index
                      ? "border-2 border-[#006bc0] ring-1 ring-[#006bc0]"
                      : "border border-slate-200"
                  }`}
                >
                  {img?.startsWith("http") ? (
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    `Asset ${index + 1}`
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                {currentProduct.description ||
                  "High-quality additives protect against leaks and won't harm gaskets, hoses, plastics or original vehicle finish."}
              </p>

              {/* Price Metrics */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#00a062] tracking-tight">
                  ${Number(currentProduct.price).toFixed(2)}
                </span>
                {currentProduct.oldPrice && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
                    ${Number(currentProduct.oldPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Live Status Box */}
              <div className="flex bg-[#FFF1E6] text-orange-600 text-xs p-3 mb-4 items-center gap-2 rounded-lg">
                <span className="shrink-0 flex items-center">
                  <MiniCart size={14} />
                </span>
                <p className="leading-tight">
                  This product has been added to{" "}
                  <strong className="text-orange-600 font-bold">
                    3 people's
                  </strong>{" "}
                  carts.
                </p>
              </div>

              {/* Operations row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-semibold text-slate-900 w-12 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isPending || !currentProduct.inStock}
                  className="w-full sm:flex-1 bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
                >
                  {isPending ? "Adding..." : "Add to cart"}
                </button>
              </div>

              {/* Secondary Utility Links */}
              <div className="flex items-center gap-6 text-xs text-slate-600 mb-6 border-b border-slate-100 pb-4">
                <button
                  onClick={() => toggleWishlist(currentProduct)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isCurrentWishlisted
                      ? "text-red-500 font-semibold"
                      : "hover:text-red-500 text-slate-600"
                  }`}
                >
                  <Heart
                    size={14}
                    className={
                      isCurrentWishlisted ? "fill-red-500 text-red-500" : ""
                    }
                  />
                  {isCurrentWishlisted ? "In Wishlist" : "Add to wishlist"}
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#006bc0] transition-colors cursor-pointer">
                  <RefreshCw size={14} /> Compare
                </button>
              </div>
            </div>

            {/* Delivery / Guarantee Badges */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 flex flex-col gap-3 text-xs mb-6">
              <div className="flex gap-2.5 items-start">
                <Truck size={16} className="text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-medium">
                    Dispatch within 24 Hours:
                  </strong>
                  <span className="text-slate-500 ml-1">
                    Your product will be shipped quickly.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <ShieldCheck
                  size={16}
                  className="text-slate-700 shrink-0 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 font-medium">
                    3-Year Warranty:
                  </strong>
                  <span className="text-slate-500 ml-1">
                    Browse safe with warranty conditions.
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Grid & Metadata Tags */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-800">Share:</span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Facebook />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Twitter />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Pinterest />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Whatsapp />
                </span>
              </div>
              <div className="flex sm:flex-col gap-3 sm:gap-1 items-start sm:items-end text-left sm:text-right text-[11px]">
                <p>
                  <span className="text-slate-400">Category:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    {currentProduct.category}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Brand:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    {currentProduct.brand}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Workspace */}
        <div className="border-t border-slate-200 pt-6 mb-12">
          <div className="flex gap-4 sm:gap-6 border-b border-slate-100 mb-4 text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === "description"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === "info"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Reviews (3)
            </button>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed space-y-4">
            {activeTab === "description" && (
              <div>
                <div className={!isExpanded ? "line-clamp-3" : ""}>
                  <p>
                    {currentProduct.description ||
                      "No full description provided."}
                  </p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-[#006bc0] font-semibold hover:underline text-xs flex items-center gap-1 focus:outline-none cursor-pointer"
                >
                  {isExpanded ? "Show Less" : "Read More..."}
                </button>
              </div>
            )}
            {activeTab === "info" && (
              <p className="text-slate-600">
                Specifications for SKU {currentProduct.sku} under category{" "}
                {currentProduct.category}.
              </p>
            )}
            {activeTab === "reviews" && (
              <p className="text-slate-600">
                Customer feedback profiles and historic validation logs for{" "}
                {currentProduct.title}.
              </p>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Related products
            </h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-thin sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="min-w-[220px] sm:min-w-0 sm:w-auto shrink-0 snap-start"
                >
                  <ProductCard product={prod} viewMode="grid" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

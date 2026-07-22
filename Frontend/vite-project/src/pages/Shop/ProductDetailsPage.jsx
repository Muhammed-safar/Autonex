import React, { useState } from "react";
import {
  Heart,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Phone,
  HelpCircle,
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
} from "../../assets/icons.js";

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const images = ["Thumb 1", "Thumb 2", "Thumb 3"];

  // Formatted data array to feed directly into ProductCard props
  const relatedProducts = [
    {
      id: 1,
      sku: "UGW7674051",
      title:
        "Catalytic converter cleaner high quality pass emissions test cleans",
      price: "$21.18",
      oldPrice: "$38.45",
      rating: 4.67,
      reviews: 3,
      badge: "45%",
    },
    {
      id: 2,
      sku: "UGW7674052",
      title: "Mobil 1 Advanced Fuel Economy Full Synthetic Motor Oil 0W-20, 5",
      price: "$24.72",
      oldPrice: "$28.99",
      rating: 4.33,
      reviews: 6,
      badge: "30%",
    },
    {
      id: 3,
      sku: "UGW7674053",
      title: "Pennzoil Platinum Full Synthetic 0W-20 Motor Oil, 5 Quart",
      price: "$26.96",
      oldPrice: "$41.11",
      rating: 3.33,
      reviews: 4,
      badge: "43%",
    },
    {
      id: 4,
      sku: "UGW7674054",
      title: "Rislone High Mileage Steering Stop Whine With Leak Repair 4934",
      price: "$9.88",
      oldPrice: "$15.88",
      rating: 4.33,
      reviews: 3,
      badge: "38%",
    },
    {
      id: 5,
      sku: "UGW7674055",
      title: "Oil Filter - Compatible with 2011 - 2022 Ford",
      price: "$65.33",
      oldPrice: "$88.99",
      rating: 4.33,
      reviews: 9,
      badge: "25%",
    },
  ];

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 font-sans text-slate-600 antialiased">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6">
        {/* Breadcrumbs */}
        <nav className="flex text-xs text-slate-400 mb-4 flex items-center gap-1.5">
          <span className="hover:underline cursor-pointer">Home</span> /
          <span className="hover:underline cursor-pointer shrink-0">
            Oils and fluids
          </span>{" "}
          /
          <span className="text-slate-600 truncate">
            Zerex G05 Phosphate Free Antifreeze Coolant Concentrate 1 GA
          </span>
        </nav>

        {/* Product Heading Info */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Zerex G05 Phosphate Free Antifreeze Coolant Concentrate 1 GA
          </h1>
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-current text-[#f5b300]"
                />
              ))}
              <span className="text-slate-900 font-bold ml-1">3</span>
            </div>

            <span className="text-slate-500">
              Sku: <strong className="text-slate-800">UGW7674051</strong>
            </span>

            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
              In Stock
            </span>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Left Column: Image Area */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="w-full border border-slate-100 aspect-square bg-white rounded-md flex items-center justify-center overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-[#0062bd] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                22%
              </span>
              <div className="w-10/12 h-10/12 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-300 text-sm font-medium border border-slate-100 p-4 text-center">
                <span className="text-lg font-bold text-slate-400 block mb-1">
                  ZEREX BY VALVOLINE
                </span>
                Product Asset Large Image ({selectedImage + 1})
              </div>
            </div>

            {/* Gallery Selector */}
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bo rounded-lg bg-white overflow-hidden p-1 flex items-center justify-center text-[10px] text-slate-300 transition-all ${
                    selectedImage === index
                      ? "border-[#006bc0] ring-1 ring-[#006bc0]"
                      : "border-slate-200"
                  }`}
                >
                  Asset {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout Config Actions */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                High-quality additives protect against leaks and won't harm
                gaskets, hoses, plastics or original vehicle finish
              </p>

              {/* Price Metrics */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-[#00a062] tracking-tight">
                  $33.43
                </span>
                <span className="text-sm text-slate-400 line-through font-normal">
                  $48.55
                </span>
              </div>

              {/* Live Status Box */}
              <div className="flex bg-[#FFF1E6] text-orange-600 text-xs  p-3 mb-4 items-center gap-2 ">
                {/* Flex Item 1: Icon */}
                <span className="shrink-0 flex items-center">
                  <MiniCart size={14} />
                </span>

                {/* Flex Item 2: Text Wrapper (Prevents awkward flex splitting) */}
                <p className="leading-tight">
                  This product has been added to{" "}
                  <strong className="text-orange-600 font-bold">
                    3 people's
                  </strong>{" "}
                  carts.
                </p>
              </div>

              {/* Vehicle Check Widget */}
              <div className="bg-[#FFF1E6] border-b-2 border-orange-400 p-3 text-xs mb-5 flex items-center justify-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span>
                    <span className="underline font-medium cursor-pointer">
                      Check
                    </span>{" "}
                    if this fits your vehicle.
                  </span>
                </span>
              </div>

              {/* Operations row: Quantity selectors + Core Action */}
              <div className="flex gap-3 mb-5">
                <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
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
                <button className="flex-1 bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors shadow-xs">
                  Add to cart
                </button>
              </div>

              {/* Secondary Utility Links */}
              <div className="flex items-center gap-6 text-xs text-slate-600 mb-6 border-b border-slate-100 pb-4">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <Heart size={14} /> Add to wishlist
                </button>
                <button className="flex items-center gap-1.5 hover:text-[#006bc0] transition-colors">
                  <RefreshCw size={14} /> Compare
                </button>
              </div>
            </div>

            {/* Delivery / Guarantee Badges */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 text-xs mb-6">
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

            {/* Direct Contact Banner */}
            <div className="flex items-center gap-3  text-[#008552] rounded-xl p-3 mb-6 text-xs">
              <div className="p-2 bg-white rounded-lg text-[#00a062] shrink-0 flex items-center">
                <Call />
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">
                  Our customer representative is waiting for you.
                </p>
                <p className="font-semibold text-slate-900 text-sm">
                  Call for immediate assistance at{" "}
                  <span className="text-black font-bold underline">
                    1-212-600-0600
                  </span>
                </p>
              </div>
            </div>

            {/* Social Share Grid & Metadata Tags */}
            <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-800">Share:</span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                  <Facebook />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                  <Twitter />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                  <Pinterest />
                </span>
                <span className="p-1.5 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                  <Whatsapp />
                </span>
              </div>
              <div className="flex flex-col gap-1 items-end text-right text-[11px]">
                <p>
                  <span className="text-slate-400">Category:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    Oils and fluids
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Brand:</span>{" "}
                  <span className="font-semibold text-slate-800">Castrol</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Triple Action Value Blocks */}
        {/* Triple Action Value Blocks */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-10">
          <div className="border border-slate-100 rounded-lg p-2 md:p-4 flex flex-col items-center text-center bg-slate-50/50">
            <Truck
              size={18}
              className="text-slate-800 mb-1 md:mb-2 md:w-6 md:h-6"
            />
            <h5 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight md:mb-1">
              Fast Shipping
            </h5>
            <p className="hidden md:block text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Integer mattis ultrices augue, ac bibendum arcu viverra vel. Etiam
              eu facilisis velit.
            </p>
          </div>

          <div className="border border-slate-100 rounded-lg p-2 md:p-4 flex flex-col items-center text-center bg-slate-50/50">
            <RefreshCw
              size={18}
              className="text-slate-800 mb-1 md:mb-2 md:w-6 md:h-6"
            />
            <h5 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight md:mb-1">
              Easy Return
            </h5>
            <p className="hidden md:block text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Integer mattis ultrices augue, ac bibendum arcu viverra vel. Etiam
              eu facilisis velit.
            </p>
          </div>

          <div className="border border-slate-100 rounded-lg p-2 md:p-4 flex flex-col items-center text-center bg-slate-50/50">
            <ShieldCheck
              size={18}
              className="text-slate-800 mb-1 md:mb-2 md:w-6 md:h-6"
            />
            <h5 className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight md:mb-1">
              Warranty Policy
            </h5>
            <p className="hidden md:block text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Integer mattis ultrices augue, ac bibendum arcu viverra vel. Etiam
              eu facilisis velit.
            </p>
          </div>
        </div>

      
        {/* Tabbed Interactive Information Workspace */}
        <div className="border-t border-slate-200 pt-6 mb-12">
          <div className="flex gap-6 border-b border-slate-100 mb-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 transition-all ${
                activeTab === "description"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-2 transition-all ${
                activeTab === "info"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 transition-all ${
                activeTab === "reviews"
                  ? "text-[#006bc0] border-b-2 border-[#006bc0] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Reviews (3)
            </button>
          </div>

          {/* Description Panel with Read More / Show Less Toggle */}
          <div className="text-xs text-slate-500 leading-relaxed space-y-4">
            {activeTab === "description" && (
              <div>
                <div className={!isExpanded ? "line-clamp-2" : ""}>
                  <p className="mb-2">
                    Quisque varius diam vel metus mattis, id aliquam diam
                    rhoncus. Proin vitae magna in dui finibus malesuada et at
                    nulla. Morbi elit ex, viverra vitae ante vel, blandit
                    feugiat ligula. Fusce fermentum iaculis nibh, at sodales leo
                    maximus a. Nullam ultricies sodales nunc, in pellentesque
                    lorem mattis quis. Cras imperdiet est in nunc tristique
                    lacinia. Nullam aliquam mauris eu accumsan tincidunt.
                    Suspendisse velit ex, aliquet vel ornare vel, dignissim a
                    tortor.
                  </p>
                  <p>
                    Morbi ut sapien vitae odio accumsan gravida. Morbi vitae
                    erat auctor, eleifend nunc a, lobortis neque. Praesent
                    aliquam dissim viverra. Maecenas lacus odio, feugiat eu nunc
                    sit amet, maximus sagittis dolor. Vivamus nisi sapien,
                    elementum sit amet eros sit amet, ultricies cursus ipsum.
                    Sed consequat luctus ligula. Curabitur laoreet rhoncus
                    blandit.
                  </p>
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-[#006bc0] font-semibold hover:underline text-xs flex items-center gap-1 focus:outline-none"
                >
                  {isExpanded ? "Show Less" : "Read More..."}
                </button>
              </div>
            )}

            {activeTab === "info" && (
              <p className="text-slate-600">
                Product dimensions, manufacturing standards, and chemical safety
                information listings reside here.
              </p>
            )}

            {activeTab === "reviews" && (
              <p className="text-slate-600">
                Customer feedback profiles and historic validation logs are
                listed within this area panel.
              </p>
            )}
          </div>
        </div>

        {/* Related Products Rack Component section */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Related products
          </h3>

          {/* Horizontal scroll below md, Grid layout on md and above */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-thin  md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:pb-0">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="min-w-[220px] w-[20vw] sm:w-[260px] md:w-auto shrink-0 snap-start"
              >
                <ProductCard product={prod} viewMode="grid" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

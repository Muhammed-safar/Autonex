import React, { useState } from "react";
import {
  X,
  Package,
  Tag,
  Boxes,
  Car,
  Layers,
  Star,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useProduct } from "../../../hooks/products/useProduct"; // Adjust path as needed

const ProductDetailsModal = ({ productId, isOpen, onClose }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { data: productResponse, isLoading, error } = useProduct(productId);

  if (!isOpen || !productId) return null;

  // Safely extract product object based on common API wrapper shapes
  const product = productResponse?.data || productResponse || {};

  const images = product.images || [];
  const currentImage = images[activeImageIdx]?.url || images[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#0066B2]" />
            <h2 className="text-sm font-bold text-slate-800">
              Product Overview Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-7 w-7 animate-spin text-[#0066B2] mb-2" />
              <span className="font-medium text-xs">
                Loading product details...
              </span>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-rose-50 p-4 text-center text-rose-600 font-medium border border-rose-200">
              Failed to load product details. Please try again.
            </div>
          ) : (
            <>
              {/* Product Top Grid: Image Gallery + Primary Overview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Image Gallery (Left 5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  <div className="relative aspect-square w-full rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center group">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Package className="w-10 h-10 stroke-[1.5]" />
                        <span className="text-[11px] mt-1 font-medium">
                          No Image Available
                        </span>
                      </div>
                    )}

                    {/* Image Nav Indicators */}
                    {images.length > 1 && (
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() =>
                            setActiveImageIdx((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1,
                            )
                          }
                          className="p-1 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow pointer-events-auto"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImageIdx((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="p-1 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow pointer-events-auto"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={img._id || idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-12 h-12 rounded-lg border overflow-hidden shrink-0 bg-slate-50 p-0.5 transition ${
                            activeImageIdx === idx
                              ? "border-[#0066B2] ring-2 ring-[#0066B2]/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover rounded-md"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Info (Right 7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </span>

                      {product.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          <Sparkles className="w-3 h-3 fill-amber-500" />{" "}
                          Featured
                        </span>
                      )}

                      <span className="text-slate-400 font-mono text-[11px] ml-auto">
                        SKU:{" "}
                        <strong className="text-slate-700">
                          {product.sku || "N/A"}
                        </strong>
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {product.name}
                    </h3>

                    {/* Brand & Category badges */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {product.brand && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50">
                          {product.brand.logo?.url && (
                            <img
                              src={product.brand.logo.url}
                              alt={product.brand.name}
                              className="w-4 h-4 object-contain rounded"
                            />
                          )}
                          <span className="font-semibold text-slate-700">
                            {product.brand.name}
                          </span>
                          {product.brand.website && (
                            <a
                              href={product.brand.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-[#0066B2]"
                              title="Visit Brand Website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}

                      {product.category && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                          {product.category.icon && (
                            <img
                              src={product.category.icon}
                              alt=""
                              className="w-4 h-4 object-contain"
                            />
                          )}
                          <span className="font-semibold">
                            {product.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Stock Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Price
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-base font-extrabold text-slate-900">
                          <Price
                            amount={product.discountPrice ?? product.price}
                            currency={product.currency || "USD"}
                            className="text-base font-extrabold text-slate-900"
                          />
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs text-slate-400 line-through font-medium">
                            <Price
                              amount={product.price}
                              currency={product.currency || "USD"}
                              className="text-xs text-slate-400 line-through font-medium"
                            />
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Stock Available
                      </span>
                      <span
                        className={`text-sm font-bold mt-0.5 block ${
                          product.stock > 10
                            ? "text-slate-800"
                            : product.stock > 0
                              ? "text-amber-600"
                              : "text-rose-600"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Total Sold
                      </span>
                      <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                        {product.totalSold ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Description
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {product.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Section 2: Product Variants & Compatible Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Variants */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase text-[11px]">
                    <Layers className="w-4 h-4 text-[#0066B2]" />
                    <span>Variants ({product.variants?.length || 0})</span>
                  </div>

                  {product.variants && product.variants.length > 0 ? (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {product.variants.map((v) => (
                        <div
                          key={v._id || v.name}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {v.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Stock: {v.stock}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">
                              ${v.discountPrice ?? v.price}
                            </span>
                            {v.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ${v.price}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No specific variants configured.
                    </p>
                  )}
                </div>

                {/* Compatible Vehicles */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase text-[11px]">
                    <Car className="w-4 h-4 text-[#0066B2]" />
                    <span>
                      Compatible Vehicles (
                      {product.compatibleVehicles?.length || 0})
                    </span>
                  </div>

                  {product.compatibleVehicles &&
                  product.compatibleVehicles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                      {product.compatibleVehicles.map((veh, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md border border-slate-200 bg-white font-medium text-slate-700 text-xs flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0066B2]"></span>
                          {veh.make} {veh.model} ({veh.year})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Universal fit / No vehicle compatibility declared.
                    </p>
                  )}
                </div>
              </div>

              {/* Metadata Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                <span className="font-mono">ID: {product._id}</span>
                <div className="flex items-center gap-4">
                  {product.createdAt && (
                    <span>
                      Created:{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {product.updatedAt && (
                    <span>
                      Updated:{" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

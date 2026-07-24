import React, { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Star,
  Check,
  X,
  Plus,
  GitCompare,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Anzo USA - 111530A FORD F-150 15-17 FULL LED PROJECTOR HEADLIGHTS",
    image: "https://via.placeholder.com/200x200?text=Anzo+Headlights",
    price: "$117.25",
    originalPrice: "$145.00",
    rating: 4.8,
    reviewsCount: 24,
    availability: "In Stock",
    sku: "ANZ-111530A",
    brand: "Anzo USA",
    category: "Headlights & Lighting",
    fitment: "2015-2017 Ford F-150",
    warranty: "2 Years Limited",
    specs: {
      "Light Source": "Full LED",
      "Housing Color": "Black",
      "Lens Color": "Clear",
      Voltage: "12V",
      "SAE/DOT Compliant": "Yes",
      "Waterproof Rating": "IP67",
    },
  },
  {
    id: 2,
    name: "Spyder BMW E90 3-Series 06-08 4DR Headlights - Halogen Model Only",
    image: "https://via.placeholder.com/200x200?text=Spyder+Headlights",
    price: "$188.99",
    originalPrice: "$210.00",
    rating: 4.5,
    reviewsCount: 18,
    availability: "In Stock",
    sku: "SPY-PRO-E90",
    brand: "Spyder Auto",
    category: "Headlights & Lighting",
    fitment: "2006-2008 BMW 3-Series",
    warranty: "1 Year Limited",
    specs: {
      "Light Source": "Halogen / LED Halo",
      "Housing Color": "Black",
      "Lens Color": "Clear",
      Voltage: "12V",
      "SAE/DOT Compliant": "Yes",
      "Waterproof Rating": "IP65",
    },
  },
];

const ComparePage =() => {
  // Store products by slot index (e.g. up to 4 comparison slots)
  const MAX_SLOTS = 2;
  const [slots, setSlots] = useState(() => {
    const filled = [...initialProducts];
    while (filled.length < MAX_SLOTS) {
      filled.push(null);
    }
    return filled;
  });

  const handleRemoveSlot = (index) => {
    const updated = [...slots];
    updated[index] = null;
    setSlots(updated);
  };

  const handleClearAll = () => {
    setSlots(Array(MAX_SLOTS).fill(null));
  };

  const activeProducts = slots.filter(Boolean);

  // Extract all unique spec keys from present products
  const specKeys = Array.from(
    new Set(activeProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
      {/* ----------------- BREADCRUMBS ----------------- */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-400">
        <span>Home</span> <span className="mx-1">/</span>{" "}
        <span className="text-gray-600 font-medium">Compare Products</span>
      </div>

      {/* ----------------- MAIN COMPARISON CONTENT ----------------- */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Compare Products</h1>
          {activeProducts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Comparison
            </button>
          )}
        </div>

        {activeProducts.length === 0 ? (
          /* Empty State when zero items remain */
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <GitCompare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              No products to compare
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add items from the store to compare their features and specs.
            </p>
            <button className="mt-4 bg-[#0066B2] hover:bg-[#005290] text-white text-xs font-bold px-5 py-2.5 rounded transition">
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Comparison Grid / Table */
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="w-48 p-4 text-left font-bold text-gray-500 uppercase bg-gray-50 border-b border-r border-gray-200 min-w-[160px]">
                    Features
                  </th>
                  {slots.map((product, index) => (
                    <th
                      key={index}
                      className="p-4 border-b border-r border-gray-200 min-w-[260px] max-w-[300px] align-top relative"
                    >
                      {product ? (
                        <>
                          <button
                            onClick={() => handleRemoveSlot(index)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition"
                            title="Remove product"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Product Overview Card */}
                          <div className="text-center pt-2">
                            <div className="h-44 w-full flex items-center justify-center mb-3 p-2 bg-gray-50 rounded">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <h2 className="font-semibold text-gray-800 text-xs hover:text-[#0066B2] cursor-pointer line-clamp-2 min-h-[32px] text-left">
                              {product.name}
                            </h2>

                            {/* Rating */}
                            <div className="flex items-center gap-1 my-2">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3 fill-current"
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] text-gray-400">
                                ({product.reviewsCount})
                              </span>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-lg font-bold text-[#0066B2]">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Add to Cart CTA */}
                            <button className="w-full bg-[#0066B2] hover:bg-[#005290] text-white font-bold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition">
                              <ShoppingCart className="w-3.5 h-3.5" /> Add to
                              cart
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Empty Slot Placeholder */
                        <div className="h-full min-h-[260px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066B2] flex items-center justify-center mb-2">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 mb-1">
                            Add Product
                          </span>
                          <p className="text-[11px] text-gray-400 text-center mb-3">
                            Select an item to compare side-by-side
                          </p>
                          <button className="border border-[#0066B2] text-[#0066B2] hover:bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded transition">
                            Browse Products
                          </button>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {/* Availability Row */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                    Availability
                  </td>
                  {slots.map((p, i) => (
                    <td key={i} className="p-3 border-r border-gray-200">
                      {p ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <Check className="w-3.5 h-3.5" /> {p.availability}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* SKU Row */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                    SKU
                  </td>
                  {slots.map((p, i) => (
                    <td
                      key={i}
                      className="p-3 border-r border-gray-200 text-gray-600"
                    >
                      {p?.sku || "-"}
                    </td>
                  ))}
                </tr>

                {/* Brand Row */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                    Brand
                  </td>
                  {slots.map((p, i) => (
                    <td
                      key={i}
                      className="p-3 border-r border-gray-200 font-medium text-gray-700"
                    >
                      {p?.brand || "-"}
                    </td>
                  ))}
                </tr>

                {/* Vehicle Fitment Row */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                    Fitment
                  </td>
                  {slots.map((p, i) => (
                    <td
                      key={i}
                      className="p-3 border-r border-gray-200 text-gray-700 font-medium"
                    >
                      {p?.fitment || "-"}
                    </td>
                  ))}
                </tr>

                {/* Dynamic Spec Rows */}
                {specKeys.map((key) => (
                  <tr key={key} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                      {key}
                    </td>
                    {slots.map((p, i) => (
                      <td
                        key={i}
                        className="p-3 border-r border-gray-200 text-gray-600"
                      >
                        {p?.specs?.[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Warranty Row */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-600 bg-gray-50 border-r border-gray-200">
                    Warranty
                  </td>
                  {slots.map((p, i) => (
                    <td
                      key={i}
                      className="p-3 border-r border-gray-200 text-gray-600"
                    >
                      {p?.warranty || "-"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default ComparePage
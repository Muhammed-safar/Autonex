import React, { useState, useEffect } from "react";
import ProductCard from "../Shop/ProductCard.jsx";
import Pagination from "../Shop/Pagination.jsx"; // Adjust relative path as needed
import { sampleProducts } from "../../Products/Products.js"; // Adjust relative path as needed
import { Car, Plus, Trash2, CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";

const MAKES = ["Ford", "Toyota", "Honda", "Chevrolet", "BMW", "Jeep", "Dodge", "Nissan", "Hyundai", "Subaru"];
const PRODUCTS_PER_PAGE = 8; // Number of products to load per page

export default function MyGaragePage() {
  const [garage, setGarage] = useState(() => {
    const saved = localStorage.getItem("autonex_garage");
    return saved
      ? JSON.parse(saved)
      : [{ id: "1", year: "2021", make: "Ford", model: "F-150", isActive: true }];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("autonex_garage", JSON.stringify(garage));
  }, [garage]);

  const activeVehicle = garage.find((v) => v.isActive);

  // Reset to page 1 whenever active vehicle changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeVehicle?.id]);

  const handleAddVehicle = (e, keepFormOpen = false) => {
    if (e) e.preventDefault();
    if (!selectedMake || !selectedModel) return;

    const newVehicle = {
      id: Date.now().toString(),
      year: selectedYear,
      make: selectedMake,
      model: selectedModel,
      isActive: garage.length === 0, // Auto-activate if it's the only vehicle
    };

    setGarage((prev) => [newVehicle, ...prev]);
    setSelectedMake("");
    setSelectedModel("");

    // Feedback message
    setShowSuccessMsg(true);
    setTimeout(() => setShowSuccessMsg(false), 3000);

    if (!keepFormOpen) {
      setIsAdding(false);
    }
  };

  const handleSetActive = (id) => {
    setGarage(garage.map((v) => ({ ...v, isActive: v.id === id })));
  };

  const handleDeleteVehicle = (id, e) => {
    e.stopPropagation();
    const updated = garage.filter((v) => v.id !== id);
    if (updated.length > 0 && !updated.some((v) => v.isActive)) {
      updated[0].isActive = true;
    }
    setGarage(updated);
  };

  // Filter products based on active vehicle match or universal compatibility
  const recommendedProducts = sampleProducts.filter((product) => {
    if (!activeVehicle) return true;

    const makeMatch = product.compatibleVehicles?.some(
      (m) => m.toLowerCase() === activeVehicle.make.toLowerCase() || m.toLowerCase() === "universal"
    );

    return makeMatch;
  });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(recommendedProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = recommendedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of matching products list
    document.getElementById("matching-products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans text-slate-700 antialiased overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Banner with Car Background */}
        <div className="relative rounded-2xl overflow-hidden text-white p-5 sm:p-8 md:p-10 shadow-lg min-h-[220px] sm:min-h-[260px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/30 sm:to-transparent z-0" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006bc0]/40 text-blue-300 text-xs font-semibold mb-2 sm:mb-3 border border-blue-400/30 backdrop-blur-md">
              <Sparkles size={14} /> My Garage
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Fits Your Ride. <br className="hidden sm:block" />
              Fuels Your Drive.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 sm:mb-6 leading-relaxed">
              Add your vehicles once to get guaranteed fitment across our entire auto parts catalog.
            </p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full sm:w-auto justify-center bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md active:scale-95"
              >
                <Plus size={16} /> Add Vehicle
              </button>
            )}
          </div>
        </div>

        {/* Add Vehicle Form Drawer */}
        {isAdding && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car size={18} className="text-[#006bc0]" /> Add Vehicles to Garage
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setShowSuccessMsg(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {showSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Vehicle added successfully! You can add another below.</span>
              </div>
            )}

            <form onSubmit={(e) => handleAddVehicle(e, true)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#006bc0] focus:outline-none"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#006bc0] focus:outline-none"
                    required
                  >
                    <option value="">Select Make</option>
                    {MAKES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Civic, F-150, Camry"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#006bc0] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 text-center transition-colors"
                >
                  Done Adding
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold px-5 py-2 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus size={15} /> Save & Add Another
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved Vehicles Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Saved Vehicles ({garage.length})
            </h2>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs text-[#006bc0] hover:underline font-semibold flex items-center gap-1"
              >
                <Plus size={14} /> Add vehicle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {garage.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSetActive(item.id)}
                className={`cursor-pointer rounded-xl p-3.5 sm:p-4 border transition-all flex flex-col justify-between ${
                  item.isActive
                    ? "bg-blue-50/60 border-[#006bc0] ring-1 ring-[#006bc0]"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#006bc0] uppercase tracking-wider">
                      {item.year}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {item.make} {item.model}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => handleDeleteVehicle(item.id, e)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors shrink-0"
                    title="Remove vehicle"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  {item.isActive ? (
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 size={13} /> Active Vehicle
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Tap to activate</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suitable Recommendations Grid with Pagination */}
        <div id="matching-products-section" className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 sm:mb-6 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Matching Products
                </h3>
                {activeVehicle && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Fitment Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeVehicle
                  ? `Showing products suitable for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                  : "Showing all catalog products."}
              </p>
            </div>

            {/* Showing current slice range */}
            {recommendedProducts.length > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, recommendedProducts.length)} of {recommendedProducts.length} items
              </span>
            )}
          </div>

          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>

              {/* Pagination Row */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching products found for your active vehicle.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
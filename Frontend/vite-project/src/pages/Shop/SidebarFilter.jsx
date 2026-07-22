import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function SidebarFilter({
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  statusFilters,
  setStatusFilters,
  onFilterChange
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const categories = [
    "Air Condition", "Bearings", "Body", "Brakes", "Car Accessories", 
    "Engine", "Engine cooling system", "Engine oil", "Filters", "Gearbox",
    "Headlights & Lighting", "Oils and fluids", "Repair Kits", "Steering", 
    "Tires & Wheels", "Tools & Equipment"
  ];

  const colors = [
    { name: "Black", class: "bg-black", count: 8 },
    { name: "Blue", class: "bg-blue-600", count: 5 },
    { name: "Brown", class: "bg-amber-700", count: 5 },
    { name: "Gray", class: "bg-slate-400", count: 3 },
    { name: "Green", class: "bg-emerald-500", count: 3 },
    { name: "Red", class: "bg-red-500", count: 5 },
    { name: "Yellow", class: "bg-yellow-400", count: 6 },
  ];

  const brands = [
    { name: "AKKON", count: 2 },
    { name: "AutoShack", count: 4 },
    { name: "Castrol", count: 2 },
    { name: "Goodyear", count: 6 },
    { name: "Spyder", count: 7 },
    { name: "Yokohama", count: 3 }
  ];

  // Active filters count for mobile badge
  const activeFilterCount = 
    selectedCategories.length + 
    selectedBrands.length + 
    (statusFilters.inStock ? 1 : 0) + 
    (statusFilters.onSale ? 1 : 0) + 
    (priceRange.min > 0 || priceRange.max < 860 ? 1 : 0);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    onFilterChange?.();
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) => 
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
    onFilterChange?.();
  };

  const handleStatusToggle = (key) => {
    setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    onFilterChange?.();
  };

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange.max - 10);
    setPriceRange(prev => ({ ...prev, min: value }));
    onFilterChange?.();
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange.min + 10);
    setPriceRange(prev => ({ ...prev, max: value }));
    onFilterChange?.();
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 860 });
    setStatusFilters({ inStock: false, onSale: false });
    onFilterChange?.();
  };

  const minPercent = (priceRange.min / 860) * 100;
  const maxPercent = (priceRange.max / 860) * 100;

  return (
    <div className="w-full select-none">
      {/* --- Mobile Collapsible Header Button --- */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#006bc0]" />
            <span>Filter Products</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#006bc0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isOpenMobile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* --- Main Filter Body --- */}
      <div
        className={`space-y-7 pr-2 lg:block ${
          isOpenMobile 
            ? 'block bg-white border border-slate-200 p-4 rounded-2xl shadow-sm mb-6' 
            : 'hidden'
        }`}
      >
        {/* Header with Clear Action */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="font-bold text-sm text-slate-900">Filters</h2>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button 
                onClick={handleResetFilters}
                className="text-[11px] text-red-500 hover:text-red-600 font-semibold tracking-tight transition-colors"
              >
                Clear All
              </button>
            )}
            {/* Close button for mobile dropdown */}
            {isOpenMobile && (
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="text-slate-400 hover:text-slate-600 lg:hidden p-0.5"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">Product Categories</h3>
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {categories.map((cat, idx) => (
              <label key={idx} className="flex items-center gap-3 text-xs text-slate-600 cursor-pointer hover:text-[#006bc0] transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5 cursor-pointer" 
                />
                <span className={`flex-1 ${selectedCategories.includes(cat) ? "text-[#006bc0] font-semibold" : ""}`}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Double Price Slider */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">Filter by Price</h3>
          <div className="px-0.5">
            <div className="relative w-full h-1 bg-slate-200 rounded-lg mb-5 mt-4">
              <div 
                className="absolute h-full bg-[#006bc0] rounded-lg"
                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
              ></div>

              <input 
                type="range" 
                min="0" 
                max="860" 
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="absolute w-full h-1 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#006bc0] z-20
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#006bc0] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto"
              />

              <input 
                type="range" 
                min="0" 
                max="860" 
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="absolute w-full h-1 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer accent-[#006bc0] z-20
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#006bc0] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-full text-center border border-slate-200 rounded py-1 text-xs bg-white text-slate-700 font-medium shadow-xs">
                ${priceRange.min}
              </div>
              <span className="text-slate-400 text-xs">-</span>
              <div className="w-full text-center border border-slate-200 rounded py-1 text-xs bg-white text-slate-700 font-medium shadow-xs">
                ${priceRange.max}
              </div>
            </div>
          </div>
        </div>

        {/* Filter by Color */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">Filter by Color</h3>
          <div className="space-y-2.5">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-600 cursor-pointer hover:text-[#006bc0] transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full ${color.class} inline-block border border-black/5`}></span>
                  <span>{color.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">({color.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">Brands</h3>
          <div className="space-y-2.5">
            {brands.map((brand, idx) => (
              <label key={idx} className="flex items-center justify-between text-xs text-slate-600 cursor-pointer hover:text-[#006bc0] transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => handleBrandToggle(brand.name)}
                    className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5 cursor-pointer" 
                  />
                  <span className={selectedBrands.includes(brand.name) ? "text-[#006bc0] font-semibold" : ""}>{brand.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Status */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">Product Status</h3>
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 text-xs text-slate-600 cursor-pointer hover:text-[#006bc0] transition-colors">
              <input 
                type="checkbox" 
                checked={statusFilters.inStock}
                onChange={() => handleStatusToggle('inStock')}
                className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5 cursor-pointer" 
              />
              <span className={statusFilters.inStock ? "text-[#006bc0] font-semibold" : ""}>In Stock</span>
            </label>
            <label className="flex items-center gap-3 text-xs text-slate-600 cursor-pointer hover:text-[#006bc0] transition-colors">
              <input 
                type="checkbox" 
                checked={statusFilters.onSale}
                onChange={() => handleStatusToggle('onSale')}
                className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5 cursor-pointer" 
              />
              <span className={statusFilters.onSale ? "text-[#006bc0] font-semibold" : ""}>On Sale</span>
            </label>
          </div>
        </div>

        {/* Mobile Close / Done Button */}
        {isOpenMobile && (
          <div className="pt-2 border-t border-slate-100 lg:hidden">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="w-full bg-[#006bc0] hover:bg-[#005aa3] text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              Apply & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
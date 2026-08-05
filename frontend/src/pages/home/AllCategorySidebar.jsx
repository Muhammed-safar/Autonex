import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RotateCcw,
  Tag,
  Layers,
  Check,
  Sparkles,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useCategories } from "../../hooks/categories/useCategories.js";
import { useBrands } from "../../hooks/brands/useBrands.js";

const AllCategorySidebar =({ onClose })=> {
  const navigate = useNavigate();

  // Selected State — store names (not IDs) so they match Shop.jsx URL params
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 860 });
  const [statusFilters, setStatusFilters] = useState({
    inStock: false,
    onSale: false,
  });

  // Data fetching
  const { data: categoryData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
  });
  const { data: brandData, isLoading: brandsLoading } = useBrands({
    limit: 100,
  });

  const categories = categoryData?.data || [];
  const brands = brandData?.data || [];

  // Toggle Handlers — use category/brand name as key (not ID)
  const handleCategoryToggle = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  };

  const handleBrandToggle = (name) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 860 });
    setStatusFilters({ inStock: false, onSale: false });
  };

  // Navigate to Shop page with filters as Query Parameters matching Shop.jsx expectations
  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    // Shop.jsx reads ?category=Name1,Name2 (category names, not IDs)
    if (selectedCategories.length > 0) {
      params.append("category", selectedCategories.join(","));
    }
    // Shop.jsx reads ?brand=Name1,Name2 (brand names)
    if (selectedBrands.length > 0) {
      params.append("brand", selectedBrands.join(","));
    }
    if (priceRange.min > 0) {
      params.append("minPrice", priceRange.min);
    }
    if (priceRange.max < 860) {
      params.append("maxPrice", priceRange.max);
    }
    if (statusFilters.inStock) {
      params.append("inStock", "true");
    }
    if (statusFilters.onSale) {
      params.append("onSale", "true");
    }

    if (onClose) onClose();
    navigate(`/shop?${params.toString()}`);
  };

  const activeCount =
    selectedCategories.length +
    selectedBrands.length +
    (statusFilters.inStock ? 1 : 0) +
    (statusFilters.onSale ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 860 ? 1 : 0);

  return (
    /* Constrained container width (~320px) with full vertical height scroll */
    <div className="w-[320px] max-w-full h-full  bg-slate-50 text-slate-800 border-r border-slate-200 flex flex-col shadow-xl select-none overflow-y-auto">
      {/* Sidebar Header */}
      <div className="text-slate-800 p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#006bc0]" />
          <h2 className="font-bold text-sm tracking-wide">All Categories</h2>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              title="Reset Filters"
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <RotateCcw size={15} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-800 hover:text-slate-400 p-1 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Main Filter Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300">
        {/* CATEGORIES SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="text-[#006bc0]" size={14} /> Categories
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              {selectedCategories.length}
            </span>
          </div>

          {categoriesLoading ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              Loading...
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <div
                    key={cat._id}
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "border-[#006bc0] bg-blue-50/60 text-[#006bc0] font-semibold"
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? "bg-[#006bc0] text-white"
                          : "border border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BRANDS SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="text-[#006bc0]" size={14} /> Brands
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              {selectedBrands.length}
            </span>
          </div>

          {brandsLoading ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              Loading...
            </div>
          ) : (
            <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {brands.map((brand) => {
                const isSelected = selectedBrands.includes(brand.name);
                return (
                  <label
                    key={brand._id}
                    className="flex items-center justify-between text-xs text-slate-700 cursor-pointer hover:text-[#006bc0] p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleBrandToggle(brand.name)}
                        className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span
                        className={
                          isSelected
                            ? "text-[#006bc0] font-semibold truncate"
                            : "truncate"
                        }
                      >
                        {brand.name}
                      </span>
                    </div>
                    {brand.count !== undefined && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        ({brand.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* ADDITIONAL OPTIONS */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">
            Price & Status
          </h3>

          {/* Price Range */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
                className="w-full border border-slate-200 rounded-md py-1.5 px-2 text-xs bg-slate-50 focus:outline-none focus:border-[#006bc0]"
                placeholder="Min"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                }
                className="w-full border border-slate-200 rounded-md py-1.5 px-2 text-xs bg-slate-50 focus:outline-none focus:border-[#006bc0]"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilters.inStock}
                onChange={() =>
                  setStatusFilters((prev) => ({
                    ...prev,
                    inStock: !prev.inStock,
                  }))
                }
                className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5"
              />
              In Stock Only
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilters.onSale}
                onChange={() =>
                  setStatusFilters((prev) => ({
                    ...prev,
                    onSale: !prev.onSale,
                  }))
                }
                className="rounded border-slate-300 text-[#006bc0] focus:ring-[#006bc0]/20 w-3.5 h-3.5"
              />
              On Sale Items
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="sticky bottom-0 p-3 bg-white border-t border-slate-200 shadow-lg">
        <button
          onClick={handleApplyFilters}
          className="w-full py-3 rounded-lg bg-[#006bc0] hover:bg-[#005aa3] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={14} /> Apply Filters{" "}
          {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>
    </div>
  );
}

export default AllCategorySidebar
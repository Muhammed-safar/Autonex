import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export default function ProductGridHeader({
  totalResults,
  indexOfFirstProduct,
  indexOfLastProduct,
  sortOption,
  setSortOption,
  itemsPerPage,
  setItemsPerPage,
  viewMode,
  setViewMode
}) {
  const currentMax = Math.min(indexOfLastProduct, totalResults);
  const currentMin = totalResults > 0 ? indexOfFirstProduct + 1 : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
      {/* Results Count Summary */}
      <p className="text-xs sm:text-sm text-slate-500 font-medium">
        Showing <span className="text-slate-800 font-semibold">{currentMin}–{currentMax}</span> of <span className="text-slate-800 font-semibold">{totalResults}</span> results
      </p>

      {/* Control Bar: Stacks cleanly on mobile, inline on desktop */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 flex-1 sm:flex-none min-w-[130px]">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden min-[380px]:inline">
            Sort:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs font-medium"
          >
            <option value="default">Default sorting</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Average rating</option>
          </select>
        </div>

        {/* Per-Page Selector */}
        <div className="flex items-center">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs font-medium"
          >
            <option value={12}>12 Items</option>
            <option value={24}>24 Items</option>
            <option value={36}>36 Items</option>
          </select>
        </div>

        {/* View Mode Switches */}
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50/50">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
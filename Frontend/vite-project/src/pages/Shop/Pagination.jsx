import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // If there's only one page or none, skip rendering the pagination row completely
  if (totalPages <= 1) return null;

  // Build a dynamic array of page buttons to display
  const renderPageItems = () => {
    const items = [];
    
    // Always show first page
    items.push(1);

    if (currentPage > 3) {
      items.push('...');
    }

    // Determine range around current page
    const startRange = Math.max(2, currentPage - 1);
    const endRange = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startRange; i <= endRange; i++) {
      // Prevent duplicating page 1 or totalPages
      if (!items.includes(i) && i < totalPages) {
        items.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      items.push('...');
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1 && !items.includes(totalPages)) {
      items.push(totalPages);
    }

    return items;
  };

  const paginationItems = renderPageItems();

  return (
    <div className="flex items-center justify-center gap-2 mt-12 select-none">
      
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} className="stroke-[2.5]" />
      </button>

      {/* Dynamic Page Items */}
      {paginationItems.map((item, idx) => {
        const isEllipsis = item === '...';
        const isActive = item === currentPage;

        if (isEllipsis) {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${item}`}
            onClick={() => onPageChange(item)}
            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item}
          </button>
        );
      })}

      {/* Next Button */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed transition-colors ml-1"
        aria-label="Next page"
      >
        <ChevronRight size={14} className="stroke-[2.5]" />
      </button>
      
    </div>
  );
}
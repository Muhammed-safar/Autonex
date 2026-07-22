import React, { useState, useMemo } from 'react';
import FeatureHeader from '../Shop/FeatureHeader.jsx';
import SidebarFilter from '../Shop/SidebarFilter.jsx';
import ProductGridHeader from '../Shop/ProductGridHeader.jsx';
import ProductCard from '../Shop/ProductCard.jsx';
import Pagination from '../Shop/Pagination.jsx';
import { sampleProducts } from '../../Products/Products.js';

export default function ProductListingPage({ pageTitle = "Shop", defaultCategory = null }) {
  // --- Filter States ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 860 });
  const [statusFilters, setStatusFilters] = useState({ inStock: false, onSale: false });

  // Grid Header Controlled States
  const [sortOption, setSortOption] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic Filtering Pipeline
  const filteredProducts = useMemo(() => {
    let result = sampleProducts.filter((product) => {
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) return false;
      } else if (defaultCategory) {
        if (product.category !== defaultCategory) return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (product.price < priceRange.min || product.price > priceRange.max) return false;
      if (statusFilters.inStock && !product.inStock) return false;
      if (statusFilters.onSale && !product.onSale) return false;
      return true;
    });

    if (sortOption === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [defaultCategory, selectedCategories, selectedBrands, priceRange, statusFilters, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const activePage = currentPage > totalPages ? Math.max(1, totalPages) : currentPage;

  const indexOfLastProduct = activePage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  
  const currentProducts = filteredProducts
    .slice(indexOfFirstProduct, indexOfLastProduct)
    .map(p => ({
      ...p,
      price: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : p.price
    }));

  const resetToFirstPage = () => setCurrentPage(1);

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden">
      {/* Page Title Header */}
      <div className="py-4 sm:py-8 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex  justify-center justify-between">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <FeatureHeader />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-16 sm:pb-24">
          <aside className="w-full lg:w-1/4 shrink-0">
            <SidebarFilter 
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              statusFilters={statusFilters}
              setStatusFilters={setStatusFilters}
              onFilterChange={resetToFirstPage}
            />
          </aside>

          <main className="w-full lg:w-3/4">
            <ProductGridHeader 
              totalResults={filteredProducts.length} 
              indexOfFirstProduct={indexOfFirstProduct}
              indexOfLastProduct={indexOfLastProduct}
              sortOption={sortOption}
              setSortOption={setSortOption}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(limit) => { setItemsPerPage(limit); resetToFirstPage(); }}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {currentProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 mt-4 sm:mt-6" 
                : "flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6"
              }>
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 border border-dashed border-slate-200 rounded-lg mt-6">
                <p className="text-slate-400 text-xs sm:text-sm">No products found matching those filter selections.</p>
              </div>
            )}

            <Pagination 
              currentPage={activePage} 
              totalPages={totalPages} 
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}
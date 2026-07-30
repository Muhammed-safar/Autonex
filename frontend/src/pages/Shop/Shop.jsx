import React, { useState, useEffect, useMemo, useCallback } from "react";
import FeatureHeader from "../Shop/FeatureHeader.jsx";
import SidebarFilter from "../Shop/SidebarFilter.jsx";
import ProductGridHeader from "../Shop/ProductGridHeader.jsx";
import ProductCard from "../Shop/ProductCard.jsx";
import Pagination from "../Shop/Pagination.jsx";
import { useProducts } from "../../hooks/products/useProducts.js";

export default function ProductListingPage({
  pageTitle = "Shop",
  defaultCategory = null,
}) {
  // --- Filter States ---
  const [selectedCategories, setSelectedCategories] = useState(
    defaultCategory ? [defaultCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 860 });
  const [debouncedPrice, setDebouncedPrice] = useState(priceRange);
  const [statusFilters, setStatusFilters] = useState({
    inStock: false,
    onSale: false,
  });

  // Grid Header Controlled States
  const [sortOption, setSortOption] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce price slider updates to prevent excessive API hits while sliding
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(priceRange);
    }, 400);

    return () => clearTimeout(handler);
  }, [priceRange]);

  // Reset to page 1 safely without triggering infinite render cycles
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Map frontend sortOption to backend (sortBy and order) parameters
  const sortParams = useMemo(() => {
    switch (sortOption) {
      case "price-low-high":
        return { sortBy: "price", order: "asc" };
      case "price-high-low":
        return { sortBy: "price", order: "desc" };
      case "rating":
        return { sortBy: "rating", order: "desc" };
      default:
        return { sortBy: "createdAt", order: "desc" };
    }
  }, [sortOption]);

  // Construct query parameters matching backend expectation
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortParams.sortBy,
      order: sortParams.order,
    };

    if (selectedCategories.length > 0) {
      params.category = selectedCategories.join(",");
    }
    if (selectedBrands.length > 0) {
      params.brand = selectedBrands.join(",");
    }
    if (debouncedPrice.min > 0) {
      params.minPrice = debouncedPrice.min;
    }
    if (debouncedPrice.max < 860) {
      params.maxPrice = debouncedPrice.max;
    }
    if (statusFilters.inStock) {
      params.inStock = true;
    }
    if (statusFilters.onSale) {
      params.onSale = true;
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    selectedCategories,
    selectedBrands,
    debouncedPrice,
    statusFilters,
    sortParams,
  ]);

  // Fetch paginated data from backend query API
  const { data, isLoading, isError } = useProducts(queryParams);

  // Safely map products from API response
  const products = useMemo(() => {
    const rawList = Array.isArray(data?.data) ? data.data : [];

    return rawList.map((product) => ({
      id: product._id,
      title: product.name || "Untitled Product",
      image: product.images?.[0]?.url || "",
      price: product.price || 0,
      oldPrice:
        product.discountPrice > 0 && product.discountPrice < product.price
          ? product.price
          : null,
      discount:
        product.discountPrice > 0 && product.price > 0
          ? `${Math.round(
              ((product.price - product.discountPrice) / product.price) * 100
            )}% OFF`
          : null,
      rating: product.rating || 0,
      reviewsCount: product.reviewsCount || 0,
      description: product.description || "",
      brand: typeof product.brand === "object" ? product.brand?.name : "",
      category:
        typeof product.category === "object" ? product.category?.name : "",
      inStock: (product.stock || 0) > 0,
      onSale: (product.discountPrice || 0) > 0,
    }));
  }, [data]);

  // Read count and total pages directly from backend pagination meta object
  const totalResults =
    data?.pagination?.total ?? data?.totalResults ?? data?.total ?? 0;

  const totalPages =
    data?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const indexOfFirstProduct =
    totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastProduct = Math.min(
    currentPage * itemsPerPage,
    totalResults
  );

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden">
      {/* Page Header */}
      <div className="py-4 sm:py-8 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
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
              onFilterChange={handleFilterChange}
            />
          </aside>

          <main className="w-full lg:w-3/4">
            <ProductGridHeader
              totalResults={totalResults}
              indexOfFirstProduct={indexOfFirstProduct}
              indexOfLastProduct={indexOfLastProduct}
              sortOption={sortOption}
              setSortOption={(option) => {
                setSortOption(option);
                handleFilterChange();
              }}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(limit) => {
                setItemsPerPage(limit);
                handleFilterChange();
              }}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-slate-100 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16 border border-red-200 rounded-lg mt-6">
                <p className="text-red-500 text-sm">
                  Failed to load products. Please try refreshing the page.
                </p>
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 mt-4 sm:mt-6"
                    : "flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 border border-dashed border-slate-200 rounded-lg mt-6">
                <p className="text-slate-400 text-xs sm:text-sm">
                  No products found matching those filter selections.
                </p>
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
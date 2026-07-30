  import React, { useState } from "react";
  import {
    Plus,
    Tag,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Eye,
  } from "lucide-react";

  import { useBrands } from "../../../hooks/brands/useBrands.js"
  import { useDeleteBrand } from "../../../hooks/brands/useDeleteBrand.js"
  import useDebounce from "../../../hooks/useDebounce.js";
  import BrandModal from "./BrandModal.jsx";
  import BrandDetailsModal from "./BrandDetailsModal.jsx";
  import DashboardSkeleton from "../../layout.jsx/DashboardSkeleton.jsx";

  const DEFAULT_LIMIT = 10;

  export default function Brands() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    // State for Brand Details Modal
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading, error } = useBrands({
      page,
      search: debouncedSearch,
    });

    const deleteMutation = useDeleteBrand();

    const brandsList = data?.data || [];

    const totalItems = data?.total ?? data?.count ?? brandsList.length;
    const totalPages =
      data?.totalPages ?? Math.max(1, Math.ceil(totalItems / DEFAULT_LIMIT));
    const currentPage = data?.currentPage ?? page;

    const displayedBrands = data?.totalPages
      ? brandsList
      : brandsList.slice(
          (currentPage - 1) * DEFAULT_LIMIT,
          currentPage * DEFAULT_LIMIT,
        );

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setPage(1);
    };

    const handleClearSearch = () => {
      setSearchTerm("");
      setPage(1);
    };

    const handleAddClick = () => {
      setEditingBrand(null);
      setIsModalOpen(true);
    };

    const handleEditClick = (brand, e) => {
      e.stopPropagation();
      setEditingBrand(brand);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setEditingBrand(null);
      setIsModalOpen(false);
    };

    const handleBrandClick = (id) => {
      setSelectedBrandId(id);
      setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
      setSelectedBrandId(null);
      setIsDetailsOpen(false);
    };

    const handleDelete = (id, e) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this brand?")) {
        deleteMutation.mutate(id);
      }
    };

    if (isLoading) return <DashboardSkeleton/>;
    if (error) return <h2>Failed to load brands.</h2>;

    return (
      <div className="space-y-4 font-sans sm:space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h3 className="text-sm font-bold text-slate-700">Automotive Brands</h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search brands..."
                className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066B2]/20 focus:border-[#0066B2] transition"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleAddClick}
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#0066B2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#005290]"
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-xs shadow-sm flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-[500px] w-full border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-4 text-left">Brand Name</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Products Linked</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">
                {displayedBrands.map((brand) => (
                  <tr key={brand._id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap p-4 font-semibold text-slate-800">
                      <button
                        onClick={() => handleBrandClick(brand._id)}
                        className="flex items-center gap-3 text-left hover:text-[#0066B2] transition group"
                      >
                        {brand.logo?.url || brand.icon ? (
                          <img
                            src={brand.logo?.url || brand.icon}
                            alt={brand.name}
                            className="h-9 w-9 rounded-lg border border-slate-200 bg-white p-1 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className={`h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 ${
                            brand.logo?.url || brand.icon ? "hidden" : "flex"
                          }`}
                        >
                          <Tag className="h-4 w-4 text-[#0066B2]" />
                        </div>

                        <span className="underline-offset-2 group-hover:underline font-bold">
                          {brand.name}
                        </span>
                      </button>
                    </td>

                    <td className="whitespace-nowrap p-4">
                      <span
                        className={
                          brand.isActive
                            ? "rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600"
                            : "rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-400"
                        }
                      >
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap p-4 text-slate-600">
                      {brand.productsCount || 0} Products
                    </td>

                    <td className="whitespace-nowrap p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleBrandClick(brand._id)}
                          title="View Details"
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0066B2]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => handleEditClick(brand, e)}
                          title="Edit Brand"
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0066B2]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(brand._id, e)}
                          title="Delete Brand"
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayedBrands.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      {debouncedSearch
                        ? `No brands found matching "${debouncedSearch}".`
                        : "No brands found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-600">
                Showing page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong> ({totalItems} items)
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        currentPage === pageNum
                          ? "bg-[#0066B2] text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit/Create Modal */}
        <BrandModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          brand={editingBrand}
        />

        {/* Brand Details View Modal */}
        <BrandDetailsModal
          brandId={selectedBrandId}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      </div>
    );
  }

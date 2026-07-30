import React, { useState } from "react";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Eye,
} from "lucide-react";

import { useDeleteCategory} from "../../../hooks/categories/useDeleteCategory.js"
import { useCategories } from "../../../hooks/categories/useCategories.js";
import CategoryModal from "./CategoryModal.jsx";
import CategoryDetailsModal from "./CategoryDetailsModal.jsx"; 
import useDebounce from "../../../hooks/useDebounce.js";
import DashboardSkeleton from "../../layout.jsx/DashboardSkeleton.jsx";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // State for Category Details Modal
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useCategories({
    page,
    search: debouncedSearch,
  });
  const deleteMutation = useDeleteCategory();

  const categoriesList = data?.data || [];

  const totalItems = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const currentPage = data?.pagination?.currentPage ?? 1;

  const displayedCategories = categoriesList;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cat, e) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedCategoryId(null);
    setIsDetailsOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <DashboardSkeleton/>;
  }

  if (error) {
    return <h2>Failed to load categories.</h2>;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-slate-700 text-sm">Product Categories</h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search categories..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066B2]/20 focus:border-[#0066B2] transition"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Category Button */}
          <button
            onClick={handleAddClick}
            className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">Category</th>
                <th className="p-3.5 sm:p-4 text-left">Slug</th>
                <th className="p-3.5 sm:p-4 text-left">Items Count</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-xs text-slate-500"
                  >
                    {searchTerm
                      ? `No categories matching "${searchTerm}".`
                      : "No categories found."}
                  </td>
                </tr>
              ) : (
                displayedCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCategoryClick(cat._id)}
                        className="flex items-center gap-3 text-left hover:text-[#0066B2] transition group"
                      >
                        {cat.icon ? (
                          <img
                            src={cat.icon}
                            alt={cat.name}
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
                            cat.icon ? "hidden" : "flex"
                          }`}
                        >
                          <FolderTree className="h-4 w-4 text-[#0066B2]" />
                        </div>

                        <span className="font-bold text-slate-800 group-hover:underline underline-offset-2">
                          {cat.name}
                        </span>
                      </button>
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-400 font-mono">
                      {cat.slug}
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                      {cat.productsCount || 0} Products
                    </td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleCategoryClick(cat._id)}
                          aria-label="View category details"
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleEditClick(cat, e)}
                          aria-label="Edit category"
                          title="Edit Category"
                          className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(cat._id, e)}
                          aria-label="Delete category"
                          title="Delete Category"
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />

      {/* Category Details View Modal */}
      <CategoryDetailsModal
        categoryId={selectedCategoryId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}

import React, { useState } from "react";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useDeleteCategory } from "../../hooks/categories/useDeleteCategory.js";
import { useCategories } from "../../hooks/categories/useCategories.js";
import CategoryModal from "./CategoryModal.jsx";

const ITEMS_PER_PAGE = 10;

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [page, setPage] = useState(1);

  // Pass current page to hook in case backend handles server-side pagination
  const { data, isLoading, error } = useCategories({ page });
  const deleteMutation = useDeleteCategory();

  const categoriesList = data?.data || [];

  // Calculate pagination stats (handles both server-side and client-side responses)
  const totalItems =
    data?.pagination?.total ?? data?.count ?? categoriesList.length;
  const totalPages =
    data?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = data?.pagination?.currentPage ?? page;

  // Perform client-side slicing ONLY if backend returns all items without pagination
  const displayedCategories = data?.pagination
    ? categoriesList
    : categoriesList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      );

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Failed to load categories.</h2>;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-slate-700 text-sm">Product Categories</h3>
        <button
          onClick={handleAddClick}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
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
                    No categories found.
                  </td>
                </tr>
              ) : (
                displayedCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
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

                        <span className="font-semibold text-slate-800">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-400">{cat.slug}</td>
                    <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                      {cat.productsCount || 0} Products
                    </td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleEditClick(cat)}
                          aria-label="Edit category"
                          className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          aria-label="Delete category"
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </div>
  );
}

import React from "react";
import { useState } from "react";
import { Plus, FolderTree, Edit, Trash2 } from "lucide-react";

import { useDeleteCategory } from "../../hooks/categories/useDeleteCategory.js";
import { useCategories } from "../../hooks/categories/useCategories.js";
import CategoryModal from "./CategoryModal.jsx";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  const categoriesList = data?.data || [];

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
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
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
              {categoriesList.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50">
                  <td className="p-3.5 sm:p-4 text-slate-800 font-semibold flex items-center gap-2 whitespace-nowrap">
                    <FolderTree className="w-4 h-4 text-[#0066B2] shrink-0" />{" "}
                    {cat.name}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-400">{cat.slug}</td>
                  <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                    {cat.productsCount || 0} Products
                  </td>
                  <td className="p-3.5 sm:p-4 text-right">
                    <div className="flex justify-end gap-1.5 sm:gap-2">
                      <button
                        aria-label="Edit category"
                        className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(cat._id)}
                        aria-label="Delete category"
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CategoryModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
    </div>
  );
}

import React, { useState } from "react";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";

import { useBrands } from "../../hooks/brands/useBrands.js";
import { useDeleteBrand } from "../../hooks/brands/useDeleteBrand.js";
import BrandModal from "./BrandModal.jsx";

export default function Brands() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const { data, isLoading, error } = useBrands();
  const deleteMutation = useDeleteBrand();

  const brandsList = data?.data || [];

  const handleAddClick = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Failed to load brands.</h2>;

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-slate-700 text-sm">Automotive Brands</h3>
        <button
          onClick={handleAddClick}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">Brand Name</th>
                <th className="p-3.5 sm:p-4 text-left">Status</th>
                <th className="p-3.5 sm:p-4 text-left">Products Linked</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {brandsList.map((brand) => (
                <tr
                  key={brand._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3.5 sm:p-4 text-slate-800 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#0066B2] shrink-0" />
                      <span>{brand.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <span
                      className={
                        brand.isActive
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold"
                          : "bg-slate-50 text-slate-400 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold"
                      }
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                    {brand.productsCount || 0} Products
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleEditClick(brand)}
                        aria-label="Edit brand"
                        className="p-1.5 text-slate-400 hover:text-[#0066B2] hover:bg-slate-100 rounded-md transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id)}
                        aria-label="Delete brand"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
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

      <BrandModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        brand={editingBrand}
      />
    </div>
  );
}

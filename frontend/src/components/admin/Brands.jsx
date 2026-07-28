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
    setEditingBrand(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Failed to load brands.</h2>;

  return (
    <div className="space-y-4 font-sans sm:space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h3 className="text-sm font-bold text-slate-700">Automotive Brands</h3>

        <button
          onClick={handleAddClick}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#0066B2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#005290]"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-xs shadow-sm">
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
              {brandsList.map((brand) => (
                <tr key={brand._id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap p-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      {brand.logo?.url ? (
                        <img
                          src={brand.logo.url}
                          alt={brand.name}
                          className="h-9 w-9 rounded-lg border border-slate-200 bg-white p-1 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className={`h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 ${
                          brand.logo?.url ? "hidden" : "flex"
                        }`}
                      >
                        <Tag className="h-4 w-4 text-[#0066B2]" />
                      </div>

                      <span>{brand.name}</span>
                    </div>
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
                        onClick={() => handleEditClick(brand)}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0066B2]"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(brand._id)}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {brandsList.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No brands found.
                  </td>
                </tr>
              )}
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

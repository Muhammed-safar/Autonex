import React from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function Products() {
  const productsList = [
    { id: 1, name: "Anzo USA LED Projector Headlights", sku: "ANZ-111530A", price: "$117.25", stock: 45, category: "Lighting" },
    { id: 2, name: "Spyder BMW E90 3-Series Headlights", sku: "SPY-PRO-E90", price: "$188.99", stock: 12, category: "Lighting" },
  ];

  return (
    <div className="h-full space-y-4 sm:space-y-5">
      {/* Search & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0066B2] bg-white"
          />
        </div>
        <button className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">Product Name</th>
                <th className="p-3.5 sm:p-4 text-left">SKU</th>
                <th className="p-3.5 sm:p-4 text-left">Category</th>
                <th className="p-3.5 sm:p-4 text-left">Price</th>
                <th className="p-3.5 sm:p-4 text-left">Stock</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {productsList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 sm:p-4 text-slate-800 font-semibold">{p.name}</td>
                  <td className="p-3.5 sm:p-4 text-slate-500">{p.sku}</td>
                  <td className="p-3.5 sm:p-4 text-slate-600">{p.category}</td>
                  <td className="p-3.5 sm:p-4 text-[#0066B2] font-bold">{p.price}</td>
                  <td className="p-3.5 sm:p-4 text-emerald-600">{p.stock} units</td>
                  <td className="p-3.5 sm:p-4 text-right">
                    <div className="flex justify-end gap-1.5 sm:gap-2">
                      <button aria-label="Edit product" className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button aria-label="Delete product" className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50">
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
    </div>
  );
}
import React from "react";
import {
  X,
  FolderTree,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useCategory } from "../../../hooks/categories/useCategory.js"
import { useProducts } from "../../../hooks/products/useProducts.js";

export default function CategoryDetailsModal({ categoryId, isOpen, onClose }) {
  if (!isOpen || !categoryId) return null;

  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategory(categoryId);

  // Fetch products associated with this category ID
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({ category: categoryId });

  // Handle flexible backend response structures
  const category = categoryResponse?.data || categoryResponse || {};
  const productsList = productsResponse?.data || productsResponse || [];

  const categoryIcon = category.icon || category.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-[#0066B2]" />
            <h2 className="text-sm font-bold text-slate-800">
              Category Overview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isCategoryLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#0066B2] mb-2" />
              <span>Loading category details...</span>
            </div>
          ) : categoryError ? (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 font-medium">
              Failed to load category details. Please try again.
            </div>
          ) : (
            <>
              {/* Category Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                {categoryIcon ? (
                  <img
                    src={categoryIcon}
                    alt={category.name}
                    className="h-16 w-16 rounded-xl border border-slate-200 bg-white p-2 object-contain shrink-0 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-[#0066B2] shrink-0">
                    <FolderTree className="h-7 w-7" />
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">
                      {category.name || "N/A"}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        category.isActive !== false
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {category.isActive !== false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-slate-500 italic">
                    Slug:{" "}
                    <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">
                      {category.slug || "N/A"}
                    </code>
                  </p>

                  {category.description ? (
                    <p className="text-slate-600 pt-1">
                      {category.description}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic pt-1">
                      No description provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50 text-[#0066B2]">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Total Products
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {category.productsCount ?? productsList.length}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-100 text-slate-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Created On
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                    Products in Category
                  </h4>
                  <span className="text-slate-400 font-semibold">
                    ({productsList.length} loaded)
                  </span>
                </div>

                {isProductsLoading ? (
                  <div className="flex items-center justify-center p-8 text-slate-400 border border-slate-200 rounded-xl bg-slate-50/50">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0066B2] mr-2" />
                    <span>Loading products...</span>
                  </div>
                ) : productsError ? (
                  <div className="p-4 text-center text-red-500 bg-red-50 rounded-xl">
                    Failed to fetch products for this category.
                  </div>
                ) : productsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border border-slate-200 rounded-xl bg-slate-50/50">
                    No products currently belong to this category.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                    {productsList.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          {product.image || product.thumbnail ? (
                            <img
                              src={product.image || product.thumbnail}
                              alt={product.name}
                              className="w-8 h-8 rounded-md object-contain border border-slate-200 p-0.5 bg-white"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">
                              {product.name || product.title}
                            </p>
                            {product.sku && (
                              <p className="text-[10px] text-slate-400 font-mono">
                                SKU: {product.sku}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {product.price !== undefined && (
                            <span className="font-bold text-slate-700">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

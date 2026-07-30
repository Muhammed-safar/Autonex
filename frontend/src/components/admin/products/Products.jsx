import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductModal from "./ProductModal";

import { useProducts } from "../../../hooks/products/useProducts";
import { useCreateProduct } from "../../../hooks/products/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/products/useUpdateProduct";
import { useDeleteProduct } from "../../../hooks/products/useDeleteProduct";

import { useBrands } from "../../../hooks/brands/useBrands";
import { useCategories } from "../../../hooks/categories/useCategories";
import useDebounce from "../../../hooks/useDebounce.js";

const Products = () => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data: productsData } = useProducts({
    search: debouncedSearch,
    page,
  });
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  };

  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleSubmit = (values, removedImages) => {
    const formData = new FormData();

    // Basic fields
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("sku", values.sku);
    formData.append("price", values.price);
    formData.append("discountPrice", values.discountPrice);
    formData.append("stock", values.stock);
    formData.append("brand", values.brand);
    formData.append("category", values.category);
    formData.append("isActive", values.isActive);
    formData.append("isFeatured", values.isFeatured);

    // Arrays
    formData.append("variants", JSON.stringify(values.variants || []));
    formData.append(
      "compatibleVehicles",
      JSON.stringify(values.compatibleVehicles || []),
    );

    // Existing Cloudinary images
    const existingImages = values.images.filter(
      (img) => !(img instanceof File),
    );

    formData.append("existingImages", JSON.stringify(existingImages));

    // Removed Cloudinary images
    formData.append("removedImages", JSON.stringify(removedImages));

    // Newly uploaded files
    values.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    if (editingProduct) {
      updateProduct.mutate({
        id: editingProduct._id,
        formData,
      });
    } else {
      createProduct.mutate(formData);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="h-full space-y-4 sm:space-y-5">
      {/* Search & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0066B2]"
          />
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  SKU
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Price
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Stock
                </th>
                <th className="p-4 text-right text-xs font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-xs text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-slate-50 text-xs"
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {product.name}
                    </td>
                    <td className="p-4 text-slate-600">{product.sku}</td>
                    <td className="p-4 text-slate-600">
                      {product.category?.name || "-"}
                    </td>
                    <td className="p-4 text-slate-800 font-medium">
                      ${product.price}
                    </td>
                    <td className="p-4 text-slate-600">{product.stock}</td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded text-slate-600"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this product?",
                              )
                            ) {
                              deleteProduct.mutate(product._id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 text-red-500 rounded"
                        >
                          <Trash2 size={16} />
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
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-600">
              Showing page <strong>{pagination.currentPage}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ({pagination.total}{" "}
              items)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    pagination.currentPage === pageNum
                      ? "bg-[#0066B2] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        brands={brands}
        categories={categories}
      />
    </div>
  );
};

export default Products;

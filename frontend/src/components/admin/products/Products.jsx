import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

import ProductModal from "./ProductModal";

import { useProducts } from "../../../hooks/products/useProducts";
import { useCreateProduct } from "../../../hooks/products/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/products/useUpdateProduct";
import { useDeleteProduct } from "../../../hooks/products/useDeleteProduct";

import { useBrands } from "../../../hooks/brands/useBrands";
import { useCategories } from "../../../hooks/categories/useCategories";

const Products = () => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const { data: productsData } = useProducts({ search });
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const products = productsData?.data || [];
  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];

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
            onChange={(e) => setSearch(e.target.value)}
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">SKU</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">{product.category?.name}</td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">{product.stock}</td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-slate-100 rounded"
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
              ))}
            </tbody>
          </table>
        </div>
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

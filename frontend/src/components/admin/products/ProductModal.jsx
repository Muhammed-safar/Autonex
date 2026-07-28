import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { X, Package, Check } from "lucide-react";
import VariantSection from "./VariantSection";
import VehicleSection from "./VehicleSection";
import ImageUploader from "./ImageUploader";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  brands = [],
  categories = [],
}) => {
  const [removedImages, setRemovedImages] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      brand: "",
      category: "",
      isActive: true,
      isFeatured: false,
      images: [],
      variants: [],
      compatibleVehicles: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "compatibleVehicles",
  });

  const addRemovedImage = (publicId) => {
    setRemovedImages((prev) => [...prev, publicId]);
  };

  useEffect(() => {
    // IMPORTANT
    setRemovedImages([]);

    if (initialData) {
      reset({
        ...initialData,
        brand: initialData.brand?._id || initialData.brand || "",
        category: initialData.category?._id || initialData.category || "",
        images: initialData.images || [],
      });
    } else {
      reset({
        name: "",
        description: "",
        sku: "",
        price: 0,
        discountPrice: 0,
        stock: 0,
        brand: brands[0]?._id || "",
        category: categories[0]?._id || "",
        isActive: true,
        isFeatured: false,
        images: [],
        variants: [],
        compatibleVehicles: [],
      });
    }
  }, [initialData, reset, isOpen, brands, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package size={22} className="text-[#0066B2]" />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                {initialData ? "Edit Product" : "Add Product"}
              </h2>

              <p className="text-xs text-slate-500">
                {initialData
                  ? "Update product details"
                  : "Create a new product"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((values) => onSubmit(values, removedImages))}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold mb-2">Product Name</label>

            <input
              {...register("name", {
                required: "Product name is required",
              })}
              className="w-full border rounded-xl p-3"
            />

            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Brand / Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2">Brand</label>

              <select
                {...register("brand", { required: true })}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select Brand</option>

                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2">Category</label>

              <select
                {...register("category", { required: true })}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <textarea
            rows={4}
            {...register("description")}
            className="w-full border rounded-xl p-3"
            placeholder="Description..."
          />

          {/* Price */}
          <div className="grid grid-cols-4 gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              {...register("price", {
                valueAsNumber: true,
              })}
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Discount"
              {...register("discountPrice", {
                valueAsNumber: true,
              })}
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Stock"
              {...register("stock", {
                valueAsNumber: true,
              })}
              className="border rounded-xl p-3"
            />

            <input
              placeholder="SKU"
              {...register("sku")}
              className="border rounded-xl p-3"
            />
          </div>

          {/* Images */}
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUploader
                images={field.value}
                onChange={field.onChange}
                onRemoved={addRemovedImage}
              />
            )}
          />

          {/* Variants */}
          <VariantSection
            fields={variantFields}
            append={appendVariant}
            remove={removeVariant}
            register={register}
            errors={errors}
          />

          {/* Vehicles */}
          <VehicleSection
            fields={vehicleFields}
            append={appendVehicle}
            remove={removeVehicle}
            register={register}
            errors={errors}
          />

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex gap-2 items-center">
              <input type="checkbox" {...register("isActive")} />
              Active
            </label>

            <label className="flex gap-2 items-center">
              <input type="checkbox" {...register("isFeatured")} />
              Featured
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-[#0066B2] text-white flex items-center gap-2"
            >
              <Check size={16} />
              {initialData ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

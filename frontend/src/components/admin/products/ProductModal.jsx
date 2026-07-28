import React, { useEffect } from "react";
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
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
  } = useFieldArray({ control, name: "variants" });

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({ control, name: "compatibleVehicles" });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 font-sans">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066B2] flex items-center justify-center">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {initialData ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-slate-400">
                {initialData
                  ? "Update part specifications & pricing"
                  : "Create a new entry in your catalog"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* BASIC INFORMATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                placeholder="e.g. High-Performance Ceramic Brake Pads"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066B2] focus:ring-1 focus:ring-[#0066B2] transition-all"
              />
              {errors.name && (
                <span className="text-[11px] font-bold text-red-500 mt-1 inline-block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand *
              </label>
              <select
                {...register("brand", { required: true })}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066B2] bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066B2] bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Detailed technical specification and compatibility details..."
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066B2] transition-all"
              />
            </div>
          </div>

          {/* PRICING & INVENTORY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Base Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true, required: true })}
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Discount ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discountPrice", { valueAsNumber: true })}
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                SKU
              </label>
              <input
                type="text"
                {...register("sku")}
                placeholder="PROD-001"
                className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
              />
            </div>
          </div>

          {/* IMAGE UPLOADER */}
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUploader images={field.value} onChange={field.onChange} />
            )}
          />

          {/* DYNAMIC VARIANTS & VEHICLES */}
          <VariantSection
            fields={variantFields}
            append={appendVariant}
            remove={removeVariant}
            register={register}
            errors={errors}
          />

          <VehicleSection
            fields={vehicleFields}
            append={appendVehicle}
            remove={removeVehicle}
            register={register}
            errors={errors}
          />

          {/* TOGGLES */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-4 h-4 rounded text-[#0066B2] focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">
                Active Listing
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 rounded text-[#0066B2] focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">
                Featured Item
              </span>
            </label>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0066B2] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Check size={16} />
              <span>{initialData ? "Save Changes" : "Create Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

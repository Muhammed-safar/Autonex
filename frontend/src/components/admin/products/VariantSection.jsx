import React from "react";
import { Plus, Trash2, Layers } from "lucide-react";

const VariantSection =({ fields, append, remove, register, errors })=> {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#0066B2]" />
          <h4 className="text-sm font-extrabold text-slate-900">Product Variants</h4>
        </div>
        <button
          type="button"
          onClick={() => append({ name: "", price: 0, discountPrice: 0, stock: 0, sku: "" })}
          className="text-xs font-bold text-[#0066B2] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add Variant
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No variants created. Standard product details apply.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Variant #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Variant Name (e.g. Red / XL)"
                    {...register(`variants.${index}.name`, { required: true })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    {...register(`variants.${index}.price`, { valueAsNumber: true, required: true })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Discount"
                    step="0.01"
                    {...register(`variants.${index}.discountPrice`, { valueAsNumber: true })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Stock"
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VariantSection
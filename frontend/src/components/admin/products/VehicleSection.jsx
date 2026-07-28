import React from "react";
import { Plus, Trash2, Car } from "lucide-react";

const VehicleSection = ({ fields, append, remove, register, errors }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Car size={18} className="text-[#0066B2]" />
          <h4 className="text-sm font-extrabold text-slate-900">
            Compatible Vehicles
          </h4>
        </div>
        <button
          type="button"
          onClick={() =>
            append({ make: "", model: "", year: new Date().getFullYear() })
          }
          className="text-xs font-bold text-[#0066B2] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add Vehicle
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-400 italic">
          No compatible vehicles added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl grid grid-cols-12 gap-3 items-center"
            >
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="Make (e.g. Toyota)"
                  {...register(`compatibleVehicles.${index}.make`, {
                    required: true,
                  })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                />
              </div>

              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="Model (e.g. Camry)"
                  {...register(`compatibleVehicles.${index}.model`, {
                    required: true,
                  })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Year"
                  {...register(`compatibleVehicles.${index}.year`, {
                    valueAsNumber: true,
                  })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066B2]"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSection;

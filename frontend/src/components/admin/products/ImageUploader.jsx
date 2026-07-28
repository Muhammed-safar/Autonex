import React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const ImageUploader = ({ images = [], onChange }) => {
  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Product Images
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={img.publicId || idx}
            className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50"
          >
            <img
              src={img.url || URL.createObjectURL(img)}
              alt={img.alt || img.name || "Product"}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="border-2 border-dashed border-slate-200 hover:border-[#0066B2] rounded-xl flex flex-col items-center justify-center gap-1.5 aspect-square bg-slate-50 cursor-pointer text-slate-400 hover:text-[#0066B2] transition">
          <Upload size={20} />
          <span className="text-[11px] font-bold">Add Images</span>

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files);

              onChange([...images, ...files]);
            }}
          />
        </label>
      </div>
    </div>
  );
};
export default ImageUploader;

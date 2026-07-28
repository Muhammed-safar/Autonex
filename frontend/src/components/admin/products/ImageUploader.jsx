import React from "react";
import { Upload, X } from "lucide-react";

const ImageUploader = ({ images = [], onChange, onRemoved = () => {} }) => {
  const handleRemove = (index) => {
    const image = images[index];

    // Existing Cloudinary image
    if (image?.publicId) {
      onRemoved(image.publicId);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    onChange([...images, ...files]);

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Product Images
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, index) => {
          const preview =
            img?.url || (img instanceof File ? URL.createObjectURL(img) : "");

          return (
            <div
              key={img.publicId || img.name || index}
              className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50"
            >
              <img
                src={preview}
                alt={img.alt || img.name || "Product"}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 rounded-lg bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        <label className="border-2 border-dashed border-slate-200 hover:border-[#0066B2] rounded-xl flex flex-col items-center justify-center gap-2 aspect-square bg-slate-50 cursor-pointer text-slate-400 hover:text-[#0066B2] transition">
          <Upload size={20} />
          <span className="text-[11px] font-bold">Add Images</span>

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;

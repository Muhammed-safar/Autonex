import { useState } from "react";
import { X } from "lucide-react";
import { useCreateBrand } from "../../hooks/brands/useCreateBrand.js";

const BrandModal = ({ isOpen, onClose }) => {
  const createBrand = useCreateBrand();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());

    if (website.trim()) {
      formData.append("website", website.trim());
    }

    formData.append("isFeatured", String(isFeatured));

    if (logo) {
      formData.append("logo", logo);
    }

    createBrand.mutate(formData, {
      onSuccess: () => {
        setName("");
        setDescription("");
        setWebsite("");
        setLogo(null);
        setIsFeatured(false);

        onClose();
      },

      onError: (error) => {
        console.error(
          "Create brand failed:",
          error.response?.data || error.message,
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="px-2 md:px-0 fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Create Brand</h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg p-2"
            placeholder="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createBrand.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {createBrand.isPending ? "Saving..." : "Save Brand"}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Mutation: {createBrand.status}
          </p>
        </form>
      </div>
    </div>
  );
};

export default BrandModal;
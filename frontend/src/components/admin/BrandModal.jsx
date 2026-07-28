import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useCreateBrand } from "../../hooks/brands/useCreateBrand.js";
import { useUpdateBrand } from "../../hooks/brands/useUpdateBrand.js";

const BrandModal = ({ isOpen, onClose, brand }) => {
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (brand) {
      setName(brand.name || "");
      setDescription(brand.description || "");
      setWebsite(brand.website || "");
      setIsFeatured(brand.isFeatured || false);
      setLogo(null);
    } else {
      setName("");
      setDescription("");
      setWebsite("");
      setLogo(null);
      setIsFeatured(false);
    }
  }, [brand, isOpen]);

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

    if (brand) {
      updateBrand.mutate(
        {
          id: brand._id,
          formData,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createBrand.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="w-full max-w-lg rounded-xl bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {brand ? "Edit Brand" : "Create Brand"}
          </h2>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full rounded-lg border p-2"
            placeholder="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full rounded-lg border p-2"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-2"
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
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createBrand.isPending || updateBrand.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {brand
                ? updateBrand.isPending
                  ? "Updating..."
                  : "Update Brand"
                : createBrand.isPending
                  ? "Saving..."
                  : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandModal;

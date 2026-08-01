import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useCreateCategory } from "../../../hooks/categories/useCreateCategory";
import { useUpdateCategory } from "../../../hooks/categories/useUpdateCategory";

const CategoryModal = ({ isOpen, onClose, category }) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // Populate form when editing
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setDescription(category.description || "");
      setIsActive(category.isActive ?? true);
      setImage(null);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setImage(null);
      setIsActive(true);
    }
  }, [category, isOpen]);

  // Auto-generate slug only while creating
  useEffect(() => {
    if (!category) {
      setSlug(name.toLowerCase().trim().replace(/\s+/g, "-"));
    }
  }, [name, category]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("isActive", isActive);

    if (image) {
      formData.append("icon", image);
    }

    if (category) {
      updateCategory.mutate(
        {
          id: category._id,
          formData,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0">
      <div className="w-full max-w-lg rounded-xl bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {category ? "Edit Category" : "Create Category"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full rounded-lg border p-2"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border bg-gray-100 p-2"
            value={slug}
            readOnly
          />

          <textarea
            className="w-full rounded-lg border p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {category?.icon && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Current Icon
              </label>

              <img
                src={category.icon}
                alt={category.name}
                className="h-20 w-20 rounded-xl border border-slate-200 bg-white p-2 object-contain"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Category Icon
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
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
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {isPending
                ? category
                  ? "Updating..."
                  : "Saving..."
                : category
                  ? "Update Category"
                  : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

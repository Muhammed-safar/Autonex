import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateCategory } from "../../hooks/categories/useCreateCategory";

const CategoryModal = ({ isOpen, onClose }) => {
  const createCategory = useCreateCategory();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setSlug(
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
    );
  }, [name]);

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

    createCategory.mutate(formData, {
      onSuccess: () => {
        onClose();

        setName("");
        setSlug("");
        setDescription("");
        setImage(null);
        setIsActive(true);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">
            Create Category
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            className="w-full border rounded-lg p-2"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-2 bg-gray-100"
            value={slug}
            readOnly
          />

          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
            />

            Active
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
              disabled={createCategory.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {createCategory.isPending
                ? "Saving..."
                : "Save Category"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default CategoryModal;
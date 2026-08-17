import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

// Using the legacy import so it doesn't break depending on vite config for css
import { Save, X, Image as ImageIcon } from "lucide-react";
import { useAdminBlogById } from "../../../hooks/blogs/useBlogQueries.js";
import { useCreateBlog, useUpdateBlog } from "../../../hooks/blogs/useBlogMutations.js";

const CATEGORIES = ["Maintenance", "Upgrades", "Guides", "Engine Care", "Other"];

const CreateEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    },
  });

  const { data: blogData, isLoading } = useAdminBlogById(id);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    status: "draft",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isEditing && blogData?.blog) {
      const blog = blogData.blog;
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || CATEGORIES[0],
        status: blog.status || "draft",
      });
      setImagePreview(blog.featuredImage?.url || "");
    }
  }, [isEditing, blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("status", formData.status);

    if (imageFile) {
      data.append("image", imageFile);
    }

    if (isEditing) {
      updateBlog.mutate(
        { id, blogData: data },
        { onSuccess: () => navigate("/admin/blogs") }
      );
    } else {
      createBlog.mutate(data, { onSuccess: () => navigate("/admin/blogs") });
    }
  };

  if (isEditing && isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? "Edit Blog" : "Create New Blog"}
        </h1>
        <button
          onClick={() => navigate("/admin/blogs")}
          className="text-slate-500 hover:text-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            placeholder="Enter blog title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description (Excerpt)</label>
          <textarea
            name="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            placeholder="Brief summary of the article..."
          />
        </div>

        {/* Categories & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Featured Image</label>
          <div className="flex items-start gap-6">
            <div
              className={`w-40 h-24 rounded-lg flex items-center justify-center border-2 border-dashed ${imagePreview ? "border-transparent bg-slate-100" : "border-slate-300 bg-slate-50"
                } overflow-hidden relative group`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon className="mx-auto w-6 h-6 mb-1" />
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              <p className="mt-2 text-xs text-slate-500">
                Upload a high-quality featured image (16:9 recommended).
              </p>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
          <div className="bg-white rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Content
              </label>

              <div className="bg-white rounded-lg border border-slate-200">
                <div
                  ref={quillRef}
                  className="min-h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createBlog.isPending || updateBlog.isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0066B2] hover:bg-[#005290] flex items-center gap-2 transition disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {isEditing ? "Save Changes" : "Create Blog"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateEditBlog;
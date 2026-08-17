import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAdminBlogs, useDeleteBlog, useUpdateBlogStatus } from "../../../hooks/blogs/useBlogQueries";
import { useDeleteBlog as useApiDeleteBlog, useUpdateBlogStatus as useApiUpdateBlogStatus } from "../../../hooks/blogs/useBlogMutations";
import useDebounce from "../../../hooks/useDebounce";

const Blogs = () => {
  const navigate = useNavigate();
  const deleteBlog = useApiDeleteBlog();
  const updateStatus = useApiUpdateBlogStatus();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const debouncedSearch = useDebounce(search, 500);

  const { data: blogsData, isLoading } = useAdminBlogs({
    search: debouncedSearch,
    status: statusFilter,
    page,
  });

  const blogs = blogsData?.blogs || [];
  const pagination = blogsData?.pagination || {
    total: 0,
    page: 1,
    pages: 1,
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const toggleStatus = (e, blog) => {
    e.stopPropagation();
    const newStatus = blog.status === "published" ? "draft" : "published";
    updateStatus.mutate({ id: blog._id, status: newStatus });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog.mutate(id);
    }
  };

  return (
    <div className="h-full space-y-4 sm:space-y-5">
      {/* Search & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search blogs..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0066B2]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full sm:w-32 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0066B2]"
          >
            <option value="All">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/admin/blogs/create")}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Blog
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Blog
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Author
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Date
                </th>
                <th className="p-4 text-right text-xs font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b hover:bg-slate-50 text-xs transition cursor-pointer"
                    onClick={() => navigate(`/admin/blogs/${blog._id}/edit`)}
                  >
                    <td className="p-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage?.url ? (
                          <img
                            src={blog.featuredImage.url}
                            alt=""
                            className="w-10 h-10 rounded border border-slate-200 object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                            <span className="text-slate-400">No Img</span>
                          </div>
                        )}
                        <div>
                            <span className="hover:text-[#0066B2] transition font-semibold block">
                            {blog.title}
                            </span>
                            <span className="text-slate-400 text-[10px] font-mono">/{blog.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {blog.category}
                    </td>
                    <td className="p-4 text-slate-600">
                      {blog.author?.name || "-"}
                    </td>
                    <td className="p-4 text-slate-800">
                      <span
                        className={`px-2 py-1 rounded inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {blog.status === "published" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-[11px]">
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={(e) => toggleStatus(e, blog)}
                          title={blog.status === "published" ? "Unpublish" : "Publish"}
                          className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-[#0066B2] transition"
                        >
                          {blog.status === "published" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/blogs/${blog._id}/edit`);
                          }}
                          title="Edit Blog"
                          className="p-2 hover:bg-slate-100 rounded text-slate-600 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, blog._id)}
                          title="Delete Blog"
                          className="p-2 hover:bg-red-50 text-red-500 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-600">
              Showing page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.pages}</strong> ({pagination.total}{" "}
              items)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from(
                { length: pagination.pages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    pagination.page === pageNum
                      ? "bg-[#0066B2] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={pagination.page === pagination.pages}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
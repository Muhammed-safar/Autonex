import axiosInstance from "./axios";

// Public API
export const getPublicBlogs = async (params) => {
  const response = await axiosInstance.get("/blogs", { params });
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await axiosInstance.get(`/blogs/${slug}`);
  return response.data;
};

// Admin API
export const getAdminBlogs = async (params) => {
  const response = await axiosInstance.get("/blogs/admin/all", { params });
  return response.data;
};

export const getAdminBlogById = async (id) => {
  const response = await axiosInstance.get(`/blogs/admin/${id}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await axiosInstance.post("/blogs", blogData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await axiosInstance.put(`/blogs/${id}`, blogData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axiosInstance.delete(`/blogs/${id}`);
  return response.data;
};

export const updateBlogStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/blogs/${id}/status`, { status });
  return response.data;
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, updateBlog, deleteBlog, updateBlogStatus } from "../../api/blog.api.js";
import toast from "react-hot-toast";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success("Blog created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create blog");
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blogData }) => updateBlog(id, blogData),
    onSuccess: () => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogSlug"] });
      queryClient.invalidateQueries({ queryKey: ["adminBlogId"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update blog");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    },
  });
};

export const useUpdateBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateBlogStatus(id, status),
    onSuccess: () => {
      toast.success("Blog status updated");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update blog status");
    },
  });
};
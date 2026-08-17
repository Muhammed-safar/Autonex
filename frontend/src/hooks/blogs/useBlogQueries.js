import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  getPublicBlogs,
  getAdminBlogs,
  getBlogBySlug,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
} from "../../api/blog.api";

export const usePublicBlogs = (params) => {
  return useQuery({
    queryKey: ["publicBlogs", params],
    queryFn: () => getPublicBlogs(params),
    placeholderData: keepPreviousData,
  });
};

export const useBlogBySlug = (slug) => {
  return useQuery({
    queryKey: ["blogSlug", slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: !!slug,
  });
};

export const useAdminBlogs = (params) => {
  return useQuery({
    queryKey: ["adminBlogs", params],
    queryFn: () => getAdminBlogs(params),
    placeholderData: keepPreviousData,
  });
};

export const useAdminBlogById = (id) => {
  return useQuery({
    queryKey: ["adminBlogId", id],
    queryFn: () => getAdminBlogById(id),
    enabled: !!id,
  });
};


export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogData) => createBlog(blogData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminBlogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["publicBlogs"],
      });
    },
  });
};


export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blogData }) =>
      updateBlog(id, blogData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminBlogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminBlogId", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["publicBlogs"],
      });
    },
  });
};


export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteBlog(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminBlogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["publicBlogs"],
      });
    },
  });
};

// UPDATE BLOG STATUS

export const useUpdateBlogStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateBlogStatus(id, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminBlogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminBlogId", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["publicBlogs"],
      });
    },
  });
};
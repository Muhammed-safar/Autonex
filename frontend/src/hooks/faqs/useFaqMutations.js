import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFAQ, updateFAQ, deleteFAQ, updateFAQStatus, reorderFAQs } from "../../api/faq.api.js";
import toast from "react-hot-toast";

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFAQ,
    onSuccess: () => {
      toast.success("FAQ created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["publicFaqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create FAQ");
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, faqData }) => updateFAQ(id, faqData),
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["publicFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["adminFaqId"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update FAQ");
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["publicFaqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete FAQ");
    },
  });
};

export const useUpdateFaqStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => updateFAQStatus(id, isActive),
    onSuccess: () => {
      toast.success("FAQ status updated");
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["publicFaqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update FAQ status");
    },
  });
};

export const useReorderFaqs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderFAQs,
    onSuccess: () => {
      toast.success("FAQs reordered successfully");
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      queryClient.invalidateQueries({ queryKey: ["publicFaqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reorder FAQs");
    },
  });
};
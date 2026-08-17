import { useQuery } from "@tanstack/react-query";
import { getPublicFAQs, getAdminFAQs, getAdminFAQById } from "../../api/faq.api.js";

export const usePublicFaqs = (params = {}) => {
  return useQuery({
    queryKey: ["publicFaqs", params],
    queryFn: () => getPublicFAQs(params),
    keepPreviousData: true,
  });
};

export const useAdminFaqs = (params = {}) => {
  return useQuery({
    queryKey: ["adminFaqs", params],
    queryFn: () => getAdminFAQs(params),
    keepPreviousData: true,
  });
};

export const useAdminFaqById = (id) => {
  return useQuery({
    queryKey: ["adminFaqId", id],
    queryFn: () => getAdminFAQById(id),
    enabled: !!id,
  });
};
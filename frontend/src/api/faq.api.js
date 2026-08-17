import axiosInstance from "./axios";

// Public API
export const getPublicFAQs = async (params) => {
  const response = await axiosInstance.get("/faqs", { params });
  return response.data;
};

// Admin API
export const getAdminFAQs = async (params) => {
  const response = await axiosInstance.get("/faqs/admin/all", { params });
  return response.data;
};

export const getAdminFAQById = async (id) => {
  const response = await axiosInstance.get(`/faqs/admin/${id}`);
  return response.data;
};

export const createFAQ = async (faqData) => {
  const response = await axiosInstance.post("/faqs", faqData);
  return response.data;
};

export const updateFAQ = async (id, faqData) => {
  const response = await axiosInstance.put(`/faqs/${id}`, faqData);
  return response.data;
};

export const deleteFAQ = async (id) => {
  const response = await axiosInstance.delete(`/faqs/${id}`);
  return response.data;
};

export const updateFAQStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(`/faqs/${id}/status`, {
    isActive,
  });
  return response.data;
};

export const reorderFAQs = async (orderedIds) => {
  const response = await axiosInstance.patch(`/faqs/reorder`, { orderedIds });
  return response.data;
};
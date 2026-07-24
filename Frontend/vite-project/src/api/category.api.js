// src/api/category.api.js

import axios from "./axios";

// GET /api/categories
export const getCategories = async () => {
  const { data } = await axios.get("/categories");
  return data;
};

// GET /api/categories/active
export const getActiveCategories = async () => {
  const { data } = await axios.get("/categories/active");
  return data;
};

// GET /api/categories/:id
export const getCategoryById = async (id) => {
  const { data } = await axios.get(`/categories/${id}`);
  return data;
};

// POST /api/categories
export const createCategory = async (formData) => {
  const { data } = await axios.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// PUT /api/categories/:id
export const updateCategory = async ({ id, formData }) => {
  const { data } = await axios.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// DELETE /api/categories/:id
export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`/categories/${id}`);
  return data;
};

// PATCH /api/categories/:id/restore
export const restoreCategory = async (id) => {
  const { data } = await axios.patch(`/categories/${id}/restore`);
  return data;
};
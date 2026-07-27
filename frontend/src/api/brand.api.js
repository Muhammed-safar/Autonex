import axios from "./axios";

// GET /api/brands
export const getBrands = async () => {
  const { data } = await axios.get("/brands");
  return data;
};

// GET /api/brands/:id
export const getBrandById = async (id) => {
  const { data } = await axios.get(`/brands/${id}`);
  return data;
};

// POST /api/brands
export const createBrand = async (formData) => {
  const { data } = await axios.post("/brands", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// PUT /api/brands/:id
export const updateBrand = async ({ id, formData }) => {
  const { data } = await axios.put(`/brands/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// PATCH /api/brands/:id/status
export const toggleBrandStatus = async (id) => {
  const { data } = await axios.patch(`/brands/${id}/status`);
  return data;
};

// DELETE /api/brands/:id
export const deleteBrand = async (id) => {
  const { data } = await axios.delete(`/brands/${id}`);
  return data;
};

import API from "./axios";

// Get All Products
export const getProducts = async (params = {}) => {
  const { data } = await API.get("/products", {
    params,
  });

  return data;
};

// Get Product By ID
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);

  return data;
};

// Create Product
export const createProduct = async (formData) => {
  const { data } = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Update Product
export const updateProduct = async ({ id, formData }) => {
  const { data } = await API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);

  return data;
};

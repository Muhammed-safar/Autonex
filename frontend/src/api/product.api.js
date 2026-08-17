import API, { ADMIN_API } from "./axios";

// ========================================
// CUSTOMER
// ========================================

// Get All Products
// Used by storefront/shop pages
export const getProducts = async (params = {}) => {
  const { data } = await API.get("/products", {
    params,
  });

  return data;
};

// Get Product By ID
// Used by customer product details
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);

  return data;
};


// ========================================
// ADMIN
// ========================================

// Create Product
export const createProduct = async (formData) => {
  const { data } = await ADMIN_API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Update Product
export const updateProduct = async ({ id, formData }) => {
  const { data } = await ADMIN_API.put(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const { data } = await ADMIN_API.delete(`/products/${id}`);

  return data;
};

export const getAdminProducts = async (params = {}) => {
  const { data } = await ADMIN_API.get("/products", {
    params,
  });

  return data;
};
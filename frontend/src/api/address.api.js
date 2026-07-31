import API from "./axios";

// Get all addresses
export const getAddresses = async () => {
  const { data } = await API.get("/address");
  return data;
};

// Get single address
export const getAddress = async (id) => {
  const { data } = await API.get(`/address/${id}`);
  return data;
};

// Create address
export const createAddress = async (addressData) => {
  const { data } = await API.post("/address", addressData);
  return data;
};

// Update address
export const updateAddress = async ({ id, addressData }) => {
  const { data } = await API.put(`/address/${id}`, addressData);
  return data;
};

// Delete address
export const deleteAddress = async (id) => {
  const { data } = await API.delete(`/address/${id}`);
  return data;
};

// Set default address
export const setDefaultAddress = async (id) => {
  const { data } = await API.patch(`/address/${id}/default`);
  return data;
};

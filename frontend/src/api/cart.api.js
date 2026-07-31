import API from "./axios";

// Get Cart
export const getCart = async () => {
  const { data } = await API.get("/cart");
  return data;
};

// Add Item
export const addToCart = async (cartData) => {
  const { data } = await API.post("/cart/items", cartData);
  return data;
};

// Update Quantity
export const updateCartItem = async ({ itemId, quantity }) => {
  const { data } = await API.patch(`/cart/item/${itemId}`, {
    quantity,
  });

  return data;
};

// Remove Item
export const removeCartItem = async (itemId) => {
  const { data } = await API.delete(`/cart/item/${itemId}`);
  return data;
};

// Clear Cart
export const clearCart = async () => {
  const { data } = await API.delete("/cart/clear");
  return data;
};

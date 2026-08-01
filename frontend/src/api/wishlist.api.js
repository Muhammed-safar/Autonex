import API from "./axios";

// Get Wishlist
export const getWishlist = async () => {
  const { data } = await API.get("/wishlist");
  return data.data;
};

// Add To Wishlist
export const addToWishlist = async (productId) => {
  const { data } = await API.post("/wishlist", {
    productId,
  });

  return data.data;
};

// Remove From Wishlist
export const removeFromWishlist = async (productId) => {
  const { data } = await API.delete(`/wishlist/${productId}`);
  return data.data;
};

// Clear Wishlist
export const clearWishlist = async () => {
  const { data } = await API.delete("/wishlist");
  return data.data;
};
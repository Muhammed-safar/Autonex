import API from "./axios";

// Get Wishlist
export const getWishlist = async () => {
  const { data } = await API.get("/whishlist");
  return data.data;
};

// Add To Wishlist
export const addToWishlist = async (productId) => {
  const { data } = await API.post("/whishlist", {
    productId,
  });

  return data.data;
};

// Remove From Wishlist
export const removeFromWishlist = async (productId) => {
  const { data } = await API.delete(`/whishlist/${productId}`);
  return data.data;
};

// Clear Wishlist
export const clearWishlist = async () => {
  const { data } = await API.delete("/whishlist");
  return data.data;
};
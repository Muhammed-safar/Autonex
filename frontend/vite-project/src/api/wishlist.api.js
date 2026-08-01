import axios from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // 👈 Adjust key to match where you store your token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get Wishlist
export const getWishlist = async () => {
  const { data } = await axios.get("/wishlist");
  return data;
};

// Add to Wishlist
export const addToWishlist = async (productId) => {
     console.log("Sending productId:", productId);
  const { data } = await axios.post("/wishlist", {
    productId,
  });

  return data;
};

// Remove from Wishlist
export const removeFromWishlist = async (productId) => {
  const { data } = await axios.delete(`/wishlist/${productId}`);
  return data;
};

// Clear Wishlist
export const clearWishlist = async () => {
  const { data } = await axios.delete("/wishlist");
  return data;
};
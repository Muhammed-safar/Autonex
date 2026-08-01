import Wishlist from "../models/Wishlist.js";

// Find wishlist by user ID
export const findWishlistByUserId = (userId) => {
  return Wishlist.findOne({ userId }).populate("products");
};

// Create wishlist
export const createWishlist = (data) => {
  return Wishlist.create(data);
};

// Save wishlist
export const saveWishlist = (wishlist) => {
  return wishlist.save();
};

// Delete wishlist
export const deleteWishlist = (userId) => {
  return Wishlist.findOneAndDelete({ userId });
};
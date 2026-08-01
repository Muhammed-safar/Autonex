import Product from "../models/Products.js";
import {
  findWishlistByUserId,
  createWishlist,
  saveWishlist,
  deleteWishlist,
} from "../repositories/wishlist.repository.js";


// Get Wishlist

export const getWishlistService = async (userId) => {
  const wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    return {
      userId,
      products: [],
    };
  }

  return wishlist;
};


// Add To Wishlist

export const addToWishlistService = async (userId, productId) => {
  console.log("========== WISHLIST ==========");
  console.log("Received productId:", productId);

  const product = await Product.findById(productId);

  console.log("Found product:", product);

  if (!product) {
    throw new Error("Product not found.");
  }};


// Remove From Wishlist

export const removeFromWishlistService = async (
  userId,
  productId
) => {
  const wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  wishlist.products = wishlist.products.filter(
    (item) => item._id.toString() !== productId
  );

  await saveWishlist(wishlist);

  return await findWishlistByUserId(userId);
};


// Clear Wishlist

export const clearWishlistService = async (userId) => {
  const wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  wishlist.products = [];

  await saveWishlist(wishlist);

  return wishlist;
};
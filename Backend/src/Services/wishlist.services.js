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
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  let wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    wishlist = await createWishlist({
      userId,
      products: [],
    });
  }

  const exists = wishlist.products.some(
    (item) => item._id.toString() === productId
  );

  if (exists) {
    throw new Error("Product already in wishlist.");
  }

  wishlist.products.push(productId);

  await saveWishlist(wishlist);

  return await findWishlistByUserId(userId);
};


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
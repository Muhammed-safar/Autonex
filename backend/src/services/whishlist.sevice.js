import Product from "../models/Product.js";
import {
  createWishlist,
  findWishlistByUserId,
  saveWishlist,
} from "../repositories/whishlist.repository.js";
import { convertProduct } from "../services/currency.service.js";

// Get Wishlist

export const getWishlistService = async (
  userId,
  selectedCurrency = "USD"
) => {
  const wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    return {
      userId,
      products: [],
    };
  }

  const convertedProducts = wishlist.products.map((product) =>
    convertProduct(product.toObject(), selectedCurrency)
  );

  return {
    ...wishlist.toObject(),
    products: convertedProducts,
  };
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
    (item) => item._id.toString() === productId,
  );

  if (exists) {
    throw new Error("Product already in wishlist.");
  }

  wishlist.products.push(productId);

  await saveWishlist(wishlist);

  return await findWishlistByUserId(userId);
};

// Remove From Wishlist

export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  wishlist.products = wishlist.products.filter(
    (item) => item._id.toString() !== productId,
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

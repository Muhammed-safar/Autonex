import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  clearWishlistService,
} from "../services/wishlist.services.js";


// Get Wishlist

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await getWishlistService(req.user.id);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Add To Wishlist

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await addToWishlistService(
      req.user.id,
      productId
    );

    res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Remove From Wishlist

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await removeFromWishlistService(
      req.user.id,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Clear Wishlist

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await clearWishlistService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully.",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
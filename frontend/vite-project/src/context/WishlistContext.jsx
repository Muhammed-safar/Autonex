import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getWishlist, addToWishlist, removeFromWishlist as removeWishlistApi } from "../api/wishlist.api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("app_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Move fetchWishlist outside useEffect into the component scope
  const fetchWishlist = useCallback(async () => {

    try {
      const res = await getWishlist();
      console.log(res);

      setWishlistItems(res.data.products || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 2. Call fetchWishlist inside useEffect
  useEffect(() => {
    console.log("Wishlist useEffect running");
    fetchWishlist();
  }, [fetchWishlist]);

const toggleWishlist = async (product) => {
    const productId = product._id || product.id;

    const exists = wishlistItems.some(
      (item) => item._id === productId || item.id === productId
    );

    if (exists) {
      // If already in wishlist, remove it
      await removeFromWishlist(productId);
      return;
    }

    try {
      const res = await addToWishlist(productId);

      if (res.success) {
        // Refetch updated list from backend
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response?.data);
    }
  };

const removeFromWishlist = async (productId) => {
    try {
      const res = await removeWishlistApi(productId);

      if (res.success) {
        // Refetch updated list from backend
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.id === productId || item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
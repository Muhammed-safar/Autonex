const KEY = "wishlist";

export const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const setLocalWishlist = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const addLocalWishlist = (product) => {
  const items = getLocalWishlist();

  const exists = items.some((item) => item._id === product._id);

  if (!exists) {
    items.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      images: product.images,
      brand: product.brand,
      category: product.category,
    });

    setLocalWishlist(items);
  }

  return items;
};

export const removeLocalWishlist = (productId) => {
  const items = getLocalWishlist().filter((item) => item._id !== productId);

  setLocalWishlist(items);

  return items;
};

export const clearLocalWishlist = () => {
  localStorage.removeItem(KEY);
};

export const isLocalWishlisted = (productId) => {
  return getLocalWishlist().some((item) => item._id === productId);
};
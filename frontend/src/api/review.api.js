import API from "./axios";

export const createReview = async ({ productId, orderId, rating, comment }) => {
  const { data } = await API.post("/reviews", { productId, orderId, rating, comment });
  return data;
};

// ─── Get paginated reviews for a product (public) ────────────────────────────
export const getProductReviews = async ({ productId, page = 1, limit = 10 }) => {
  const { data } = await API.get(`/reviews/product/${productId}`, {
    params: { page, limit },
  });
  return data;
};

// ─── Get the current user's review for a product ─────────────────────────────
export const getMyReviewForProduct = async (productId) => {
  const { data } = await API.get(`/reviews/my/${productId}`);
  return data;
};

// ─── Get a single review by ID ────────────────────────────────────────────────
export const getReviewById = async (reviewId) => {
  const { data } = await API.get(`/reviews/${reviewId}`);
  return data;
};

// ─── Update the current user's review ────────────────────────────────────────
export const updateReview = async ({ reviewId, rating, comment }) => {
  const { data } = await API.patch(`/reviews/${reviewId}`, { rating, comment });
  return data;
};

// ─── Delete the current user's review ────────────────────────────────────────
export const deleteReview = async (reviewId) => {
  const { data } = await API.delete(`/reviews/${reviewId}`);
  return data;
};

// ─── Admin: get all reviews ───────────────────────────────────────────────────
export const getAllReviews = async ({ page = 1, limit = 15, productId, rating } = {}) => {
  const { data } = await API.get("/reviews", {
    params: { page, limit, productId, rating },
  });
  return data;
};

// ─── Admin: delete any review ─────────────────────────────────────────────────
export const adminDeleteReview = async (reviewId) => {
  const { data } = await API.delete(`/reviews/admin/${reviewId}`);
  return data;
};

// ─── Admin: toggle review visibility ─────────────────────────────────────────
export const toggleReviewVisibility = async (reviewId) => {
  const { data } = await API.patch(`/reviews/admin/${reviewId}/toggle-visibility`);
  return data;
};
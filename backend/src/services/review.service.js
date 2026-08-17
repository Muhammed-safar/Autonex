import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ─── Helper: Recalculate and persist product rating stats ─────────────────────
// Called after every create / update / delete.
// Uses MongoDB aggregation to compute exact average from the Review collection.
const updateProductRatingStats = async (productId) => {
    const result = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
                isVisible: true,
            },
        },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    const stats =
        result.length > 0
            ? {
                  averageRating: Math.round(result[0].averageRating * 10) / 10, // 1 decimal place
                  reviewCount: result[0].reviewCount,
              }
            : { averageRating: 0, reviewCount: 0 };

    await Product.findByIdAndUpdate(productId, {
        averageRating: stats.averageRating,
        reviewCount: stats.reviewCount,
    });

    return stats;
};

// ─── Create Review ─────────────────────────────────────────────────────────────
export const createReview = async ({ userId, productId, orderId, rating, comment }) => {
    // 1. Validate IDs
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
    }

    // 2. Product must exist
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        throw new Error("Product not found");
    }

    // 3. Order must exist and belong to this user
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }

    if (order.user.toString() !== userId.toString()) {
        throw new Error("You are not authorized to review using this order");
    }

    // 4. Product must be in the order's items (field is productId per Order schema)
    const productInOrder = order.items.some(
        (item) => item.productId.toString() === productId.toString()
    );
    if (!productInOrder) {
        throw new Error("This product was not part of the specified order");
    }

    // 5. Order must be DELIVERED
    if (order.orderStatus !== "DELIVERED") {
        throw new Error(
            "You can only review products from delivered orders"
        );
    }

    // 6. Duplicate check (db-level unique index is also a safety net)
    const existingReview = await Review.findOne({
        product: productId,
        user: userId,
    });
    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }

    // 7. Create the review
    const review = await Review.create({
        product: productId,
        user: userId,
        order: orderId,
        rating,
        comment,
    });

    // 8. Recalculate product stats
    await updateProductRatingStats(productId);

    // Populate for response
    const populated = await Review.findById(review._id)
        .populate("user", "fullName profile")
        .populate("product", "name images");

    return populated;
};

// ─── Get Product Reviews (Public, paginated) ───────────────────────────────────
export const getProductReviews = async ({ productId, page = 1, limit = 10 }) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Number(limit) || 10, 20);
    const skip = (pageNum - 1) * limitNum;

    const filter = { product: productId, isVisible: true };

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate("user", "fullName profile")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Review.countDocuments(filter),
    ]);

    // Rating distribution (for the bar chart)
    const distribution = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId), isVisible: true } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach((d) => {
        ratingBreakdown[d._id] = d.count;
    });

    return {
        reviews,
        ratingBreakdown,
        pagination: {
            currentPage: pageNum,
            totalReviews: total,
            totalPages: Math.ceil(total / limitNum),
            hasNextPage: pageNum < Math.ceil(total / limitNum),
            hasPreviousPage: pageNum > 1,
        },
    };
};

// ─── Get a user's own review for a specific product ────────────────────────────
export const getMyReviewForProduct = async ({ userId, productId }) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    const review = await Review.findOne({ product: productId, user: userId });
    return review; // null if not reviewed yet
};

// ─── Get Review By ID ──────────────────────────────────────────────────────────
export const getReviewById = async (reviewId) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId)
        .populate("user", "fullName profile")
        .populate("product", "name images");

    if (!review) {
        throw new Error("Review not found");
    }

    return review;
};

// ─── Update Review ─────────────────────────────────────────────────────────────
export const updateReview = async ({ reviewId, userId, rating, comment }) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    // Only the review owner can edit
    if (review.user.toString() !== userId.toString()) {
        throw new Error("You are not authorized to edit this review");
    }

    // Apply updates
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    review.isEdited = true;

    await review.save();

    // Recalculate product stats
    await updateProductRatingStats(review.product);

    const updated = await Review.findById(review._id)
        .populate("user", "fullName profile")
        .populate("product", "name images");

    return updated;
};

// ─── Delete Review (User's own) ────────────────────────────────────────────────
export const deleteReview = async ({ reviewId, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    // Only the review owner can delete
    if (review.user.toString() !== userId.toString()) {
        throw new Error("You are not authorized to delete this review");
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate product stats
    await updateProductRatingStats(productId);
};

// ─── Admin: Get All Reviews ────────────────────────────────────────────────────
export const getAllReviewsAdmin = async ({ page = 1, limit = 15, productId, rating }) => {
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Number(limit) || 15, 50);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        filter.product = productId;
    }
    if (rating) {
        filter.rating = Number(rating);
    }

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate("user", "fullName email profile")
            .populate("product", "name images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Review.countDocuments(filter),
    ]);

    return {
        reviews,
        pagination: {
            currentPage: pageNum,
            totalReviews: total,
            totalPages: Math.ceil(total / limitNum),
            hasNextPage: pageNum < Math.ceil(total / limitNum),
            hasPreviousPage: pageNum > 1,
        },
    };
};

// ─── Admin: Delete Any Review ──────────────────────────────────────────────────
export const adminDeleteReview = async (reviewId) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate product stats
    await updateProductRatingStats(productId);
};

// ─── Admin: Toggle Review Visibility ──────────────────────────────────────────
export const toggleReviewVisibility = async (reviewId) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    review.isVisible = !review.isVisible;
    await review.save();

    // Recalculate product stats (visibility affects averages)
    await updateProductRatingStats(review.product);

    return review;
};
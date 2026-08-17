import {
    createReview,
    getProductReviews,
    getMyReviewForProduct,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviewsAdmin,
    adminDeleteReview,
    toggleReviewVisibility,
} from "../services/review.service.js";

// ─── POST /api/reviews ─────────────────────────────────────────────────────────
export const createReviewController = async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;

        if (!productId || !orderId || !rating) {
            return res.status(400).json({
                success: false,
                message: "productId, orderId, and rating are required",
            });
        }

        const review = await createReview({
            userId: req.user.id,
            productId,
            orderId,
            rating: Number(rating),
            comment,
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review,
        });
    } catch (error) {
        const statusCode =
            error.message.includes("already reviewed") ? 409 :
            error.message.includes("not found") ? 404 :
            error.message.includes("authorized") ? 403 :
            error.message.includes("delivered") ? 422 :
            error.message.includes("Invalid") ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── GET /api/reviews/product/:productId ──────────────────────────────────────
export const getProductReviewsController = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await getProductReviews({ productId, page, limit });

        return res.status(200).json({
            success: true,
            data: result.reviews,
            ratingBreakdown: result.ratingBreakdown,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(error.message.includes("Invalid") ? 400 : 500).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── GET /api/reviews/my/:productId ───────────────────────────────────────────
export const getMyReviewController = async (req, res) => {
    try {
        const { productId } = req.params;

        const review = await getMyReviewForProduct({
            userId: req.user.id,
            productId,
        });

        return res.status(200).json({
            success: true,
            data: review, // null if not reviewed yet
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── GET /api/reviews/:reviewId ────────────────────────────────────────────────
export const getReviewByIdController = async (req, res) => {
    try {
        const review = await getReviewById(req.params.reviewId);

        return res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 400).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── PATCH /api/reviews/:reviewId ─────────────────────────────────────────────
export const updateReviewController = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const review = await updateReview({
            reviewId: req.params.reviewId,
            userId: req.user.id,
            rating: rating !== undefined ? Number(rating) : undefined,
            comment,
        });

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (error) {
        const statusCode =
            error.message.includes("not found") ? 404 :
            error.message.includes("authorized") ? 403 :
            error.message.includes("Invalid") ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── DELETE /api/reviews/:reviewId ────────────────────────────────────────────
export const deleteReviewController = async (req, res) => {
    try {
        await deleteReview({
            reviewId: req.params.reviewId,
            userId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        const statusCode =
            error.message.includes("not found") ? 404 :
            error.message.includes("authorized") ? 403 :
            error.message.includes("Invalid") ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── Admin: GET /api/reviews ───────────────────────────────────────────────────
export const getAllReviewsAdminController = async (req, res) => {
    try {
        const { page = 1, limit = 15, productId, rating } = req.query;

        const result = await getAllReviewsAdmin({ page, limit, productId, rating });

        return res.status(200).json({
            success: true,
            data: result.reviews,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── Admin: DELETE /api/reviews/admin/:reviewId ───────────────────────────────
export const adminDeleteReviewController = async (req, res) => {
    try {
        await adminDeleteReview(req.params.reviewId);

        return res.status(200).json({
            success: true,
            message: "Review deleted by admin",
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 400).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── Admin: PATCH /api/reviews/admin/:reviewId/toggle-visibility ──────────────
export const toggleVisibilityController = async (req, res) => {
    try {
        const review = await toggleReviewVisibility(req.params.reviewId);

        return res.status(200).json({
            success: true,
            message: `Review ${review.isVisible ? "shown" : "hidden"} successfully`,
            data: review,
        });
    } catch (error) {
        return res.status(error.message.includes("not found") ? 404 : 400).json({
            success: false,
            message: error.message,
        });
    }
};
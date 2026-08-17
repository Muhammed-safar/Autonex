import express from "express";
import {
    createReviewController,
    getProductReviewsController,
    getMyReviewController,
    getReviewByIdController,
    updateReviewController,
    deleteReviewController,
    getAllReviewsAdminController,
    adminDeleteReviewController,
    toggleVisibilityController,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// ─── Admin routes (must be before /:reviewId to avoid route conflicts) ─────────
router.get("/", protect, adminOnly, getAllReviewsAdminController);
router.delete("/admin/:reviewId", protect, adminOnly, adminDeleteReviewController);
router.patch("/admin/:reviewId/toggle-visibility", protect, adminOnly, toggleVisibilityController);

// ─── Public routes ─────────────────────────────────────────────────────────────
router.get("/product/:productId", getProductReviewsController);

// ─── Protected routes ──────────────────────────────────────────────────────────
router.post("/", protect, createReviewController);
router.get("/my/:productId", protect, getMyReviewController);
router.get("/:reviewId", protect, getReviewByIdController);
router.patch("/:reviewId", protect, updateReviewController);
router.delete("/:reviewId", protect, deleteReviewController);

export default router;
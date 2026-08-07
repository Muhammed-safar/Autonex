import express from "express";
import {
    cancelOrderController,
    createOrderController,
    downloadInvoiceController,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatusController
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";


const router = express.Router();

// Create Order
router.post("/", protect, createOrderController);

// Logged-in user's orders
router.get("/me", protect, getMyOrders);

// Get single order
router.get("/:id", protect, getOrderById);

// Admin - Get all orders
router.get("/", protect, adminOnly, getAllOrders);

router.patch(
    "/:id/status",
    protect,
    updateOrderStatusController
);

router.patch(
    "/:id/cancel",
    protect,
    cancelOrderController
);

router.get("/:id/invoice", protect, downloadInvoiceController);

export default router;
import Order from "../models/Order.js";
import { cancelOrder, createOrder, getOrderInvoice, updateOrderStatus } from "../services/order.service.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";

export const createOrderController = async (req, res) => {
    try {
        const { checkoutId, paymentDetails } = req.body;

        const order = await createOrder(
            checkoutId,
            paymentDetails
        );

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // User can only view their own order unless they're an admin
        if (
            order.user.toString() !== req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await updateOrderStatus(id, status);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update order status",
        });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const order = await cancelOrder({
            orderId: req.params.id,
            user: req.user,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        });

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully.",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const downloadInvoiceController = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await getOrderInvoice(id, req.user);

        generateInvoice(order, res);
    } catch (error) {
        console.error("Download Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate invoice",
        });
    }
};
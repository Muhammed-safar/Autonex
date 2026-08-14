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

        const {
            search = "",
            date = "",
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Number(limit) || 10, 10);

        const skip = (pageNumber - 1) * limitNumber;

        const filter = {
            user: req.user.id,
        };

        if (search.trim()) {
            const searchValue = search.trim();

            filter.$or = [
                {
                    orderNumber: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    trackingId: {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
                {
                    "items.name": {
                        $regex: searchValue,
                        $options: "i",
                    },
                },
            ];
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: start,
                $lte: end,
            };
        }

        const totalOrders = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: pageNumber,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limitNumber),
                limit: limitNumber,
                hasNextPage:
                    pageNumber < Math.ceil(totalOrders / limitNumber),
                hasPreviousPage: pageNumber > 1,
            },
        });

    } catch (error) {
        console.error("Get My Orders Error:", error);

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

        console.log("UPDATE STATUS BODY:", req.body);
        console.log("STATUS:", status);
        console.log("STATUS TYPE:", typeof status);

        // Make sure status is a string
        if (typeof status !== "string") {
            return res.status(400).json({
                success: false,
                message: "Status must be a string",
                receivedStatus: status,
            });
        }

        const order = await updateOrderStatus({
            orderId: id,
            status: status.toUpperCase(),
            updatedBy: req.user.id,
            role: req.user.role,
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);

        return res.status(400).json({
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

export const getOrderByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;

        const order = await Order.findOne({ trackingId })
            .populate("user", "fullName email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Get Order By Tracking ID Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get order",
        });
    }
};
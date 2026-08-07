import mongoose from "mongoose";
import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { generateQRCode } from "../utils/generateQRCode.js";
import { sendOrderStatusEmail } from "./email/order.email.js";

const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateUniqueTrackingId = async () => {
    while (true) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let id = "TRK-";

        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const exists = await Order.exists({ trackingId: id });

        if (!exists) {
            return id;
        }
    }
};

export const createOrder = async (checkoutId, paymentDetails ) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        // Find Checkout

        const checkout = await Checkout.findById(checkoutId).session(session);

        if (!checkout) {
            throw new Error("Checkout not found");

        }

        const existingOrder = await Order.findOne({
            checkout: checkout._id
        }).session(session);

        if (existingOrder) {
            throw new Error("Order already exists");
        }

        if (checkout.checkoutStatus === "COMPLETED") {
            throw new Error("Order already created");
        }

        const isCOD = checkout.payment.method === "COD";

        if (!isCOD && checkout.payment.status !== "PAID") {
            throw new Error("Payment is not completed");
        }

        if (checkout.expiresAt < new Date()) {
            throw new Error("Checkout session has expired");
        }

        // Validate Stock

        for (const item of checkout.items) {
            const product = await Product.findById(item.productId).session(session);

            if (!product) {
                throw new Error(`${item.name} not found`);
            }

            if (!product.isActive) {
                throw new Error(`${product.name} is unavailable`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`${item.name} is out of stock`);
            }
        }

        // Reduce Inventory

        for (const item of checkout.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: -item.quantity,
                        totalSold: item.quantity,
                    },
                },
                { session }
            );
        }

        // Create Order
        const orderStatus = isCOD
            ? "PLACED"
            : "CONFIRMED";

        const subtotal = Math.round(checkout.summary.subtotal);
        const shippingCharge = Math.round(checkout.summary.shipping);
        const discount = Math.round(checkout.summary.discount);
        const totalAmount = Math.round(checkout.summary.total);

        const trackingId = await generateUniqueTrackingId();
        const qrCode = await generateQRCode(trackingId);

        const order = await Order.create(
            [
                {
                    user: checkout.user,

                    checkout: checkout._id,

                    orderNumber: generateOrderNumber(),
                    trackingId,
                    qrCode,

                    items: checkout.items,

                    shippingAddress: checkout.shippingAddress,

                    paymentMethod: checkout.payment.method,

                    paymentStatus: isCOD
                        ? "PENDING"
                        : "PAID",

                    payment: isCOD
                        ? {}
                        : {
                            razorpayOrderId: paymentDetails.razorpayOrderId,
                            razorpayPaymentId: paymentDetails.razorpayPaymentId,
                            razorpaySignature: paymentDetails.razorpaySignature,
                        },

                    subtotal,
                    shippingCharge,
                    discount,
                    totalAmount,

                    orderStatus,

                    statusHistory: [
                        {
                            status: orderStatus,
                            updatedBy: checkout.user,
                            role: "SYSTEM",
                            note: isCOD
                                ? "Order placed successfully."
                                : "Payment verified and order confirmed.",
                        },
                    ],
                },
            ],
            { session }
        );

        // Update Checkout

        checkout.checkoutStatus = "COMPLETED";
        if (!isCOD) {
            checkout.payment.status = "PAID";
        }

        await checkout.save({ session });

        // Clear Cart

        await Cart.findOneAndUpdate(
            { userId: checkout.user },
            {
                items: [],
                totalPrice: 0,
                totalQuantity: 0,
                discountPrice: 0,
            },
            { session }
        );

        await session.commitTransaction();

        const createdOrder = await Order.findById(order[0]._id)
            .populate("user", "fullName email");

        try {
            await sendOrderStatusEmail({
                order: createdOrder,
                title: "Order Confirmation",
                subject: `Order ${createdOrder.orderNumber} Confirmed`,
                message: "Your order has been placed successfully.",
            });
        } catch (error) {
            console.error("Failed to send order confirmation email:", error);
        }

        return createdOrder;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const updateOrderStatus = async ({
    orderId,
    status,
    employeeId,
    ipAddress,
    userAgent,
}) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const validTransitions = {
        PLACED: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["PROCESSING", "CANCELLED"],
        PROCESSING: ["SHIPPED", "CANCELLED"],
        SHIPPED: ["OUT_FOR_DELIVERY"],
        OUT_FOR_DELIVERY: ["DELIVERED"],
        DELIVERED: [],
        CANCELLED: [],
        RETURN_REQUESTED: ["RETURNED"],
        RETURNED: [],
    };

    const allowedStatuses = validTransitions[order.orderStatus] || [];

    if (!allowedStatuses.includes(status)) {
        throw new Error(
            `Cannot change status from ${order.orderStatus} to ${status}`
        );
    }

    const oldStatus = order.orderStatus;

    // Update current status
    order.orderStatus = status;

    // Special timestamps
    if (status === "DELIVERED") {
        order.deliveredAt = new Date();
    }

    if (status === "CANCELLED") {
        order.cancelledAt = new Date();
    }

    // Timeline / Audit
    order.statusHistory.push({
        status,
        updatedBy: employeeId,
        role: "EMPLOYEE",
        ipAddress,
        userAgent,
        note: `Status changed from ${oldStatus} to ${status}`,
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id)
        .populate("user", "name email");

    if (status === "SHIPPED") {
        sendOrderStatusEmail({
            order: updatedOrder,
            title: "Order Shipped",
            subject: `Order ${updatedOrder.orderNumber} Shipped`,
            message: "Great news! Your order has been shipped."
        }).catch((error) => {
            console.error(
                `Failed to send shipped email for order ${updatedOrder.orderNumber}:`,
                error
            )
        })
    }

    if (status === "DELIVERED") {
        sendOrderStatusEmail({
            order: updatedOrder,
            title: "Order Delivered",
            subject: `Order ${updatedOrder.orderNumber} Delivered`,
            message: "Your order has been delivered successfully."
        }).catch((error) => {
            console.error(
                `Failed to send delivered email for order ${updatedOrder.orderNumber}:`,
                error
            )
        })
    }

    const nextStatus = validTransitions[order.orderStatus]?.[0] || null;

    return {
        order: updatedOrder,
        currentStatus: updatedOrder.orderStatus,
        nextStatus,
    };
};

export const cancelOrder = async ({
    orderId,
    user,
    ipAddress,
    userAgent,
}) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        // Permission
        const isOwner = order.user.toString() === user._id.toString();
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("You are not authorized to cancel this order");
        }

        // Already cancelled
        if (order.orderStatus === "CANCELLED") {
            throw new Error("Order is already cancelled");
        }

        // Allowed statuses for cancellation
        const cancellableStatuses = [
            "PLACED",
            "CONFIRMED",
            "PROCESSING",
        ];

        if (isOwner && !cancellableStatuses.includes(order.orderStatus)) {
            throw new Error(
                "Order cannot be cancelled after it has been shipped."
            );
        }
        // Razorpay Refund (Future Step)

        let refund = null;

        if (
            order.paymentMethod === "RAZORPAY" &&
            order.paymentStatus === "PAID"
        ) {
            refund = await refundPayment(
                order.payment.razorpayPaymentId,
                Math.round(order.totalAmount * 100)
            );

            order.paymentStatus = "REFUNDED";
            order.refundStatus = "COMPLETED";
        }

        // Restore Inventory
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: item.quantity,
                        totalSold: -item.quantity,
                    },
                },
                { session }
            );
        }

        // Update Order
        order.orderStatus = "CANCELLED";
        order.cancelledAt = new Date();

        // refund
        if (refund) {
            order.refund = {
                razorpayRefundId: refund.id,
                amount: refund.amount,
                processedAt: new Date(),
            };
        }

        // Timeline
        order.statusHistory.push({
            status: "CANCELLED",
            updatedBy: user._id,
            role: isAdmin ? "ADMIN" : "USER",
            ipAddress,
            userAgent,
            note: isAdmin
                ? "Order cancelled by admin."
                : "Order cancelled by customer.",
        });

        await order.save({ session });

        await session.commitTransaction();

        const cancelledOrder = await Order.findById(order._id)
            .populate("user", "name email");

        sendOrderStatusEmail({
            order: cancelledOrder,
            title: "Order Cancelled",
            subject: `Order ${cancelledOrder.orderNumber} Cancelled`,
            message: "Your order has been cancelled successfully.",
        }).catch((error) => {
            console.error(
                `Failed to send cancellation email for order ${cancelledOrder.orderNumber}:`,
                error
            );
        });

        return cancelledOrder;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const getOrderInvoice = async (orderId, user) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
    }

    const order = await Order.findById(orderId)
        .populate("user", "name email");

    if (!order) {
        throw new Error("Order not found");
    }

    // Check Permission
    const isOwner = order.user._id.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new Error("You are not authorized to view this invoice");
    }

    return order;
};
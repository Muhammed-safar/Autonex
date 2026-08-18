import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        checkout: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Checkout",
        },

        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: String,

                image: String,

                quantity: {
                    type: Number,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },

                subtotal: Number,
            },
        ],

        shippingAddress: {
            fullName: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            landmark: String,
        },

        paymentMethod: {
            type: String,
            enum: ["RAZORPAY", "COD"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },

        payment: {
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String,
        },

        subtotal: Number,

        shippingCharge: {
            type: Number,
            default: 0,
        },

        discount: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
                "RETURN_REQUESTED",
                "RETURNED",
            ],
            default: "PLACED",
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "PLACED",
                        "CONFIRMED",
                        "PROCESSING",
                        "SHIPPED",
                        "OUT_FOR_DELIVERY",
                        "DELIVERED",
                        "CANCELLED",
                        "RETURN_REQUESTED",
                        "RETURNED",
                    ],
                    required: true,
                },

                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    default: null,
                },

                role: {
                    type: String,
                    enum: ["ADMIN", "EMPLOYEE", "SYSTEM", "USER"],
                    default: "SYSTEM",
                },
                ipAddress: {
                    type: String,
                    default: "",
                },
                userAgent: {
                    type: String,
                    default: "",
                },

                note: {
                    type: String,
                    default: "",
                },

                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],


        deliveredAt: Date,
        cancelledAt: {
            type: Date,
            default: null
        },

        refundStatus: {
            type: String,
            enum: ["NOT_REQUIRED",
                "PENDING",
                "COMPLETED"],
            default: "NOT_REQUIRED",
        },

        refund: {
            razorpayRefundId: String,
            amount: Number,
            processedAt: Date,
        },

        trackingId: {
            type: String,
            unique: true,
            required: true,
        },

        qrCode: {
            type: String,
        },

        courier: {
            company: String,
            trackingNumber: String,
        },

        whatsappNotificationSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Order", orderSchema);
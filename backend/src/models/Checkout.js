import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
            },

            name: {
                type: String,
                required: true
            },

            image: {
                type: String,
                default: ""
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            subtotal: {
                type: Number,
                required: true
            }
        }],

        shippingAddress: {
            fullName: String,
            phone: String,

            addressLine1: String,
            addressLine2: String,

            city: String,
            state: String,
            postalCode: String,
            country: String,
            landmark: String
        },

        payment: {
            method: {
                type: String,
                enum: ["COD", "RAZORPAY"]
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "PAID",
                    "FAILED",
                    "REFUNDED"
                ],
                default: "PENDING"
            },

            transactionId: String,

            razorpayOrderId: String,

            razorpayPaymentId: String,
            razorpaySignature: String,
        },

        coupon: {
            code: {
                type: String,
                default: null,
            },

            percentage: {
                type: Number,
                default: 0,
            },
        },

        summary: {
            subtotal: {
                type: Number,
                required: true
            },

            shipping: {
                type: Number,
                default: 0
            },

            discount: {
                type: Number,
                default: 0
            },

            total: {
                type: Number,
                required: true
            }
        },

        checkoutStatus: {
            type: String,
            enum: [
                "ACTIVE",
                "COMPLETED",
                "EXPIRED"
            ],
            default: "ACTIVE"
        },

        expiresAt: {
            type: Date,
            default: () => {
                return new Date(Date.now() + 30 * 60 * 1000);
            }
        }

    },
    {
        timestamps: true
    });

export default mongoose.model("Checkout", checkoutSchema);  
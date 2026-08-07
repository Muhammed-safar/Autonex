import crypto from "crypto";
import Checkout from "../models/Checkout.js";
import razorpay from "../config/razorpay.js";

export const createPaymentOrderService = async (userId) => {

    // Find checkout
    const checkout = await Checkout.findOne({ user: userId, checkoutStatus: "ACTIVE" });

    if (!checkout) {
        throw new Error("Checkout not found");
    }

    if (!checkout.items.length) {
        throw new Error("Checkout is empty");
    }

    // Razorpay expects amount in paise
    const amount = Math.round(checkout.summary.total * 100);

    const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${checkout._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save Razorpay Order ID
    checkout.payment.razorpayOrderId = razorpayOrder.id;
    await checkout.save();

    return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
    };
};

export const verifyPaymentService = async ({
    userId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
}) => {

    // Validate required fields
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        throw new Error("Payment details are required");
    }

    // Find checkout
    const checkout = await Checkout.findOne({ user: userId });

    if (!checkout) {
        throw new Error("Checkout not found");
    }

    // Ensure the order belongs to this checkout
    if (checkout.payment.razorpayOrderId !== razorpay_order_id) {
        throw new Error("Invalid Razorpay order");
    }

    // Generate expected signature
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
        throw new Error("Payment verification failed");
    }

    // Update payment details
    checkout.payment.razorpayPaymentId = razorpay_payment_id;
    checkout.payment.razorpaySignature = razorpay_signature;
    checkout.payment.status = "PAID";

    await checkout.save();

    return {
        success: true,
        message: "Payment verified successfully",
    };
};
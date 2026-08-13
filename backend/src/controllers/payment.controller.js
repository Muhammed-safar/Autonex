import { createPaymentOrderService, verifyPaymentService } from "../services/payment.service.js"

export const createPaymentOrder = async (req, res) => {
    try {
        const { checkoutId } = req.body || {};

        console.log("CREATE PAYMENT ORDER");
        console.log("User ID:", req.user.id);
        console.log("Checkout ID:", checkoutId);

        if (!checkoutId) {
            return res.status(400).json({
                success: false,
                message: "Checkout ID is required",
            });
        }

        const paymentOrder = await createPaymentOrderService(
            req.user.id,
            checkoutId
        );

        return res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            data: paymentOrder,
        });

    } catch (error) {
        console.error("Create Payment Order Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const {
            checkoutId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const result = await verifyPaymentService({
            userId: req.user.id,
            checkoutId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
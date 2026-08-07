import { createPaymentOrderService, verifyPaymentService } from "../services/payment.service.js"

export const createPaymentOrder = async (req, res) => {
    try {
        const paymentOrder = await createPaymentOrderService(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            data: paymentOrder,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const verification = await verifyPaymentService({
            userId: req.user.id,
            ...req.body,
        });

        return res.status(200).json({
            success: true,
            message: verification.message,
            data: verification,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
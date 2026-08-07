import { checkoutService } from "../services/checkout.service.js";

export const checkout = async (req, res, next) => {
    try {
        const result = await checkoutService(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: "Checkout calculated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
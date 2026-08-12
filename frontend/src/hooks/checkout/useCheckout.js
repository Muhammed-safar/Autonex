import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { checkout } from "../../api/checkout.api.js";

export const useCheckout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: checkout,

        onSuccess: (response) => {
            const checkoutResult = response.data;

            switch (checkoutResult.nextStep) {

                case "PAYMENT":
                    navigate("/payment", {
                        state: {
                            checkoutData: checkoutResult.checkout,
                        },
                    });
                    break;

                case "CREATE_ORDER":
                    navigate("/confirm-order", {
                        state: {
                            checkoutData: checkoutResult.checkout,
                        },
                    });
                    break;

                default:
                    console.error(
                        "Unknown checkout nextStep:",
                        checkoutResult.nextStep
                    );
            }
        },

        onError: (error) => {
            console.error(
                "Checkout Failed:",
                error.response?.data?.message || error.message
            );
        },
    });
};
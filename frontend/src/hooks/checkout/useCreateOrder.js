import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPaymentOrder } from "../../api/order.api"; 

export const useCreateOrder = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createPaymentOrder,

        onSuccess: (response) => {

            navigate("/order-success", {
                state: {
                    order: response.order,
                },
            });
        },

        onError: (error) => {
            console.error(
                "Order creation failed:",
                error.response?.data?.message || error.message
            );
        },
    });
};
import { useMutation } from "@tanstack/react-query";
import { createPaymentOrder } from "../../api/payment.api.js"; 

const useCreatePaymentOrder = () => {
    return useMutation({
        mutationFn: createPaymentOrder,
    });
};

export default useCreatePaymentOrder;
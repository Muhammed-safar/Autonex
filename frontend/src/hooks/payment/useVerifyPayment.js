import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../../api/payment.api.js";

const useVerifyPayment = () => {
    return useMutation({
        mutationFn: verifyPayment,
    });
};

export default useVerifyPayment;
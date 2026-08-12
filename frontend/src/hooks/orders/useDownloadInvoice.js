import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { downloadInvoice } from "../../api/order.api.js";

export const useDownloadInvoice = () => {
    return useMutation({
        mutationFn: downloadInvoice,

        onSuccess: (blob, orderId) => {
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `invoice-${orderId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success("Invoice downloaded successfully");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to download invoice"
            );
        },
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createOrder } from "../../api/order.api.js";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: (data) => {
      // Refresh user's orders
      queryClient.invalidateQueries({
        queryKey: ["orders", "me"],
      });

      // Success notification
      toast.success(
        data.message || "Order placed successfully"
      );

      // Navigate to order details
      navigate("/order-success", {
        state: {
          order: data.data,
        }
      })
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order"
      );
    },
  });
};
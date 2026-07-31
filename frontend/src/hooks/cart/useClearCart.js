import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../../api/cart.api";
import toast from "react-hot-toast";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success(data.message || "Cart cleared");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../../api/cart.api.js";
import toast from "react-hot-toast";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success(data.message || "Cart updated");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};
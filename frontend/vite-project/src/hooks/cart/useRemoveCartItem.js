import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../../api/cart.api.js";
import toast from "react-hot-toast";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success(data.message || "Item removed");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Remove failed");
    },
  });
};
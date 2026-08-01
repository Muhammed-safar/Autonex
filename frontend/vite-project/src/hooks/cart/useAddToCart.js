import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../../api/cart.api.js";
import toast from "react-hot-toast";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success(data.message || "Added to cart");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add item");
    },
  });
};
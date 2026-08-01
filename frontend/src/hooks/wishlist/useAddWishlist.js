import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist } from "../../api/wishlist.api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { addLocalWishlist } from "../../utils/localWishlist.js";

export const useAddWishlist = () => {
  const queryClient = useQueryClient();

  const accessToken = useSelector((state) => state.auth.accessToken);

  return useMutation({
    mutationFn: (product) => {
      if (!accessToken) {
        addLocalWishlist(product);

        return Promise.resolve({
          message: "Added to wishlist.",
        });
      }

      return addToWishlist(product._id);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success(data?.message || "Added to wishlist.");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add wishlist.");
    },
  });
};

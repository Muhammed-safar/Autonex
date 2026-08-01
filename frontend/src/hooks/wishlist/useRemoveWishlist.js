import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlist } from "../../api/wishlist.api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { removeLocalWishlist } from "../../utils/localWishlist.js";

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();

  const accessToken = useSelector((state) => state.auth.accessToken);

  return useMutation({
    mutationFn: (productId) => {
      if (!accessToken) {
        removeLocalWishlist(productId);

        return Promise.resolve({
          message: "Product removed from wishlist.",
        });
      }

      return removeFromWishlist(productId);
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Product removed from wishlist.");

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist."
      );
    },
  });
};  
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearWishlist } from "../../api/wishlist.api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { clearLocalWishlist } from "../../utils/localWishlist.js";

export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  const accessToken = useSelector((state) => state.auth.accessToken);

  return useMutation({
    mutationFn: () => {
      if (!accessToken) {
        clearLocalWishlist();

        return Promise.resolve({
          message: "Wishlist cleared successfully.",
        });
      }

      return clearWishlist();
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Wishlist cleared successfully.");

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear wishlist.");
    },
  });
};

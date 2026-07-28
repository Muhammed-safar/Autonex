import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../api/product.api";
import { toast } from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: (data) => {
      toast.success(data.message || "Product deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete product."
      );
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../api/product.api";
import { toast } from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) =>
      updateProduct({id, formData}),

    onSuccess: (data) => {
      toast.success(data.message || "Product updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update product."
      );
    },
  });
};
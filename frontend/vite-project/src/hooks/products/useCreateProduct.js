import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../api/product.api.js";
import { toast } from "react-hot-toast";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: (data) => {
      toast.success(data.message || "Product created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create product."
      );
    },
  });
};
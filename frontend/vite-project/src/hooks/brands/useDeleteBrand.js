import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrand } from "../../api/brand.api";

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};
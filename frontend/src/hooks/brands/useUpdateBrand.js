import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrand } from "../../api/brand.api";

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};
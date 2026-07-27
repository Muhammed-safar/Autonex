import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBrandStatus } from "../../api/brand.api";

export const useToggleBrandStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBrandStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};
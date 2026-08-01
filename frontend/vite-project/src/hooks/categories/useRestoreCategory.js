import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreCategory } from "../../api/category.api.js";

export const useRestoreCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};
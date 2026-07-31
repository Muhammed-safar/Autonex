import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "../../api/address.api";
import toast from "react-hot-toast";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success(data.message || "Address added");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add address");
    },
  });
};
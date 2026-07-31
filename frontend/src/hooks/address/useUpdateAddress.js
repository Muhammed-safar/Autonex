import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "../../api/address.api";
import toast from "react-hot-toast";

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success(data.message || "Address updated");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};
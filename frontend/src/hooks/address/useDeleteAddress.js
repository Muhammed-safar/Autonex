import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "../../api/address.api";
import toast from "react-hot-toast";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success(data.message || "Address deleted");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });
};
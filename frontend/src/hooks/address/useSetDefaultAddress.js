import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultAddress } from "../../api/address.api";
import toast from "react-hot-toast";

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultAddress,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success(data.message || "Default address updated");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update default address"
      );
    },
  });
};
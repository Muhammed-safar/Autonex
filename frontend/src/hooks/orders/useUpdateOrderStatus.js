import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../../api/order.api.js";

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", "me"],
      });
    },
  });
};

export default useUpdateOrderStatus;
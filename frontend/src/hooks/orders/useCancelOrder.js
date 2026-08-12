import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../../api/order.api.js";

const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,

    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "me"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", "all"],
      });
    },
  });
};

export default useCancelOrder;
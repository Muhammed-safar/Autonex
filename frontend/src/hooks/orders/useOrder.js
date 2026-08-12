import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../api/order.api.js";

const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export default useOrder;
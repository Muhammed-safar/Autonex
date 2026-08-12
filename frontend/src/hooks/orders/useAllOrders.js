import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../api/order.api.js";

const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: getAllOrders,
  });
};

export default useAllOrders;
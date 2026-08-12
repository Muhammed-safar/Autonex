import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../api/order.api.js";

const useMyOrders = (
  search = "",
  date = "",
  page = 1
) => {
  return useQuery({
    queryKey: ["orders", "me", search, date, page],

    queryFn: () =>
      getMyOrders(search, date, page),

    placeholderData: (previousData) => previousData,
  });
};

export default useMyOrders;
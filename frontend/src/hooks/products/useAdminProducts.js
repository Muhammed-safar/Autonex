import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../../api/product.api";

export const useAdminProducts = (params = {}) => {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => getAdminProducts(params),
    staleTime: 1000 * 60 * 15,
  });
};
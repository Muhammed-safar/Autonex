import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/product.api.js";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
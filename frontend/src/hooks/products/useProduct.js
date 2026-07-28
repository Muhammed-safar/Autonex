import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../api/product.api";

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};
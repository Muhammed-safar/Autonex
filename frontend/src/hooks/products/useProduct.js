import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../api/product.api";

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

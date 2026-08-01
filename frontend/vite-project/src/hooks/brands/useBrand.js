import { useQuery } from "@tanstack/react-query";
import { getBrandById } from "../../api/brand.api";

export const useBrand = (id) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });
};
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../api/brand.api";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 5,
  });
};
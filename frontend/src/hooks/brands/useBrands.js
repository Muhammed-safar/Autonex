import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../api/brand.api";

export const useBrands = ({ page = 1, search = "" } = {}) => {
  return useQuery({
    queryKey: ["brands", page, search],
    queryFn: () => getBrands({ page, search }),
    staleTime: 1000 * 60 * 5,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category.api.js";

export const useCategories = ({ page = 1, search = "" } = {}) => {
  return useQuery({
    queryKey: ["categories", page, search],
    queryFn: () => getCategories({ page, search }),
    staleTime: 1000 * 60 * 5,
  });
};

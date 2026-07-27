import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../../api/category.api.js";

export const useCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};
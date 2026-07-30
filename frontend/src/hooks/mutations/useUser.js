import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/auth.api";

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
};

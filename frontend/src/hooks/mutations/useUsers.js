import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/auth.api";

export const useUsers = (page = 1, limit = 20, search = "") => {
  return useQuery({
    queryKey: ["users", page, limit, search],

    queryFn: () =>
      getAllUsers({
        page,
        limit,
        search,
      }),

    keepPreviousData: true,
  });
};

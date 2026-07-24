import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../../api/auth.api";
import { setUser } from "../../redux/slices/authSlice";

export const useCurrentUser = (enabled = true) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["currentUser"],

    queryFn: async () => {
      const data = await getCurrentUser();

      dispatch(setUser(data.user));

      return data.user;
    },

    enabled,

    staleTime: 1000 * 60 * 5,

    retry: false,
  });
};
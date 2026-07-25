import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../../api/auth.api";
import { logout } from "../../redux/slices/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: async () => {
      // Clear Redux
      dispatch(logout());

      // Clear all React Query cache
      queryClient.clear();

      // Redirect to login
      navigate("/account", { replace: true });
    },

    onError: (error) => {
      console.error("Logout failed:", error);

      // Even if the server request fails, clear local state
      dispatch(logout());
      queryClient.clear();

      navigate("/account", { replace: true });
    },
  });
};

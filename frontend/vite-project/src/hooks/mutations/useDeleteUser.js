import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteUser } from "../../api/auth.api";
import { queryClient } from "../queryClient";

export const useDeleteUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      // Remove all cached server data
      queryClient.clear();

      // Clear Redux auth state
      dispatch(logout());

      // Redirect
      navigate("/", { replace: true });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });
};

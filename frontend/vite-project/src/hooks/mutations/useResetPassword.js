import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { resetPassword } from "../../api/auth.api";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,

    onSuccess: (data) => {
      toast.success(
        data.message || "Password reset successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Password reset failed."
      );
    },
  });
};
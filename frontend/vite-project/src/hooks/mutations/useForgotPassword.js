import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../../api/auth.api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: (data) => {
      toast.success(
        data.message || "OTP sent successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP."
      );
    },
  });
};
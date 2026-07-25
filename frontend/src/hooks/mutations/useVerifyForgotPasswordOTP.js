import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { verifyForgotPassword } from "../../api/auth.api";

export const useVerifyForgotPasswordOTP = () => {
  return useMutation({
    mutationFn: verifyForgotPassword,

    onSuccess: (data) => {
      toast.success(
        data.message || "OTP verified successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed."
      );
    },
  });
};
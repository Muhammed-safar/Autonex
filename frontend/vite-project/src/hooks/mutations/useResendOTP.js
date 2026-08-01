import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resendOTP } from "../../api/auth.api.js";

const OTP_SESSION_KEY = "pendingVerification";

export const useResendOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const pendingUser = sessionStorage.getItem(OTP_SESSION_KEY);

      if (!pendingUser) {
        throw new Error("No pending verification found.");
      }

      const { email } = JSON.parse(pendingUser);

      return await resendOTP({ email });
    },

    onSuccess: (data) => {
      toast.success(data?.message || "OTP resent successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to resend OTP."
      );
    },
  });
};
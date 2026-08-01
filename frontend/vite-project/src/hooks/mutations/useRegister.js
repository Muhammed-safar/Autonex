import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register } from "../../api/auth.api";

const OTP_SESSION_KEY = "pendingVerification";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,

    onSuccess: (data, variables) => {
      // Store email for OTP verification (expires in 10 minutes)
      sessionStorage.setItem(
        OTP_SESSION_KEY,
        JSON.stringify({
          email: variables.email,
          type: "registration",
          expiresAt: Date.now() + 10 * 60 * 1000,
        }),
      );

      toast.success(data.message || "OTP sent successfully.");

      navigate("/verify-otp");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed.");
    },
  });
};

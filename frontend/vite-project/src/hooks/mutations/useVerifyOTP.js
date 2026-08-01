import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyOTP } from "../../api/auth.api";

export const useVerifyOTP = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOTP,

    onSuccess: (data) => {
      toast.success(data.message || "Account verified successfully.");

      navigate("/account");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    },
  });
};

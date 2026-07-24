import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../../api/auth.api";
import { setCredentials } from "../../redux/slices/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        }),
      );

      navigate("/");
    },

    onError: (error) => {
      console.error(error);

      // Later we'll replace this with toast
      alert(error.response?.data?.message || "Login Failed");
    },
  });
};
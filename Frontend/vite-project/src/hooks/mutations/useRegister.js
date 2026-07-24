import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { register } from "../../api/auth.api";
import { setCredentials } from "../../redux/slice/authSlice.js";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );

      navigate("/");
    },

    onError: (error) => {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    },
  });
};
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { updateProfile } from "../../api/auth.api"; 
import { setUser } from "../../redux/slice/authSlice.js";

export const useUpdateProfile = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      dispatch(setUser(data.user));

      toast.success(data.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Profile update failed.");
    },
  });
};

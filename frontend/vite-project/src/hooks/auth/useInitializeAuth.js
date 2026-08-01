import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { refreshAccessToken, getCurrentUser } from "../../api/auth.api";

import {
  setAccessToken,
  setUser,
  logout,
  setAuthInitialized,
} from "../../redux/slice/authSlice.js";

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get a new access token using the refresh cookie
        const refreshResponse = await refreshAccessToken();

        dispatch(setAccessToken(refreshResponse.accessToken));

        // Fetch the current user
        const userResponse = await getCurrentUser();

        dispatch(setUser(userResponse.user));
      } catch (error) {
        // No valid session
        dispatch(logout());
      } finally {
        dispatch(setAuthInitialized(true));
      }
    };

    initialize();
  }, [dispatch]);
};

import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken, logout } from "../redux/slices/authSlice";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const currency = store.getState().currency.currency;

config.headers["X-Currency"] = currency;

    return config;
  },
  (error) => Promise.reject(error),
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};


API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;


    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return API(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );

      const newAccessToken = response.data.accessToken;

      store.dispatch(setAccessToken(newAccessToken));

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return API(originalRequest);
    } catch (err) {
      processQueue(err);

      store.dispatch(logout());

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default API;

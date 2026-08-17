import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken, logout } from "../redux/slices/authSlice";

// ======================================================
// CUSTOMER API
// ======================================================

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Customer request interceptor
API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Customer-selected currency
    const currency = store.getState().currency.currency;

    config.headers["X-Currency"] = currency;

    return config;
  },
  (error) => Promise.reject(error),
);


// ======================================================
// CUSTOMER TOKEN REFRESH
// ======================================================

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

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

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

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

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


// ======================================================
// ADMIN API
// ======================================================

export const ADMIN_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Admin request interceptor
ADMIN_API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Admin-selected/default currency
    const adminCurrency =
      localStorage.getItem("adminCurrency") || "INR";

    config.headers["X-Currency"] = adminCurrency;

    return config;
  },
  (error) => Promise.reject(error),
);


// ======================================================
// ADMIN TOKEN REFRESH
// ======================================================

ADMIN_API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return ADMIN_API(originalRequest);
    } catch (err) {
      store.dispatch(logout());

      return Promise.reject(err);
    }
  },
);

export default API;
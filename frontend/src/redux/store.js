import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js"
import currencyReducer from "./slices/currencySlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currency: currencyReducer,
  },

  devTools: import.meta.env.DEV,
});
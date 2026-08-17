import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: localStorage.getItem("currency") || "INR",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,

  reducers: {
    // User explicitly changes currency
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("currency", action.payload);
    },

    // Admin default - do NOT save to localStorage
    setDefaultCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency, setDefaultCurrency } = currencySlice.actions;

export default currencySlice.reducer;
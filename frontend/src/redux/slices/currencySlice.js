import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: localStorage.getItem("currency") || "USD",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,

  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("currency", action.payload);
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
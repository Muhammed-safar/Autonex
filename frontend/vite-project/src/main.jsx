import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { WishlistProvider } from "./context/WishlistContext";

import { store } from "./redux/store.js";
import { queryClient } from "./hooks/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>,
);
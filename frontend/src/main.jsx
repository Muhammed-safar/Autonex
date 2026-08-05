import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { store } from "./redux/store.js";
import { queryClient } from "./hooks/queryClient.js";
import AuthProvider from "./providers/AuthProvider.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WishlistProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </WishlistProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>,
);

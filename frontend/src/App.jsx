import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {useInitializeAuth} from "./hooks/auth/useInitializeAuth.js"

import MainLayout from "./Layouts/MainLayout";
import Home from "./pages/home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetailsPage from "./pages/Shop/ProductDetailsPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/cart/CheckoutPage";
import AuthPage from "./pages/Login/AuthPage";
import Wishlist from "./pages/cart/Wishlist";
import MyGaragePage from "./pages/garage/MyGaragePage";
import ProfileLayout from "./pages/Login/profile/ProfileLayout";
import ComparePage from "./pages/cart/ComparePage";
import AdminLayout from "./components/admin/AdminLayout";
import Categories from "./components/admin/Categories";
import Products from "./components/admin/products/Products.jsx"
import Brands from "./components/admin/Brands";
import Orders from "./components/admin/Orders";
import UsersView from "./components/admin/UsersView";
import VerifyOTPPage from "./pages/Login/VerifyOTPPage";
import ResetPassword from "./pages/Login/ResetPassword";
import ForgotPassword from "./pages/Login/ForgotPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import Dashboard from "./components/admin/Dashboard.jsx";

const App = () => {
  useInitializeAuth();
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  // Callback to return user to shop page
  const handleReturnToShop = () => {
    navigate("/shop");
  };

  const authInitialized = useSelector((state) => state.auth.authInitialized);

  if (!authInitialized) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/category/tires-wheels"
            element={
              <Shop
                pageTitle="Tires & Wheels"
                defaultCategory="Tires & Wheels"
              />
            }
          />
          <Route
            path="/category/headlights-lighting"
            element={
              <Shop
                pageTitle="Headlights & Lighting"
                defaultCategory="Headlights & Lighting"
              />
            }
          />
          <Route path="/product/:sku" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route element={<PublicRoute />}>
            <Route path="/account" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/auth" element={<ProfileLayout />} />

            <Route path="/cart/checkout" element={<CheckoutPage />} />
            <Route path="/MyGaragePage" element={<MyGaragePage />} />
          </Route>

          <Route
            path="/wish-list"
            element={<Wishlist onReturnToShop={handleReturnToShop} />}
          />
          <Route path="/compare" element={<ComparePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<UsersView />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;

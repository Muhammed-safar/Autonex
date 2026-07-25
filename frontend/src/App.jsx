import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
import Dashboard from "./components/admin/Dashboard";
import Categories from "./components/admin/Categories";
import Products from "./components/admin/Products";
import Brands from "./components/admin/Brands";
import Orders from "./components/admin/Orders";
import UsersView from "./components/admin/UsersView";
import ProtectedRoute from "./routes/ProtectedRoute";
import VerifyOTPPage from "./pages/Login/VerifyOTPPage";
import ResetPassword from "./pages/Login/ResetPassword";
import ForgotPassword from "./pages/Login/ForgotPassword";

const App = () => {
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
          <Route path="/cart/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AuthPage />} />
          <Route
            path="/auth"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/wish-list"
            element={<Wishlist onReturnToShop={handleReturnToShop} />}
          />
          <Route path="/compare" element={<ComparePage />} />

          <Route path="/MyGaragePage" element={<MyGaragePage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/brands" element={<Brands />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/users" element={<UsersView />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

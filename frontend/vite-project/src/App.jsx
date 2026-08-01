import { Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProductDetailsPage from "./pages/Shop/ProductDetailsPage";
import Home from "./pages/home/Home";
import Shop from "./pages/Shop/Shop.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import CheckoutPage from "./pages/cart/CheckoutPage.jsx";
import AuthPage from "./pages/Login/AuthPage.jsx";
import MyGaragePage from "./pages/Garage/MyGarage.jsx";
import Wishlist from "./pages/cart/Wishlist.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import ComparePage from "./pages/cart/ComparePage.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import Products from "./components/admin/products/Products.jsx";
import Orders from "./components/admin/Orders.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import ForgotPassword from "./pages/Login/ForgotPassword.jsx";
import VerifyOTPPage from "./pages/Login/VerifyOTPPage.jsx";
import ResetPassword from "./pages/Login/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProfileLayout from "./pages/Login/profile/ProfileLayout.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useInitializeAuth } from "./hooks/auth/useInitializeAuth.js";
import PageLoader from "./components/admin/common/PageLoader.jsx";
import Brands from "./components/admin/brand/Brands.jsx";
import Categories from "./components/admin/category/Categories.jsx";
import UsersView from "./components/admin/users/users/UsersView.jsx";

function App() {
  const navigate = useNavigate();
  useInitializeAuth();

  // Callback to return user to shop page
  const handleReturnToShop = () => {
    navigate("/shop");
  };
  const authInitialized = useSelector((state) => state.auth.authInitialized);

  if (!authInitialized) {
    return <PageLoader />;
  }
  return (
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/checkout" element={<CheckoutPage />} />
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
          <Route element={<PublicRoute />}>
            <Route path="/account" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/auth" element={<ProfileLayout />} />

            <Route path="/cart/checkout" element={<CheckoutPage />} />
            <Route path="/My-garage" element={<MyGaragePage />} />
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
    </WishlistProvider>
  );
}

export default App;

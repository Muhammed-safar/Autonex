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
import Products from "./components/admin/Products.jsx";
import Categories from "./components/admin/Categories.jsx";
import Brands from "./components/admin/Brands.jsx";
import Orders from "./components/admin/Orders.jsx";
import UsersView from "./components/admin/UsersView.jsx";

function App() {
  const navigate = useNavigate();

  // Callback to return user to shop page
  const handleReturnToShop = () => {
    navigate("/shop");
  };

  return (
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:sku" element={<ProductDetailsPage />} />
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
          <Route path="/account" element={<AuthPage />} />
          <Route path="/My-garage" element={<MyGaragePage />} />
          <Route
            path="/wish-list"
            element={<Wishlist onReturnToShop={handleReturnToShop} />}
          />
          <Route path="/compare" element={<ComparePage />} />
        </Route>
         <Route path="/test" element={<h1>TEST PAGE</h1>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="category" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<UsersView />} />
        </Route>
      </Routes>
    </WishlistProvider>
  );
}

export default App;

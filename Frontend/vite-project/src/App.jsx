import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProductDetailsPage from "./pages/Shop/ProductDetailsPage";
import Home from "./pages/home/Home";
import Shop from "./pages/Shop/Shop.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import CheckoutPage from "./pages/cart/CheckoutPage.jsx";
import AuthPage from "./pages/Login/AuthPage.jsx";
import MyGaragePage from "./pages/Garage/MyGarage.jsx";
import Wishlist from "./pages/cart/Wishlist.jsx";

function App() {
  return (
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
            <Shop pageTitle="Tires & Wheels" defaultCategory="Tires & Wheels" />
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
        <Route path="/account" element={<AuthPage/>}/>
        <Route path="/My-garage" element={<MyGaragePage/>}/>
        <Route path="/wish-list" element={<Wishlist/>}/>
        
       
        
      </Route>
      
    </Routes>
  );
}

export default App;

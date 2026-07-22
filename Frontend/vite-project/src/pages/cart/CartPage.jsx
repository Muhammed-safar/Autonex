import React, { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  // Sample initial state matching image 2
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Zerex G05 Phosphate Free Antifreeze/Coolant Concentrate 1 GA",
      price: 23.43,
      quantity: 1,
      image: "https://via.placeholder.com/60",
    },
    {
      id: 2,
      name: "Anzo USA - 111630A FORD F-150 15-17 FULL LED PROJECTOR PLANK STYLE HEADLIGHTS",
      price: 117.25,
      quantity: 1,
      image: "https://via.placeholder.com/60",
    },
    {
      id: 3,
      name: "Spyder BMW E90 3-Series 06-08 4DR Headlights - Halogen Model Only - Black PRO",
      price: 186.99,
      quantity: 1,
      image: "https://via.placeholder.com/60",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("flat_rate");

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = shippingMethod === "flat_rate" ? 15.0 : 0.0;
  const total = subtotal + shippingCost;

  // Free shipping progress calculation (threshold set to $500 for example)
  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  // Handlers
  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">Cart</span>
        </nav>

        {cartItems.length === 0 ? (
          /* ================= EMPTY CART VIEW ================= */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 mb-4">
              <ShoppingCart className="w-20 h-20 text-gray-800 stroke-[1.25]" />
            </div>

            <div className="w-full max-w-xl text-center border border-gray-200 py-3 px-4 rounded mb-6 text-sm text-gray-600 bg-white">
              Your cart is currently empty.
            </div>

            <button
              onClick={() => navigate("/shop")} // Customize as needed
              className="bg-[#0066b2] hover:bg-[#005290] text-white text-sm font-medium py-2.5 px-6 rounded-md transition-colors"
            >
              Return to shop
            </button>
          </div>
        ) : (
          /* ================= POPULATED CART VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Cart Items Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free Shipping Alert Banner */}
              <div className="bg-red-50/50 border border-red-200 rounded-md p-4">
                <div className="flex items-center gap-2 text-xs text-red-600 mb-2">
                  <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>
                    Add{" "}
                    <strong className="font-bold">
                      ${amountNeededForFreeShipping.toFixed(2)}
                    </strong>{" "}
                    to cart and get Free Shipping!
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-500 h-1.5 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Table / Cart List */}
              <div className="bg-white rounded-md border border-gray-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-normal">Product</th>
                      <th className="py-3 px-4 font-normal text-right">
                        Price
                      </th>
                      <th className="py-3 px-4 font-normal text-center">
                        Quantity
                      </th>
                      <th className="py-3 px-4 font-normal text-right">
                        Subtotal
                      </th>
                      <th className="py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain border rounded p-1 bg-white"
                            />
                            <span className="font-medium text-gray-800 line-clamp-2 max-w-xs">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-gray-700">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center border border-gray-200 rounded w-20 mx-auto bg-white">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-1 text-gray-500 hover:text-black"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-center font-medium w-8">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-1 text-gray-500 hover:text-black"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Coupon & Clear Cart Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <div className="flex w-full sm:w-auto gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border border-gray-200 rounded px-3 py-2 text-xs w-full sm:w-48 focus:outline-none focus:border-blue-500"
                  />
                  <button className="bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2 px-4 rounded transition-colors whitespace-nowrap">
                    Apply coupon
                  </button>
                </div>
                <button
                  onClick={handleClearCart}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-2 px-4 rounded transition-colors w-full sm:w-auto"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Cart Totals Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-md border border-gray-100 space-y-4">
                <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                  Cart totals
                </h2>

                <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <hr className="border-gray-100" />

                {/* Shipping Selection */}
                <div className="text-xs space-y-2">
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Shipping</span>
                    <div className="text-right space-y-1">
                      <label className="flex items-center gap-2 justify-end cursor-pointer">
                        <span>
                          Flat rate: <strong>$15.00</strong>
                        </span>
                        <input
                          type="radio"
                          name="shipping"
                          value="flat_rate"
                          checked={shippingMethod === "flat_rate"}
                          onChange={() => setShippingMethod("flat_rate")}
                          className="text-blue-600 focus:ring-0"
                        />
                      </label>
                      <label className="flex items-center gap-2 justify-end cursor-pointer text-gray-500">
                        <span>Local pickup</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="pickup"
                          checked={shippingMethod === "pickup"}
                          onChange={() => setShippingMethod("pickup")}
                          className="text-blue-600 focus:ring-0"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-gray-500 pt-1">
                    Shipping to <strong>CA</strong>.
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-blue-500 hover:underline text-[11px]"
                    >
                      Change address
                    </a>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Total */}
                <div className="flex justify-between items-center text-sm font-semibold text-gray-800 pt-1">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded transition-colors mt-4"
                 onClick={()=> navigate("/cart/checkout")}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

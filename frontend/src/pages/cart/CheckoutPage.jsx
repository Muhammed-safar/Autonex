import React, { useState, useEffect } from "react";
import { Tag, Info, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDefaultAddress } from "../../hooks/address/useGetDefaultAddress";
import { useCart } from "../../hooks/cart/useCart";

const CheckoutPage = () => {
  const navigate = useNavigate();

  // Custom Hooks Data
  const { data: defaultAddress } = useGetDefaultAddress();
  const { data: cartData, isLoading: isCartLoading } = useCart();

  const cart = cartData?.data;

  // Coupon toggle state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Kerala",
    PinCod: "",
    country: "India",
    landmark: "",
    addressType: "Home",
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: "",
  });

  // Payment & Shipping method state
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [shippingMethod, setShippingMethod] = useState("flat_rate");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Sync default address into formData when loaded
  useEffect(() => {
    if (!defaultAddress) return;

    setFormData((prev) => ({
      ...prev,
      fullName: defaultAddress.fullName || defaultAddress.firstName || "",
      phone: defaultAddress.phone || "",
      addressLine1:
        defaultAddress.streetAddress1 || defaultAddress.addressLine1 || "",
      addressLine2:
        defaultAddress.streetAddress2 || defaultAddress.addressLine2 || "",
      city: defaultAddress.city || "",
      state: defaultAddress.state || "Kerala",
      PinCod: defaultAddress.zipCode || defaultAddress.PinCod || "",
      country: defaultAddress.country || "India",
      landmark: defaultAddress.landmark || "",
      addressType: defaultAddress.addressType || "Home",
    }));
  }, [defaultAddress]);

  // Dynamic Cart Calculation
  const cartItems =
    cart?.items?.map((item) => ({
      id: item._id,
      name: item.productId?.name || "Product",
      quantity: item.quantity,
      price: item.priceAtAdded || 0,
    })) || [];

  const subtotal = cart?.totalPrice || 0;
  const shippingCost = shippingMethod === "flat_rate" ? 15.0 : 0.0;
  const total = subtotal + shippingCost;

  // Free shipping banner logic
  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    const payload = {
      shippingAddress: formData,
      paymentMethod,
      shippingMethod,
      orderItems: cartItems,
      subtotal,
      shippingCost,
      total,
    };

    console.log("Order submitted:", payload);
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xs text-gray-500">
        Loading checkout details...
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4 stroke-[1.25]" />
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-medium py-2.5 px-6 rounded transition-colors"
        >
          Return to shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">Checkout</span>
        </nav>

        {/* Top Coupon Alert Banner */}
        <div className="bg-gray-100 border-t-2 border-gray-400 p-3 mb-6 rounded-sm text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span>
              Have a coupon?{" "}
              <button
                type="button"
                onClick={() => setShowCouponInput(!showCouponInput)}
                className="text-gray-800 font-semibold hover:underline"
              >
                Click here to enter your code
              </button>
            </span>
          </div>

          {/* Collapsible Coupon Input */}
          {showCouponInput && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-xs w-full focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-1.5 rounded text-xs transition-colors whitespace-nowrap"
              >
                Apply coupon
              </button>
            </div>
          )}
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-red-50/50 border border-red-200 rounded-md p-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-red-600 mb-2">
            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>
              {amountNeededForFreeShipping > 0 ? (
                <>
                  Add{" "}
                  <strong className="font-bold">
                    ${amountNeededForFreeShipping.toFixed(2)}
                  </strong>{" "}
                  to cart and get free shipping!
                </>
              ) : (
                <strong className="font-bold">
                  You qualify for Free Shipping!
                </strong>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-red-500 h-1.5 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Form & Order Summary Layout */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Billing Details (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">
              Billing details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Country / Region <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="India">India</option>
                <option value="United States (US)">United States (US)</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Street address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                placeholder="House number and street name"
                required
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Apartment, suite, unit, etc. (optional)"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Landmark (optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  PIN / ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="PinCod"
                  required
                  value={formData.PinCod}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Account & Shipping Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={formData.createAccount}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Create an account?</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-semibold">
                <input
                  type="checkbox"
                  name="shipToDifferentAddress"
                  checked={formData.shipToDifferentAddress}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Ship to a different address?</span>
              </label>
            </div>

            {/* Order Notes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order notes (optional)
              </label>
              <textarea
                name="orderNotes"
                rows="4"
                placeholder="Notes about your order, e.g. special notes for delivery."
                value={formData.orderNotes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              ></textarea>
            </div>
          </div>

          {/* Your Order Summary (Right Column) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-md border border-gray-100 space-y-4">
              <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
                Your order
              </h2>

              {/* Order Items List */}
              <div className="divide-y divide-gray-100 text-xs">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex justify-between items-start gap-4"
                  >
                    <span className="text-gray-600 leading-snug">
                      {item.name}{" "}
                      <strong className="text-gray-800 font-semibold">
                        × {item.quantity}
                      </strong>
                    </span>
                    <span className="font-semibold text-gray-800 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100" />

              {/* Subtotal */}
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* Shipping Selection */}
              <div className="text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
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
              </div>

              <hr className="border-gray-100" />

              {/* Total */}
              <div className="flex justify-between items-center text-sm font-semibold text-gray-800 pt-1">
                <span>Total</span>
                <span className="text-base">${total.toFixed(2)}</span>
              </div>

              {/* Payment Methods */}
              <div className="pt-4 space-y-3">
                {/* Direct Bank Transfer */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Direct Bank Transfer</span>
                  </label>

                  {paymentMethod === "bank_transfer" && (
                    <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-500 leading-relaxed border border-gray-100">
                      Make your payment directly into our bank account. Please
                      use your Order ID as the payment reference. Your order
                      will not be shipped until the funds have cleared in our
                      account.
                    </div>
                  )}
                </div>

                {/* Check Payments */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="payment"
                      value="check"
                      checked={paymentMethod === "check"}
                      onChange={() => setPaymentMethod("check")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Check Payments</span>
                  </label>
                </div>

                {/* Cash On Delivery */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Cash On Delivery</span>
                  </label>
                </div>
              </div>

              {/* Privacy Policy Notice */}
              <p className="text-[11px] text-gray-500 leading-normal pt-2">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <a href="#" className="text-gray-800 font-semibold underline">
                  privacy policy
                </a>
                .
              </p>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-0"
                  />
                  <span>
                    I have read and agree to the website{" "}
                    <a href="#" className="text-blue-600 underline">
                      terms and conditions
                    </a>{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded transition-colors mt-4"
              >
                Place order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

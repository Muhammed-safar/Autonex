import React, { useState } from 'react';
import { Tag, Info } from 'lucide-react';

const CheckoutPage = () => {
  // Coupon toggle state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'United States (US)',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: 'California',
    zipCode: '',
    phone: '',
    email: '',
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: '',
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [shippingMethod, setShippingMethod] = useState('flat_rate');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Cart summary data
  const orderItems = [
    {
      id: 1,
      name: 'Zerex G05 Phosphate Free Antifreeze Coolant Concentrate 1 GA',
      quantity: 1,
      price: 23.43,
    },
    {
      id: 2,
      name: 'Anzo USA - 111630A FORD F-150 15-17 FULL LED PROJECTOR PLANK STYLE HEADLIGHTS',
      quantity: 1,
      price: 117.25,
    },
    {
      id: 3,
      name: 'Spyder BMW E90 3-Series 06-08 4DR Headlights - Halogen Model Only - Black PRO',
      quantity: 1,
      price: 186.99,
    },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'flat_rate' ? 15.00 : 0.00;
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    console.log('Order submitted:', { formData, paymentMethod, shippingMethod, total });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="#" className="hover:underline">Home</a>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">Checkout</span>
        </nav>

        {/* Top Coupon Alert Banner */}
        <div className="bg-gray-100 border-t-2 border-gray-400 p-3 mb-6 rounded-sm text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span>
              Have a coupon?{' '}
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
              Add <strong className="font-bold">$162.33</strong> to cart and get free shipping!
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-red-500 h-1.5 w-[67.5%] transition-all duration-300" />
          </div>
        </div>

        {/* Main Form & Order Summary Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Billing Details (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Billing details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
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
                name="streetAddress1"
                placeholder="House number and street name"
                required
                value={formData.streetAddress1}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                name="streetAddress2"
                placeholder="Apartment, suite, unit, etc. (optional)"
                value={formData.streetAddress2}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

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
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
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

              {/* Order Items Table */}
              <div className="divide-y divide-gray-100 text-xs">
                {orderItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-start gap-4">
                    <span className="text-gray-600 leading-snug">
                      {item.name} <strong className="text-gray-800 font-semibold">× {item.quantity}</strong>
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
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>

              <hr className="border-gray-100" />

              {/* Shipping Selection */}
              <div className="text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <div className="text-right space-y-1">
                    <label className="flex items-center gap-2 justify-end cursor-pointer">
                      <span>Flat rate: <strong>$15.00</strong></span>
                      <input
                        type="radio"
                        name="shipping"
                        value="flat_rate"
                        checked={shippingMethod === 'flat_rate'}
                        onChange={() => setShippingMethod('flat_rate')}
                        className="text-blue-600 focus:ring-0"
                      />
                    </label>
                    <label className="flex items-center gap-2 justify-end cursor-pointer text-gray-500">
                      <span>Local pickup</span>
                      <input
                        type="radio"
                        name="shipping"
                        value="pickup"
                        checked={shippingMethod === 'pickup'}
                        onChange={() => setShippingMethod('pickup')}
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
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Direct Bank Transfer</span>
                  </label>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="bg-gray-50 p-3 rounded text-[11px] text-gray-500 leading-relaxed border border-gray-100">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
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
                      checked={paymentMethod === 'check'}
                      onChange={() => setPaymentMethod('check')}
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
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Cash On Delivery</span>
                  </label>
                </div>
              </div>

              {/* Privacy Policy Notice */}
              <p className="text-[11px] text-gray-500 leading-normal pt-2">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                <a href="#" className="text-gray-800 font-semibold underline">privacy policy</a>.
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
                    I have read and agree to the website{' '}
                    <a href="#" className="text-blue-600 underline">
                      terms and conditions
                    </a>{' '}
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
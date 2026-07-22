import React from 'react';

const OrderTracking = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Track your order.</h1>
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
        To track your order please enter your Order ID in the box below and press the "Track" button. This was given to you on your receipt and in the confirmation email you should have received.
      </p>

      <form className="w-full max-w-md space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Order ID</label>
          <input
            type="text"
            placeholder="Found in your order confirmation email."
            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Billing email</label>
          <input
            type="email"
            placeholder="Email you used during checkout."
            className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="bg-[#3060a0] hover:bg-[#254b7d] text-white font-medium text-xs sm:text-sm py-2.5 px-10 rounded transition-colors shadow-sm"
          >
            Track
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderTracking;
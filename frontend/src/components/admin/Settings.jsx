import React, { useState } from "react";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
 
];

const Settings = () => {
  const [defaultCurrency, setDefaultCurrency] = useState("INR");

  const handleSave = () => {
    console.log("Default currency:", defaultCurrency);
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store settings.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Currency
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Select the default currency used by your store.
          </p>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Currency
            </label>

            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-[#0066B2] hover:bg-[#005290] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
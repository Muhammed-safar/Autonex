import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import {useSettings} from "../../hooks/settings/useSettings";
import {useUpdateSettings} from "../../hooks/settings/useUpdateSettings";



const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
];

const Settings = () => {
  const { data, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();

  const [defaultCurrency, setDefaultCurrency] = useState("INR");

  useEffect(() => {
    if (data?.data?.defaultCurrency) {
      setDefaultCurrency(data.data.defaultCurrency);
    }
  }, [data]);

  const handleSave = () => {
    updateSettings.mutate({
      defaultCurrency,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-700 text-sm">Store Settings</h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage your store preferences and configuration.
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white">
              <SettingsIcon className="w-4 h-4 text-[#0066B2]" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800">
                General Settings
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configure the default settings used by your store.
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Currency Section */}
          <div className="max-w-xl">
            <div className="mb-4">
              <h5 className="text-xs font-bold text-slate-700">Currency</h5>

              <p className="text-[11px] text-slate-400 mt-1">
                Select the default currency displayed throughout the storefront.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">
                Default Currency
              </label>

              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full sm:w-96 text-xs px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066B2]/20 focus:border-[#0066B2] transition"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="bg-[#0066B2] hover:bg-[#005290] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition"
          >
            <Save className="w-3.5 h-3.5" />
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

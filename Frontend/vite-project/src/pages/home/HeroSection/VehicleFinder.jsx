import React, { useState } from "react";

const VehicleFinder = () => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");

  const makes = ["Toyota", "BMW", "Mercedes-Benz", "Audi", "Ford"];

  return (
    <div className="w-full md:max-w-[300px] lg:max-w-md mx-auto">
      <div className="bg-white text-gray-900 rounded-t-2xl md:rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center tracking-tight">
          Find the Right Parts Faster
        </h2>
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-6 px-2">
          You can find the product you are looking for faster by entering the
          search criteria correctly.
        </p>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
          {/* Step 1: Select Make */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm focus-within:border-blue-500">
            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 text-[11px] font-medium flex items-center justify-center shrink-0 mr-3">
              01
            </span>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-700 outline-none cursor-pointer pr-2"
            >
              <option value="">Select make</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Model */}
          <div
            className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-colors ${
              selectedMake
                ? "bg-white border-gray-200"
                : "bg-[#EEF1F4] border-transparent"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full text-[11px] font-medium flex items-center justify-center shrink-0 mr-3 ${
                selectedMake
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-200/60 text-gray-400"
              }`}
            >
              02
            </span>
            <select
              disabled={!selectedMake}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`w-full bg-transparent text-xs outline-none pr-2 ${
                selectedMake
                  ? "text-gray-800 font-semibold cursor-pointer"
                  : "text-gray-800 font-bold cursor-not-allowed"
              }`}
            >
              <option value="">Select make First</option>
              {selectedMake && <option value="model1">Sample Model</option>}
            </select>
          </div>

          {/* Step 3: Select Year */}
          <div
            className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-colors ${
              selectedModel
                ? "bg-white border-gray-200"
                : "bg-[#EEF1F4] border-transparent"
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-gray-200/60 text-gray-400 text-[11px] font-medium flex items-center justify-center shrink-0 mr-3">
              03
            </span>
            <select
              disabled={!selectedModel}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-400 outline-none disabled:cursor-not-allowed pr-2"
            >
              <option value="">Select Year</option>
            </select>
          </div>

          {/* Step 4: Select Engine */}
          <div
            className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-colors ${
              selectedYear
                ? "bg-white border-gray-200"
                : "bg-[#EEF1F4] border-transparent"
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-gray-200/60 text-gray-400 text-[11px] font-medium flex items-center justify-center shrink-0 mr-3">
              04
            </span>
            <select
              disabled={!selectedYear}
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-400 outline-none disabled:cursor-not-allowed pr-2"
            >
              <option value="">Select Engine</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0066B2] hover:bg-[#005596] text-white font-semibold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] mt-3"
          >
            Find Auto Parts
          </button>
        </form>

        {/* Footer info text */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed mt-6 px-1">
          Having the right automotive parts and car accessories will help you
          to boost your travel comfort and go on the long-distance journey
          comfortably that you have been planning.
        </p>
      </div>
    </div>
  );
};

export default VehicleFinder;
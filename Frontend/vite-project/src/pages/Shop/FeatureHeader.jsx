import React from 'react';

import { Affordable, Medal, WideVeriety } from '../../assets/icons.js';

export default function FeatureHeader() {
  return (
    <div className="w-full border-y border-slate-100 bg-white py-6 my-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        
        {/* Item 1: Original Products */}
        <div className="flex items-center gap-4 pb-4 md:pb-0 md:pr-6 justify-start">
          <div className="flex-shrink-0 text-blue-600">
            {/* Custom styled icon wrapper to match the target asset feel */}
            <div className="relative p-1">
            <Medal   size={36} className="stroke-[1.25]" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 tracking-wide">Original Products</h4>
            <p className="text-xs text-slate-400 font-normal mt-0.5">Vestibulum ante ipsum primis in faucibus.</p>
          </div>
        </div>

        {/* Item 2: Affordable Rates */}
        <div className="flex items-center gap-4 py-4 md:py-0 md:px-8 justify-start">
          <div className="flex-shrink-0 text-blue-600">
            <div className="relative p-1">
              <Affordable size={36} className="stroke-[1.25]" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 tracking-wide">Affordable Rates</h4>
            <p className="text-xs text-slate-400 font-normal mt-0.5">Vestibulum ante ipsum primis in faucibus.</p>
          </div>
        </div>

        {/* Item 3: Wide variety */}
        <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8 justify-start">
          <div className="flex-shrink-0 text-blue-600">
            <div className="relative p-1">
              <WideVeriety size={36} className="stroke-[1.25]" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 tracking-wide">Wide variety</h4>
            <p className="text-xs text-slate-400 font-normal mt-0.5">Vestibulum ante ipsum primis in faucibus.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
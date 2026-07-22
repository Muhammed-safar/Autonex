import React from "react";

const DiscountBanner = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-2">
      <div className="relative overflow-hidden w-full min-h-[108px] rounded-xl bg-[#FFF0F3] border border-[#FFE3E8] flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-5 sm:py-0 gap-4 sm:gap-6">
        
        {/* Subtle Background Percentage Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none select-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='40' font-family='sans-serif' font-size='32' font-weight='bold' fill='%202206' opacity='0.4'%3E%25%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Left Section: Big Discount Percentage + Heading */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
          <span className="text-4xl lg:text-5xl font-black text-[#F43F5E] tracking-tight shrink-0">
            -35%
          </span>
          <div className="flex flex-col">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#F43F5E] leading-snug">
              Super discount for your first purchase
            </h3>
            <p className="text-[11px] sm:text-xs text-[#F43F5E]/80 font-medium mt-0.5">
              Use discount code in checkout page..
            </p>
          </div>
        </div>

        {/* Right Section: Dashed Coupon Code Badge */}
        <div className="relative z-10 shrink-0 w-full sm:w-auto flex justify-center sm:block">
          <div className="border-2 border-dashed border-[#F43F5E] bg-white/60 rounded-lg px-6 sm:px-4 py-2 inline-flex items-center justify-center transition-colors hover:bg-white/80 cursor-pointer">
            <span className="text-xs sm:text-sm font-extrabold text-[#F43F5E] tracking-wider select-all uppercase">
              HELLO4587J
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiscountBanner;
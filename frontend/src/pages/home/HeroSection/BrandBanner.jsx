import React from "react";
import { useBrands } from "../../../hooks/brands/useBrands.js"; 

const BrandBanner = () => {

  const { data: brandsData, isLoading, isError } = useBrands({ page: 1, search: "" });

  const rawBrands = Array.isArray(brandsData?.data)
    ? brandsData.data
    : brandsData?.brands || brandsData || [];

  const fallbackBrands = [
    { _id: "1", name: "ISUZU" },
    { _id: "2", name: "PORSCHE" },
    { _id: "3", name: "DACIA" },
    { _id: "4", name: "PEUGEOT" },
    { _id: "5", name: "CASTROL" },
    { _id: "6", name: "ZEREX" },
  ];

  const displayBrands = rawBrands.length > 0 ? rawBrands : fallbackBrands;

  if (isLoading) {
    return (
      <div className="border-b border-slate-100 bg-white py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-24 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) return null;

  return (
    <div className="border-b border-slate-100 bg-white py-6 overflow-hidden select-none">
      {/* Container with CSS animation keyframe defined inline */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Outer viewport overflow hidden */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Soft edge gradient fades for polished look */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Continuous Loop Container (Renders original + duplicated list to prevent gaps) */}
        <div className="animate-marquee flex items-center gap-24 sm:gap-40 opacity-75 hover:opacity-100 transition-opacity">
          {[...displayBrands, ...displayBrands].map((brand, idx) => {
            const brandName = brand.name || "BRAND";
            const brandLogo = brand.logo?.url || brand.image || brand.logo;

            return (
              <div
                key={`${brand._id || idx}-${idx}`}
                className="flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
              >
                {brandLogo && typeof brandLogo === "string" ? (
                  <img
                    src={brandLogo}
                    alt={brandName}
                    className="h-8 sm:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                  />
                ) : (
                  <span className="font-extrabold text-sm md:text-xl tracking-widest text-slate-700 uppercase whitespace-nowrap">
                    {brandName}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandBanner;
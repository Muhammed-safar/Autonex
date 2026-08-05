import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div>
      <section className="relative bg-[#1A232E] text-white overflow-hidden py-12 lg:py-16">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat  pointer-events-none"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785214232/banner-07.jpg_iihmve.jpg')`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Banner Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                {t("hero.tagline")}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                {t("hero.title1")}
                <br />
                {t("hero.title2")}
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                {t("hero.description")}
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-sm px-6 py-3 rounded-md transition-all shadow-md active:scale-95"
              >
                {t("hero.button")}
              </button>

              <p className="text-xs text-gray-400 pt-2">
                {t("hero.campaign")}{" "}
                <span className="font-medium text-gray-200">
                  08 day, 09 hours, 31 min, 52 sec.
                </span>
              </p>
            </div>

            {/* Right Column: Vehicle Part Finder Form */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;

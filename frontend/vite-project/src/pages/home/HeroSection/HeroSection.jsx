import React, { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import HeroBanner from "./HeroBanner";
import VehicleFinder from "./VehicleFinder";
import BrandBanner from "./BrandBanner";
import FeaturedBanner from "./FeaturedBanner";
import DealList from "./DealList";
import DiscountBanner from "../offersection/DiscountBanner";

const HeroSection = () => {
  return (
    <>
      {/* HERO */}
     <section className=" lg:relative  bg-[#1A232E] lg:h-[500px]">

    <HeroBanner />

    <div className="md:absolute right-10 lg:right-60 top-16 lg:top-24 z-20 ">
        <VehicleFinder />
    </div>

</section>

      <BrandBanner />

      <section className="max-w-7xl mx-auto px-4 py-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <FeaturedBanner />
          </div>

          <div className="lg:col-span-4">
            <DealList />
          </div>

          
        </div>
      </section>
    </>
  );
};

export default HeroSection
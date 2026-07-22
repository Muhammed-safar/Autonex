import React from "react";
import HeroSection from "./HeroSection/HeroSection";
import DiscountBanner from "./offersection/DiscountBanner";
import BestSeller from "./offersection/BestSeller";
import FeatureBanners from "./offersection/FeatureBanners";
import FeaturedProducts from "./offersection/FeaturedProducts";
import CategorySection from "./offersection/CategorySection";
import ContactSection from "./offersection/ContactSection";
import LatestNews from "./offersection/LatestNews";

const Home = () => {
  return (
    <>
      <HeroSection />
      <DiscountBanner />
      <BestSeller />
      <FeatureBanners />
      <CategorySection />
      <FeaturedProducts />
      <DiscountBanner />
      <ContactSection />
      <LatestNews />
    </>
  );
};

export default Home;

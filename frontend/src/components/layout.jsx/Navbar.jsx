import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  Repeat,
  ShoppingCart,
  Menu,
  ChevronDown,
  Car,
  X,
  Warehouse, // Placeholder if custom Garage icon is not available
} from "lucide-react";
import { Garage } from "../../assets/icon.js";
import Logo from "../../assets/icons/AutonexLogo.png";
import WhiteLogo from "../../assets/icons/whiteLogo.png";
import { useCart } from "../../hooks/cart/useCart.js";
import { useWishlist } from "../../hooks/wishlist/useWishlist.js";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../common/LanguageSelector.jsx";
import CurrencySelector from "../common/CurrencySelector.jsx";

const navItems = [
  {
    name: "Home",
    path: "/",
    hasDropdown: true,
  },
  {
    name: "Shop",
    path: "/shop",
    hasDropdown: true,
  },
  {
    name: "Tyres & Wheels",
    path: "/shop?category=Tyre,Wheel",
  },
  {
    name: "Headlights & Lighting",
    path: "/shop?category=Tail Lights,Head Lights",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const navTranslations = {
  Home: "navbar.home",
  Shop: "navbar.shop",
  "Tyres & Wheels": "navbar.tyres",
  "Headlights & Lighting": "navbar.headlights",
  Blog: "navbar.blog",
  Contact: "navbar.contact",
};
const Navbar = ({ onOpenCategory }) => {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const activeCategory = new URLSearchParams(location.search).get("category");

  const cartCount =
    cart?.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <header className="w-full bg-white font-sans">
      {/* ============ DESKTOP / TABLET ============ */}

      {/* 1. Top Utility Bar */}
      <div className="hidden md:block bg-[#0067B2] border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] text-white h-8">
          <div className="flex items-center gap-5">
            <Link
              to="/contact"
              className="hover:text-gray-900 transition-colors"
            >
              {t("navbar.about")}
            </Link>
            <Link to="/faq" className="hover:text-gray-900 transition-colors">
              {t("navbar.faq")}
            </Link>
            <Link
              to="/orders/track"
              className="hover:text-gray-900 transition-colors"
            >
              {t("navbar.orderTracking")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="hidden md:block bg-[#0067B2]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/#"
            className="flex h-10 w-32 overflow-hidden items-center gap-2 shrink-0"
          >
            <img
              src={WhiteLogo}
              alt="Autonex"
              className="h-30 w-auto object-cover"
            />
          </Link>

          {/* Add Vehicle / My Garage */}
          <button
            onClick={() => navigate("/MyGaragePage")}
            className="hidden lg:flex items-center gap-2.5 shrink-0 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#1977BB] border border-[#288ED8] flex items-center justify-center text-white">
              <Warehouse size={18} />
            </div>
            <div className="text-xs">
              <span className="text-white block text-[10px] leading-tight">
                {t("garage.addVehicle")}
              </span>
              <span className="font-bold text-white text-xs">{t("garage.myGarage")}</span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-5 pr-11 text-xs text-gray-700 outline-none focus:border-blue-500 transition-colors shadow-sm"
            />
            <button
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Account */}
            <NavLink to="/account">
              {({ isActive }) => (
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-[#288ED8] text-white"
                        : "bg-[#1977BB] border border-[#288ED8] text-white hover:bg-gray-300/60"
                    }`}
                  >
                    <User size={18} />
                  </div>

                  <div className="text-left hidden xl:block">
                    <span
                      className={`block text-[10px] leading-tight ${
                        isActive ? "text-blue-500" : "text-white"
                      }`}
                    >
                      {t("account.signIn")}
                    </span>

                    <span
                      className={`font-bold ${
                        isActive ? "text-blue-600" : "text-white"
                      }`}
                    >
                      {t("account.account")}
                    </span>
                  </div>
                </div>
              )}
            </NavLink>

            {/* Wishlist */}
            <NavLink
              to="/wish-list"
              className={({ isActive }) =>
                `relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-[#1977BB] border border-[#288ED8] text-white hover:bg-gray-300/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Heart size={18} />
                  {!isActive && (
                    <span className="absolute -top-1 -right-1 bg-[#EAB308] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>

            {/* Compare */}
            {/* Compare */}
            <NavLink
              to="/compare" // Change this to your route
              className={({ isActive }) =>
                `relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-[#1977BB] border border-[#288ED8] text-white hover:bg-gray-300/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Repeat size={18} />
                </>
              )}
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-[#1977BB] border border-[#288ED8] text-white hover:bg-gray-300/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShoppingCart size={18} />

                  {!isActive && (
                    <span className="absolute -top-1 -right-1 bg-[#EAB308] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* 3. Navigation Links Row */}
      <div className="hidden md:block bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between text-xs font-semibold text-gray-800">
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenCategory}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Menu size={16} />
              <span>{t("navbar.allCategories")}</span>
            </button>

            <span className="text-gray-300 font-normal">|</span>

            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                let isActive = false;

                if (item.path === "/") {
                  isActive = location.pathname === "/";
                } else if (item.path === "/shop") {
                  // Shop should only be active when no category is selected
                  isActive = location.pathname === "/shop" && !activeCategory;
                } else if (item.path.startsWith("/shop?")) {
                  // Compare the complete query string
                  isActive =
                    location.pathname === "/shop" &&
                    location.search === item.path.replace("/shop", "");
                } else {
                  isActive = location.pathname === item.path;
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1 transition-colors ${
                      isActive ? "text-blue-600" : "hover:text-blue-600"
                    }`}
                  >
                    {t(navTranslations[item.name])}
                    {item.hasDropdown && <ChevronDown size={11} />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900">{t("navbar.bestSeller")}</span>
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {t("navbar.sale")}
            </span>
          </div>
        </div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="md:hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0067B2]">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1977BB] border border-[#288ED8] text-white"
          >
            <Menu size={18} />
          </button>

          <Link
            to="/"
            className="flex h-10 w-32 overflow-hidden items-center gap-2 shrink-0"
          >
            <img
              src={WhiteLogo}
              alt="Autonex"
              className="h-30 w-auto object-cover"
            />
          </Link>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-[#1977BB] border border-[#288ED8] text-white"
                  : "bg-[#1977BB] border border-[#288ED8] text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ShoppingCart size={18} />

                {!isActive && (
                  <span className="absolute -top-1 -right-1 bg-[#EAB308] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Quick action bar */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-y border-gray-200 text-xs font-semibold text-[#0067B2] bg-white">
          <button
            onClick={() => navigate("/MyGaragePage")}
            className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50"
          >
            <Warehouse size={15} />
            {t("garage.myGarage")}
          </button>
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50"
          >
            <Search size={15} />
            {t("search.product")}
          </button>
        </div>

        {/* Search Collapsible */}
        {mobileSearchOpen && (
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder={t("search.placeholder")}
                className="w-full bg-white border border-gray-300 rounded-full py-2 pl-4 pr-10 text-xs outline-none focus:border-blue-500"
              />
              <button
                aria-label="Search Submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link
                to="/"
                className="flex h-10 w-32 overflow-hidden items-center gap-2 shrink-0"
              >
                <img
                  src={Logo}
                  alt="Autonex"
                  className="h-30 w-auto object-cover"
                />
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-[#0067B2] hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 text-xs text-gray-700">
              <NavLink
                to="/account"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 py-2 font-medium"
              >
                <User size={16} /> {t("account.signIn")} / {t("account.account")}
              </NavLink>
              <NavLink
                to="/wish-list"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 py-2 font-medium"
              >
                <Heart size={16} /> {t("wishlist")} ({wishlistCount})
              </NavLink>

              <div className="border-t border-gray-100 my-2" />

              <Link
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="py-2 font-bold text-gray-900"
              >
                {t("navbar.home")}
              </Link>
              <Link
                to="/shop"
                onClick={() => setDrawerOpen(false)}
                className="py-2 font-bold text-gray-900"
              >
                {t("navbar.shop")}
              </Link>
              <Link
                to="/category/tires-wheels"
                onClick={() => setDrawerOpen(false)}
                className="py-2"
              >
                {t("navbar.tiresWheels")}
              </Link>
              <Link
                to="/category/headlights-lighting"
                onClick={() => setDrawerOpen(false)}
                className="py-2"
              >
                {t("navbar.headlightsLighting")}
              </Link>
              <Link
                to="/blog"
                onClick={() => setDrawerOpen(false)}
                className="py-2"
              >
                {t("navbar.blog")}
              </Link>
              <Link
                to="/contact"
                onClick={() => setDrawerOpen(false)}
                className="py-2"
              >
                {t("navbar.contact")}
              </Link>

              <div className="border-t border-gray-100 my-2" />

              <Link
                to="/about"
                onClick={() => setDrawerOpen(false)}
                className="py-2 text-gray-500"
              >
                {t("navbar.about")}
              </Link>
              <Link
                to="/faq"
                onClick={() => setDrawerOpen(false)}
                className="py-2 text-gray-500"
              >
                {t("navbar.faq")}
              </Link>
              <Link
                to="/orders/track"
                onClick={() => setDrawerOpen(false)}
                className="py-2 text-gray-500"
              >
                {t("navbar.orderTracking")}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

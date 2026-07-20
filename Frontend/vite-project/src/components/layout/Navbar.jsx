import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Garage } from "../../assets/icons.js?react";
import LogoImg from "../../assets/images/logo.png";
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
} from "lucide-react";

const Navbar = () => {
  const [wishlistCount] = useState(0);
  const [cartCount] = useState(3);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-100 font-sans">
      {/* ============ DESKTOP / TABLET ============ */}

      {/* Top utility bar */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-100">
        <div className=" px-4 flex items-center justify-between text-xs text-gray-500 h-9">
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-800">
              About Us
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/faq" className="hover:text-gray-800">
              FAQ
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/orders/track" className="hover:text-gray-800">
              Order Tracking
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-gray-800">
              English <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 hover:text-gray-800">
              USD <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main row: logo, garage, search, account/wishlist/compare/cart */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 h-20 bg-gray-50 items-center gap-6">
        <img src={LogoImg} alt="Logo" className="w-32 h-34" />

        <button className="hidden lg:flex items-center gap-2 text-sm text-gray-700 shrink-0">
          <div className="border border-gray-300 rounded p-1.5">
            <Garage className="w-4 h-4" />
          </div>
          <span className="text-left leading-tight">
            Add Vehicle
            <br />
            <span className="font-semibold">My Garage</span>
          </span>
        </button>

        <div className="flex-1 flex items-center border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search popular products..."
            className="flex-1 px-4 py-2.5 text-sm outline-none"
          />
          <button className="px-4 py-2.5  text-white hover:bg-blue-700 transition-colors">
            <Search size={18}  className="text-gray-500"/>
          </button>
        </div>

        <div className="flex items-center gap-4 shrink-0">
            {/* Account */}
            <Link to="/account" className="flex items-center gap-2 text-xs">
              <div className="w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-700">
                <User size={18} />
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-gray-400 block text-[10px] leading-tight">
                  Sign In
                </span>
                <span className="font-bold text-gray-800">Account</span>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-700 hover:bg-gray-300/60 transition-colors"
            >
              <Heart size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            </Link>

            {/* Compare */}
            <button className="w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-700 hover:bg-gray-300/60 transition-colors">
              <Repeat size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-700 hover:bg-gray-300/60 transition-colors"
            >
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
      </div>

      {/* Category / nav row */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 font-medium text-gray-800">
              <Menu size={18} />
              All Categories
            </button>
            <span className="text-gray-300">|</span>
            <nav className="flex items-center gap-6 text-gray-700">
              <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
                Home <ChevronDown size={12} />
              </Link>
              <Link to="/shop" className="flex items-center gap-1 hover:text-blue-600">
                Shop <ChevronDown size={12} />
              </Link>
              <Link to="/category/tires-wheels" className="hover:text-blue-600">
                Tires &amp; Wheels
              </Link>
              <Link to="/category/headlights-lighting" className="hover:text-blue-600">
                Headlights &amp; Lighting
              </Link>
              <Link to="/blog" className="hover:text-blue-600">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            Best Seller
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
              Sale
            </span>
          </div>
        </div>
      </div>

      {/* ============ MOBILE ============ */}

      <div className="md:hidden">
        {/* Top row: hamburger, logo, cart */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700"
          >
            <Menu size={18} />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-full p-1">
              <Car size={16} />
            </div>
            <span className="text-lg font-bold tracking-wide text-gray-900">
              AUTONEX
            </span>
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700"
          >
            <ShoppingCart size={18} />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>

        {/* Split row: My Garage | Search Product */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-t border-b border-gray-100 text-sm font-medium text-gray-700">
          <button className="flex items-center justify-center gap-2 py-2.5">
           <Garage className="w-4 h-4" />
            My Garage
          </button>
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 py-2.5"
          >
            <Search size={16} />
            Search Product
          </button>
        </div>

        {/* Expandable search input */}
        {mobileSearchOpen && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                autoFocus
                placeholder="Search popular products..."
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
              <button className="px-3 py-2 bg-blue-600 text-white">
                <Search size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer menu */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="bg-blue-600 text-white rounded-full p-1">
                  <Car size={16} />
                </div>
                <span className="text-lg font-bold text-gray-900">AUTONEX</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 text-sm text-gray-700">
              <Link to="/account" className="flex items-center gap-3 py-2.5">
                <User size={18} /> Sign In / Account
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 py-2.5">
                <Heart size={18} /> Wishlist ({wishlistCount})
              </Link>
              <button className="flex items-center gap-3 py-2.5">
                <Repeat size={18} /> Compare
              </button>

              <div className="border-t border-gray-100 my-2" />

              <Link to="/" className="py-2.5 font-medium">
                Home
              </Link>
              <Link to="/shop" className="py-2.5 font-medium">
                Shop
              </Link>
              <Link to="/category/tires-wheels" className="py-2.5">
                Tires &amp; Wheels
              </Link>
              <Link to="/category/headlights-lighting" className="py-2.5">
                Headlights &amp; Lighting
              </Link>
              <Link to="/blog" className="py-2.5">
                Blog
              </Link>
              <Link to="/contact" className="py-2.5">
                Contact
              </Link>

              <div className="border-t border-gray-100 my-2" />

              <Link to="/about" className="py-2.5 text-gray-500">
                About Us
              </Link>
              <Link to="/faq" className="py-2.5 text-gray-500">
                FAQ
              </Link>
              <Link to="/orders/track" className="py-2.5 text-gray-500">
                Order Tracking
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
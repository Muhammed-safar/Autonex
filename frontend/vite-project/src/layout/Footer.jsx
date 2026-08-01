import { Link } from "react-router-dom";

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Playstore, Appstore, Mastercard, Visa, Paypal, Skrill } from "../assets/icons.js";
import WhiteLogo from "../assets/images/logowhite.png";
import React from "react";




const Footer = () => {
  return (
    <footer className="font-sans text-gray-300">
      {/* 1. Newsletter Bar */}
      <div className="bg-[#EFF4F7] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Text Info */}
          <div className="text-center lg:text-left max-w-xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Join the AUTONEX VIP Club!
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Whether you&apos;re welcoming new contacts or sharing the latest news,
              you can make your business look good in just a few clicks.
            </p>
          </div>

          {/* Form */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row w-full sm:w-auto bg-white border border-gray-300 rounded-md p-1 gap-1"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-2.5 text-sm bg-transparent outline-none w-full sm:w-72 text-gray-800"
                required
              />
              <button
                type="submit"
                className="bg-[#0067B2] hover:bg-[#015c9d] text-white text-sm font-medium px-6 py-2.5 rounded transition-all active:scale-95 shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-gray-400 mt-2 text-center lg:text-left max-w-sm">
              By subscribing you agree to our{" "}
              <Link
                to="/terms"
                className="underline hover:text-gray-600 font-semibold"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline hover:text-gray-600 font-semibold"
              >
                Privacy &amp; Cookies Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Dark Navigation Links */}
      <div className="bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base mb-2 border-b border-gray-800 pb-2 sm:border-none sm:pb-0">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="font-medium text-gray-200">Phone Number</p>
                <p className="text-gray-400 mt-0.5">+1 (800) 1234 5678 90</p>
              </div>
              <div>
                <p className="font-medium text-gray-200">E-Mail</p>
                <p className="text-gray-400 mt-0.5">info@example.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-200">Address</p>
                <p className="text-gray-400 mt-0.5 leading-relaxed">
                  2972 Westheimer Rd. Santa Ana, Illinois 85486
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-200">Help Guide</p>
                <p className="text-gray-400 mt-0.5">
                  Seek expert help for inquiries and concerns.
                </p>
              </div>
            </div>
          </div>

          {/* Let Us Help You */}
          <div>
            <h4 className="text-white font-semibold text-base mb-2 border-b border-gray-800 pb-2 sm:border-none sm:pb-0">
              Let Us Help You
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  Returns &amp; Replacements
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Rates &amp; Policies
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund and Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookie-settings" className="hover:text-white transition-colors">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-base mb-2 border-b border-gray-800 pb-2 sm:border-none sm:pb-0">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/sell" className="hover:text-white transition-colors">
                  Sell on AUTONEX
                </Link>
              </li>
              <li>
                <Link to="/sell/services" className="hover:text-white transition-colors">
                  Sell Your Services on AUTONEX
                </Link>
              </li>
              <li>
                <Link to="/sell/business" className="hover:text-white transition-colors">
                  Sell on AUTONEX Business
                </Link>
              </li>
              <li>
                <Link to="/sell/apps" className="hover:text-white transition-colors">
                  Sell Your Apps on AUTONEX
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="hover:text-white transition-colors">
                  Become an Affiliate
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-white transition-colors">
                  Advertise Your Products
                </Link>
              </li>
              <li>
                <Link to="/sell/publish" className="hover:text-white transition-colors">
                  Sell &amp; Publish with Us
                </Link>
              </li>
              <li>
                <Link to="/vendor" className="hover:text-white transition-colors">
                  Become an AUTONEX Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Get to Know Us */}
          <div>
            <h4 className="text-white font-semibold text-base mb-2 border-b border-gray-800 pb-2 sm:border-none sm:pb-0">
              Get to Know Us
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers for AUTONEX
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About AUTONEX
                </Link>
              </li>
              <li>
                <Link to="/investor-relations" className="hover:text-white transition-colors">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link to="/devices" className="hover:text-white transition-colors">
                  AUTONEX Devices
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/social-responsibility" className="hover:text-white transition-colors">
                  Social Responsibility
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-white transition-colors">
                  Store Locations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Logo / Social / App Downloads Row */}
        <div className="border-t border-gray-800/80">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={WhiteLogo}
                alt="Autonex Logo"
                className="h-20 md:h-30 object-contain"
              />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm text-gray-400">Follow Us:</span>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FaYoutube size={18} />
              </a>
            </div>

            {/* App Store Badges */}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm text-gray-400 hidden lg:inline">
                Download App
              </span>
              <div className="flex items-center gap-2">
                <Playstore className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
                <Appstore className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Copyright & Payment Badges */}
        <div className="border-t border-gray-800/80">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center sm:text-left">
            <p>Copyright 2026 © AUTONEX Theme. All rights reserved.</p>
            <div className="flex items-center justify-center gap-3">
              <Mastercard className="h-4 w-auto text-gray-400" />
              <Visa className="h-4 w-auto text-gray-400" />
              <Paypal className="h-4 w-auto text-gray-400" />
              <Skrill className="h-4 w-auto text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
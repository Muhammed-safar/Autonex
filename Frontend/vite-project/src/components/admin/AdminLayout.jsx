import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Logo from "../../assets//images/logo.png";
import { Search, Warehouse, Menu, X } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* ============ TOP NAVIGATION HEADER ============ */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shrink-0">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">
            
            {/* Left Section: Mobile Toggle & Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                aria-label="Toggle Navigation"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link
                to="/#"
                className="flex h-10 w-32 overflow-hidden shrink-0 items-center gap-2"
              >
                <img
                  src={Logo}
                  alt="Autonex"
                  className="h-30 w-auto object-cover"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 hidden md:block  max-w-xl relative">
              <input
                type="text"
                placeholder="Search inventory, orders..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full py-1.5 sm:py-2 pl-3 sm:pl-4 pr-9 sm:pr-10 text-xs text-slate-700 outline-none focus:border-[#0066B2] focus:bg-white transition-all shadow-sm"
              />
              <button
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <Search size={15} />
              </button>
            </div>

            {/* User Action Items */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* My Garage Button */}
              <div className="hidden sm:flex items-center gap-2.5 bg-[#F1F5F9] px-3 py-1.5 rounded-full border border-slate-200/60">
                <div className="w-7 h-7 rounded-full bg-[#0066B2] text-white flex items-center justify-center shrink-0">
                  <Warehouse size={14} />
                </div>
                <div className="text-left text-xs">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold leading-none">
                    Vehicle
                  </span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    My Garage
                  </span>
                </div>
              </div>

              {/* Account Pill */}
              <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-200 shrink-0">
                  A
                </div>
                <div className="text-left hidden lg:block text-xs">
                  <span className="block text-[10px] text-slate-400 leading-none mb-0.5">
                    Signed in as
                  </span>
                  <span className="font-bold text-slate-800">Admin User</span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* ============ MAIN CONTENT AREA & SIDEBAR ============ */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* View Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
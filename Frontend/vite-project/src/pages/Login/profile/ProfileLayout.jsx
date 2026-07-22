import React, { useState } from 'react';
import { User, MapPin, Package, Search, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import PersonalInformation from './PersonalInformation.jsx';
import ManageAddress from './ManageAddress.jsx';
import Orders from './Orders.jsx';
import OrderTracking from './OrderTracking.jsx';

const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'Personal Information', icon: User },
    { id: 'address', label: 'Manage Address', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'tracking', label: 'Order Tracking', icon: Search },
  ];

  const activeItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];
  const ActiveIcon = activeItem.icon;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInformation />;
      case 'address':
        return <ManageAddress />;
      case 'orders':
        return <Orders setActiveTab={setActiveTab} />;
      case 'tracking':
        return <OrderTracking />;
      default:
        return <PersonalInformation />;
    }
  };

  const handleTabSelect = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[75vh] ">
        
        {/* Mobile Navigation Header */}
        <div className="md:hidden border-b border-gray-100 p-4 bg-white">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#0067B2]/10 text-[#0067B2]">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{activeItem.label}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#0067B2]/10 text-[#0067B2] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/80 transition-colors mt-2">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-72 border-r border-gray-100 bg-white p-6 shrink-0">
          <div className="flex items-center space-x-3.5 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#0067B2]/10 text-[#0067B2] flex items-center justify-center font-bold text-base shadow-sm">
              JD
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-gray-900 truncate">John Doe</h3>
              <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0067B2]/10 text-[#0067B2] font-semibold shadow-xs'
                      : 'text-gray-600 hover:bg-[#0067B2]/5 hover:text-[#0067B2]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gray-100">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-6 md:p-10 bg-white">
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default ProfileLayout;
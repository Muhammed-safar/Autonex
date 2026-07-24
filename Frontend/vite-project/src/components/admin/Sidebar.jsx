import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Users,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { id: "products", label: "Products", path: "/admin/products", icon: Package },
    { id: "categories", label: "Categories", path: "/admin/categories", icon: FolderTree },
    { id: "brands", label: "Brands", path: "/admin/brands", icon: Tag },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { id: "users", label: "Users", path: "/admin/users", icon: Users },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 z-40 h-full lg:h-auto w-64 bg-[#F8FAFC] 
        text-slate-700 flex flex-col justify-between p-4 border-r border-slate-200/80 
        font-sans shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div>
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-12 lg:mt-0">
          Management
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0066B2] text-white shadow-md shadow-blue-600/25 font-bold"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={isActive ? "text-white" : "text-slate-500"}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="opacity-80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Links & Logout */}
      <div className="pt-4 border-t border-slate-200/80 space-y-1">
        <NavLink
          to="/admin/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive
                ? "text-[#0066B2] bg-blue-50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            }`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
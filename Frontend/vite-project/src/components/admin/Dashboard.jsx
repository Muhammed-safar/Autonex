import React from "react";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-full bg-[#F8FAFC] font-sans antialiased text-slate-800">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          
          {/* 1. HERO BANNER */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-stretch min-h-[320px] sm:min-h-[380px]">
            {/* Background Gradient & Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10 pointer-events-none" />
            <div
              className="absolute inset-0 opacity-80 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000')`,
              }}
            />

            {/* Hero Text Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[#0066B2] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 inline-block">
                  PARTS THAT PERFORM
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-md">
                  Every Part Counts. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Choose the Best.
                  </span>
                </h1>

                <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
                  From engine to exhaust, manage top-tier automotive inventory
                  that keeps sales running smoothly.
                </p>
              </div>

              <div className="pt-2 flex items-center">
                <button className="w-full sm:w-auto bg-[#0066B2] hover:bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                  <span>View All Inventory</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. OVERVIEW METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: "Total Revenue",
                value: "$128,430.00",
                change: "+14.2%",
                icon: TrendingUp,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                title: "Total Orders",
                value: "1,248",
                change: "+8.1%",
                icon: ShoppingBag,
                color: "text-blue-600 bg-blue-50",
              },
              {
                title: "Active Products",
                value: "3,892",
                change: "+4.5%",
                icon: Package,
                color: "text-purple-600 bg-purple-50",
              },
              {
                title: "Registered Users",
                value: "894",
                change: "+12.0%",
                icon: Users,
                color: "text-amber-600 bg-amber-50",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                      {stat.title}
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {stat.value}
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                      {stat.change} vs last month
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}
                  >
                    <Icon size={20} className="sm:hidden" />
                    <Icon size={22} className="hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. RECENT ORDERS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Recent Orders
                </h3>
                <p className="text-xs text-slate-400">
                  Manage real-time customer transactions
                </p>
              </div>
              <button className="text-xs font-bold text-[#0066B2] hover:underline text-left sm:text-right">
                View All Orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4 sm:px-5">Order ID</th>
                    <th className="py-3 px-4 sm:px-5">Customer</th>
                    <th className="py-3 px-4 sm:px-5">Part Category</th>
                    <th className="py-3 px-4 sm:px-5">Amount</th>
                    <th className="py-3 px-4 sm:px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[
                    {
                      id: "#ORD-9482",
                      customer: "Marcus Vance",
                      category: "Tires & Wheels",
                      amount: "$420.00",
                      status: "Completed",
                    },
                    {
                      id: "#ORD-9481",
                      customer: "Sarah Jenkins",
                      category: "Headlights & Lighting",
                      amount: "$185.50",
                      status: "Processing",
                    },
                    {
                      id: "#ORD-9480",
                      customer: "David Miller",
                      category: "Brake Systems",
                      amount: "$310.00",
                      status: "Completed",
                    },
                    {
                      id: "#ORD-9479",
                      customer: "Elena Rostova",
                      category: "Engine Parts",
                      amount: "$890.00",
                      status: "Pending",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-5 font-bold text-[#0066B2]">
                        {row.id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-slate-900 whitespace-nowrap">
                        {row.customer}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-slate-500 whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                        {row.amount}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            row.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : row.status === "Processing"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
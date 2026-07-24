import React from "react";
import { Eye } from "lucide-react";

export default function Orders() {
  const ordersList = [
    { id: "#ORD-9482", customer: "John Doe", date: "Jul 22, 2026", total: "$306.24", status: "Processing" },
    { id: "#ORD-9481", customer: "Sarah Smith", date: "Jul 21, 2026", total: "$117.25", status: "Completed" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">Order ID</th>
                <th className="p-3.5 sm:p-4 text-left">Customer</th>
                <th className="p-3.5 sm:p-4 text-left">Date</th>
                <th className="p-3.5 sm:p-4 text-left">Total</th>
                <th className="p-3.5 sm:p-4 text-left">Status</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ordersList.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 sm:p-4 text-[#0066B2] font-bold whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-800 whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-slate-800 whitespace-nowrap">
                    {order.total}
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      order.status === "Completed" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    <button 
                      aria-label="View order details" 
                      className="p-1.5 text-slate-400 hover:text-[#0066B2] hover:bg-slate-100 rounded-md transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
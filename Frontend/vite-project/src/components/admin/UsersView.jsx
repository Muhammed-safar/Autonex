import React from "react";
import { UserCheck, Shield } from "lucide-react";

export default function UsersView() {
  const usersList = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
    { id: 2, name: "Admin Person", email: "admin@autoparts.com", role: "Administrator", status: "Active" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[520px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">User</th>
                <th className="p-3.5 sm:p-4 text-left">Email</th>
                <th className="p-3.5 sm:p-4 text-left">Role</th>
                <th className="p-3.5 sm:p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 sm:p-4 text-slate-800 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#0066B2] shrink-0" />
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-500 whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {u.role === "Administrator" && (
                        <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )} 
                      <span>{u.role}</span>
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                      {u.status}
                    </span>
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
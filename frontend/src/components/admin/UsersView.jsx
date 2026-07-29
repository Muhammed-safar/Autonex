import React, { useState } from "react";
import {
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useUsers } from "../../hooks/mutations/useUsers";

export default function UsersView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Limit per page (matching your API default or setting to 10)
  const LIMIT = 20;

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useUsers(currentPage, LIMIT, search);

  // Extract data array and pagination info from the API response structure
  const usersList = apiResponse?.user || [];
  const pagination = apiResponse?.pagination || {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: LIMIT,
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

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
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0066B2]" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-red-500 font-semibold"
                  >
                    Failed to load users. Please try again.
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => {
                  // Fallback handling for _id or id
                  const userId = u._id || u.id;

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3.5 sm:p-4 text-slate-800 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#0066B2] shrink-0" />
                          <span>{u.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-500 whitespace-nowrap">
                        {u.email || "N/A"}
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {(u.role === "Administrator" ||
                            u.role === "admin") && (
                            <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="capitalize">{u.role || "User"}</span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-4 whitespace-nowrap">
                        <span
                          className={`border px-2 py-0.5 rounded text-[11px] font-bold ${
                            u.status === "Inactive"
                              ? "bg-rose-50 text-rose-600 border-rose-200"
                              : "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}
                        >
                          {u.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && !error && pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-slate-600">
            {/* Range info */}
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.total,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {pagination.total}
              </span>{" "}
              users
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Pills */}
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md border text-xs font-semibold transition-colors ${
                    pagination.currentPage === page
                      ? "bg-[#0066B2] text-white border-[#0066B2]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

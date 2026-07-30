import React, { useState } from "react";
import {
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Eye,
} from "lucide-react";
import { useUsers } from "../../hooks/mutations/useUsers";
import useDebounce from "../../hooks/useDebounce"; // Adjust path as needed
import DashboardSkeleton from "../layout.jsx/DashboardSkeleton";
import UserDetailsModal from "./UserDetailsModal"; // Import User Details Modal

const UsersView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal State for User Details
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Debounce search input by 500ms
  const debouncedSearch = useDebounce(search, 500);

  // Limit per page matching API default
  const LIMIT = 20;

  // Pass debounced search term to hook
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useUsers(currentPage, LIMIT, debouncedSearch);

  // Extract data array and pagination info from the API response structure
  const usersList = apiResponse?.data || [];
  const pagination = apiResponse?.pagination || {
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: LIMIT,
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 whenever search query changes
  };

  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Open modal
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsDetailsOpen(true);
  };

  // Close modal
  const handleCloseDetails = () => {
    setSelectedUserId(null);
    setIsDetailsOpen(false);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <h2 className="p-4 text-red-500 font-semibold">Failed to load users.</h2>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* Header & Search Bar Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-slate-700 text-sm">System Users</h3>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066B2]/20 focus:border-[#0066B2] transition"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4 text-left">User</th>
                <th className="p-3.5 sm:p-4 text-left">Email</th>
                <th className="p-3.5 sm:p-4 text-left">Role</th>
                <th className="p-3.5 sm:p-4 text-left">Status</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    {debouncedSearch
                      ? `No users found matching "${debouncedSearch}".`
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                usersList.map((u) => {
                  const userId = u._id || u.id;

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleUserClick(userId)}
                    >
                      <td className="p-3.5 sm:p-4 text-slate-800 font-semibold whitespace-nowrap">
                        <button
                          onClick={() => handleUserClick(userId)}
                          className="flex items-center gap-2 text-left group hover:text-[#0066B2] transition"
                        >
                          <UserCheck className="w-4 h-4 text-[#0066B2] shrink-0" />
                          <span className="group-hover:underline underline-offset-2">
                            {u.fullName || "N/A"}
                          </span>
                        </button>
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
                      <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(userId);
                          }}
                          aria-label="View user details"
                          title="View User Details"
                          className="p-1.5 text-slate-400 hover:text-[#0066B2] rounded-md hover:bg-slate-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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

      {/* User Details View Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default UsersView;

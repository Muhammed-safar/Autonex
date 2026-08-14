import React, { useState, useEffect } from "react";
import { Eye, Search, Calendar, X, PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import useAllOrders from "../../../hooks/orders/useAllOrders";
import useDebounce from "../../../hooks/useDebounce";
import AdminOrderDetailsModal from "./AdminOrderDetailsModal";



export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input to avoid hitting API on every keystroke
  const debouncedSearch = useDebounce(search, 500);

  // Fetch orders data
  const { data, isLoading, isError, error } = useAllOrders({
    page,
    limit,
    search: debouncedSearch,
    date,
  });

  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  // Pagination details from backend response
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || page;
  const totalOrders = pagination?.totalOrders || 0;
  const hasNextPage = pagination?.hasNextPage ?? (currentPage < totalPages);
  const hasPreviousPage = pagination?.hasPreviousPage ?? (currentPage > 1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, date]);

  // Helper to clear search and date filters
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setPage(1);
  };

  // Helper function for dynamic status badge styling
  const getStatusBadgeClass = (status = "") => {
    const formattedStatus = status.toUpperCase();
    switch (formattedStatus) {
      case "DELIVERED":
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "SHIPPED":
        return "bg-sky-50 text-sky-600 border-sky-200";
      default:
        return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  // Pagination helper for ellipsis (e.g. 1 ... 4 5 6 ... 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Orders Management</h2>

          {(search || date) && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer, or tracking ID..."
              className="w-full border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs outline-none focus:border-[#0066b2] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-[#0066b2] text-slate-700 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {isLoading ? (
          /* Loading State */
          <div className="p-10 text-center text-slate-400 animate-pulse font-medium">
            Loading orders...
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-6 bg-rose-50 text-rose-600 text-center font-medium">
            {error?.response?.data?.message || error?.message || "Failed to load orders."}
          </div>
        ) : orders.length === 0 ? (
          /* Empty Search / No Data State */
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <PackageSearch className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try modifying your search or clearing active filters.
            </p>
            {(search || date) && (
              <button
                onClick={clearFilters}
                className="mt-3 text-xs font-semibold text-[#0066B2] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Orders Table */
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
                {orders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 sm:p-4 text-[#0066B2] font-bold whitespace-nowrap">
                      #{order.orderNumber || order._id?.substring(0, 8) || order.id}
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-800 whitespace-nowrap">
                      {order.user?.name || order.customer || "N/A"}
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-400 whitespace-nowrap">
                      {new Date(order.createdAt || order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3.5 sm:p-4 font-bold text-slate-800 whitespace-nowrap">
                      ₹{order.totalAmount ?? order.total}
                    </td>
                    <td className="p-3.5 sm:p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadgeClass(
                          order.orderStatus || order.status
                        )}`}
                      >
                        {order.orderStatus || order.status}
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                      <button
                        aria-label="View order details"
                        onClick={() => handleOpenOrder(order)}
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
        )}

        {/* Footer Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 px-4 py-3 gap-3">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{orders.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalOrders}</span> orders (Page{" "}
              <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>)
            </p>

            <div className="flex items-center gap-1">
              {/* Prev Button */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!hasPreviousPage}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((p, index) =>
                p === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-1.5 text-xs text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 text-xs rounded-md font-semibold transition-colors ${currentPage === p
                      ? "bg-[#0066B2] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={!hasNextPage}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminOrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
      />
    </div>
  );
}
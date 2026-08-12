import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useMyOrders from "../../../hooks/orders/useMyOrders";
import useDebounce from "../../../hooks/useDebounce";
import { Search, Calendar, X, PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";

const Orders = ({ setActiveTab }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useMyOrders(
    debouncedSearch,
    date,
    page
  );

  const orders = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || page;

  // Reset page to 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, date]);

  // Reset filters helper
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setPage(1);
  };

  // Loading State
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="text-sm text-gray-500 animate-pulse">
          Loading your orders...
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>

        <div className="border border-red-200 bg-red-50 rounded-md p-4">
          <p className="text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load orders"}
          </p>
        </div>
      </div>
    );
  }

  // Pure Empty State (User has zero orders in system and no filters applied)
  if (orders.length === 0 && !debouncedSearch && !date) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="border border-gray-200 rounded-md p-8 text-center">
          <p className="text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] overflow-y-auto pr-2 flex flex-col justify-between hide-scrollbar">
      <div>
        {/* Header & Clear Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Orders</h2>

          {(search || date) && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium self-end sm:self-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Search & Date Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, tracking ID, or item..."
              className="w-full border border-gray-200 rounded-md pl-9 pr-8 py-2.5 text-sm outline-none focus:border-[#0066b2] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-md pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#0066b2] transition-colors text-gray-700"
            />
          </div>
        </div>

        {/* Results List or Empty Search Result */}
        {orders.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-md p-10 text-center flex flex-col items-center justify-center">
            <PackageSearch className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              No matching orders found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search criteria or clear filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-xs font-semibold text-[#0066b2] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-gray-300 transition-colors bg-white shadow-sm"
              >
                {/* Order Info */}
                <div>
                  <span className="font-bold text-gray-800">
                    #{order.orderNumber}
                  </span>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>

                {/* Status & Action */}
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${order.orderStatus === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : order.orderStatus === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {order.orderStatus}
                  </span>

                  <button
                    onClick={() => navigate(`/OrderDetail/${order._id}`)}
                    className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded transition-colors"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs rounded-md font-medium transition-colors ${currentPage === p
                    ? "bg-[#0066b2] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
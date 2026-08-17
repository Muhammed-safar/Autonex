import React, { useState } from "react";
import {
  Star,
  Trash2,
  Search,
  X,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import useAdminReviews from "../../../hooks/reviews/useAdminReviews";
import useAdminDeleteReview from "../../../hooks/reviews/useAdminDeleteReview";
import useDebounce from "../../../hooks/useDebounce";

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={11}
        className={s <= rating ? "text-[#f5b300] fill-[#f5b300]" : "text-slate-200 fill-slate-200"}
      />
    ))}
    <span className="text-xs font-bold text-slate-700 ml-1">{rating}</span>
  </div>
);

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // reviewId to confirm delete
  const limit = 15;

  const { data, isLoading, isError, error } = useAdminReviews({
    page,
    limit,
    rating: ratingFilter || undefined,
  });

  const { mutate: deleteReview, isPending: isDeleting } = useAdminDeleteReview();

  const reviews = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const currentPage = pagination.currentPage || page;
  const totalReviews = pagination.totalReviews || 0;

  const handleDelete = (reviewId) => {
    deleteReview(reviewId, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const clearFilters = () => {
    setRatingFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Reviews Management</h2>
          {ratingFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Rating filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Filter by rating:</span>
          {["", "5", "4", "3", "2", "1"].map((r) => (
            <button
              key={r}
              onClick={() => { setRatingFilter(r); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                ratingFilter === r
                  ? "bg-[#0066B2] text-white border-[#0066B2]"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r === "" ? "All" : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {isLoading ? (
          <div className="p-10 text-center text-slate-400 animate-pulse font-medium">
            Loading reviews...
          </div>
        ) : isError ? (
          <div className="p-6 bg-rose-50 text-rose-600 text-center font-medium">
            {error?.response?.data?.message || error?.message || "Failed to load reviews."}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <PackageSearch className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No reviews found</p>
            <p className="text-xs text-slate-400 mt-1">
              {ratingFilter ? "Try a different rating filter." : "No reviews yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5 text-left">Product</th>
                  <th className="p-3.5 text-left">Customer</th>
                  <th className="p-3.5 text-left">Rating</th>
                  <th className="p-3.5 text-left">Comment</th>
                  <th className="p-3.5 text-left">Date</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50 transition-colors">
                    {/* Product */}
                    <td className="p-3.5 max-w-[160px]">
                      <div className="flex items-center gap-2">
                        {review.product?.images?.[0]?.url ? (
                          <img
                            src={review.product.images[0].url}
                            alt={review.product.name}
                            className="w-8 h-8 rounded object-cover shrink-0 border border-slate-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-100 shrink-0" />
                        )}
                        <span className="text-slate-800 font-semibold truncate text-[11px]">
                          {review.product?.name || "Unknown Product"}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <p className="text-slate-800 font-semibold">
                        {review.user?.fullName || "N/A"}
                      </p>
                      <p className="text-slate-400 text-[11px]">{review.user?.email || ""}</p>
                    </td>

                    {/* Rating */}
                    <td className="p-3.5 whitespace-nowrap">
                      <StarDisplay rating={review.rating} />
                    </td>

                    {/* Comment */}
                    <td className="p-3.5 max-w-[200px]">
                      <p className="text-slate-500 text-[11px] truncate">
                        {review.comment || <span className="italic text-slate-300">No comment</span>}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Visibility status */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          review.isVisible
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-slate-100 text-slate-400 border-slate-200"
                        }`}
                      >
                        {review.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteTarget(review._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 px-4 py-3 gap-3">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{reviews.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalReviews}</span> reviews
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={!pagination.hasPreviousPage}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={!pagination.hasNextPage}
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Delete Review</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This action will permanently delete the review and recalculate the product's rating.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
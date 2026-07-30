import React from "react";
import {
  X,
  UserCheck,
  Mail,
  Shield,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  Clock,
  IdCard,
} from "lucide-react";
import { useUser } from "../../hooks/mutations/useUser"; // Adjust import path as needed

const UserDetailsModal = ({ userId, isOpen, onClose }) => {
  if (!isOpen || !userId) return null;

  const { data: userResponse, isLoading, error } = useUser(userId);

  // Handle potential nested wrapper objects (e.g. { data: user } vs user)
  const user = userResponse?.data || userResponse || {};

  // Extract avatar or build initials fallback
  const avatarUrl = user.avatar?.url || user.avatar || user.profilePicture;
  const fullName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "N/A";
  const initials =
    fullName !== "N/A"
      ? fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "US";

  const isUserActive = user.status
    ? user.status.toLowerCase() === "active"
    : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-sans">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-[#0066B2]" />
            <h2 className="text-sm font-bold text-slate-800">
              User Profile Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#0066B2] mb-2" />
              <span>Loading user information...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-rose-50 p-4 text-center text-rose-600 font-medium border border-rose-200">
              Failed to load user details. Please try again.
            </div>
          ) : (
            <>
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-16 w-16 rounded-full border-2 border-white shadow-md object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0066B2] text-white font-bold text-lg shadow-md shrink-0">
                    {initials}
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-800">
                      {fullName}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isUserActive
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {isUserActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-slate-500 font-medium">
                    {user.email || "No email address registered"}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-slate-600">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold capitalize text-slate-700">
                      {user.role || "User"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Grid Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                {/* ID */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-100 text-slate-600">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      User ID
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 truncate block">
                      {user._id || user.id || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50 text-[#0066B2]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Phone Number
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {user.phone || user.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-100 text-slate-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Joined On
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Last Active / Updated */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-100 text-slate-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Last Updated
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address / Additional Details if present */}
              {(user.address || user.city || user.country) && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-[#0066B2]" />
                    <span>Location Details</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium pl-5">
                    {[user.address, user.city, user.state, user.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserDetailsModal;

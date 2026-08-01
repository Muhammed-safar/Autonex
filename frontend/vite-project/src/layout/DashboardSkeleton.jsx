import React from "react";

// Basic shimmer block helper
const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-6 p-1">
      {/* Hero Banner / Top Highlight Skeleton */}
      <div className="relative w-full h-[280px] bg-slate-200 rounded-3xl animate-pulse p-8 flex flex-col justify-end space-y-4">
        <SkeletonBlock className="h-6 w-36 bg-slate-300" />
        <SkeletonBlock className="h-10 w-2/3 bg-slate-300" />
        <SkeletonBlock className="h-10 w-1/2 bg-slate-300" />
        <SkeletonBlock className="h-4 w-1/3 bg-slate-300" />
        <SkeletonBlock className="h-10 w-36 rounded-xl bg-slate-300 mt-2" />
      </div>

      {/* Stats Cards Row (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between"
          >
            <div className="space-y-2 flex-1">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-7 w-28" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Table / Data List Placeholder */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-100">
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-16 justify-self-end" />
        </div>

        {/* Table Rows */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 items-center py-2">
            <div className="flex items-center space-x-3">
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-6 w-16 rounded-full justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
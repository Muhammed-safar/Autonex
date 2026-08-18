import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useDashboardStats } from "../../hooks/dashboard/useDashboardStatus";
import { useAdminDashboardAnalytics } from "../../hooks/dashboard/useAdminAnalytics.js";
import useAllOrders from "../../hooks/orders/useAllOrders";
import DashboardSkeleton from "../layout.jsx/DashboardSkeleton";
import { useNavigate } from "react-router-dom";

// Component for Circular Radial Metric Card with Framer Motion
const StatCircularCard = ({
  title,
  value,
  percentage = 100,
  subtext,
  icon: Icon,
  colorScheme,
  delay = 0,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Cap percentage visual fill between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset =
    circumference - (normalizedPercentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
          {title}
        </span>
        <h4 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
          {value}
        </h4>
        <span className="text-xs font-semibold text-slate-500 mt-1.5 block">
          {subtext}
        </span>
      </div>

      {/* Circular Ring Graphic */}
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          {/* Background Ring */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`${colorScheme.bgRing}`}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Growth Ring */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            className={`${colorScheme.stroke}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content (Icon or Growth Percentage) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
          <Icon className={`w-5 h-5 mb-0.5 ${colorScheme.text}`} />
          <span
            className={`text-[11px] font-black leading-tight ${colorScheme.text}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useDashboardStats();

  const { data, isLoading: isAnalyticsLoading } = useAdminDashboardAnalytics();

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
  } = useAllOrders({ page: 1, limit: 100 });

  const allOrders = useMemo(
    () => ordersData?.data || ordersData?.orders || [],
    [ordersData],
  );
  const totalOrdersCount =
    ordersData?.pagination?.totalOrders ?? allOrders.length;

  const ordersMonthOverMonthChange = useMemo(() => {
    if (!allOrders.length) return 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let thisMonthCount = 0;
    let lastMonthCount = 0;

    allOrders.forEach((order) => {
      if (!order.createdAt) return;
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth();

      if (year === currentYear && month === currentMonth) {
        thisMonthCount++;
      } else if (year === prevMonthYear && month === prevMonth) {
        lastMonthCount++;
      }
    });

    if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
    const diff = thisMonthCount - lastMonthCount;
    return Number(((diff / lastMonthCount) * 100).toFixed(1));
  }, [allOrders]);

  if (isStatsLoading) return <DashboardSkeleton />;
  if (isStatsError)
    return <p className="p-4 text-red-500">{statsError.message}</p>;

  const {
    totalUsers = 0,
    activeProducts = 0,
    thisMonthUsers = 0,
    thisMonthProducts = 0,
  } = statsData?.data || {};
  const recentOrders = allOrders.slice(0, 5);
  const analytics = data?.data;

  // Percentage estimations for products and users month progress
  const productGrowthRatio =
    activeProducts > 0
      ? Math.round((thisMonthProducts / activeProducts) * 100)
      : 100;

  const userGrowthRatio =
    totalUsers > 0 ? Math.round((thisMonthUsers / totalUsers) * 100) : 100;

  const statsConfig = [
    {
      title: "Total Revenue",
      value: isAnalyticsLoading
        ? "..."
        : `₹${(analytics?.overview?.netRevenue ?? 0).toLocaleString("en-IN")}`,
      percentage: analytics?.growth?.revenue ?? 100,
      subtext: `Gross: ₹${(analytics?.overview?.grossRevenue ?? 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      colorScheme: {
        stroke: "stroke-emerald-500",
        bgRing: "stroke-emerald-100",
        text: "text-emerald-600",
      },
    },
    {
      title: "Total Orders",
      value: isOrdersLoading ? "..." : totalOrdersCount,
      percentage: Math.abs(ordersMonthOverMonthChange),
      subtext: `${ordersMonthOverMonthChange >= 0 ? "+" : ""}${ordersMonthOverMonthChange}% vs last month`,
      icon: ShoppingBag,
      colorScheme: {
        stroke: "stroke-blue-500",
        bgRing: "stroke-blue-100",
        text: "text-blue-600",
      },
    },
    {
      title: "Active Products",
      value: isStatsLoading ? "..." : activeProducts,
      percentage: productGrowthRatio,
      subtext: `${thisMonthProducts} added this month`,
      icon: Package,
      colorScheme: {
        stroke: "stroke-purple-500",
        bgRing: "stroke-purple-100",
        text: "text-purple-600",
      },
    },
    {
      title: "Registered Users",
      value: isStatsLoading ? "..." : totalUsers,
      percentage: userGrowthRatio,
      subtext: `${thisMonthUsers} new this month`,
      icon: Users,
      colorScheme: {
        stroke: "stroke-amber-500",
        bgRing: "stroke-amber-100",
        text: "text-amber-600",
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F8FAFC] font-sans antialiased text-slate-800">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          {/* HERO BANNER */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-stretch min-h-[320px] sm:min-h-[380px]">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10 pointer-events-none" />
            <div
              className="absolute inset-0 opacity-80 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000')`,
              }}
            />

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

          {/* OVERVIEW METRICS CARDS WITH CIRCULAR GRAPH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {statsConfig.map((stat, index) => (
              <StatCircularCard key={index} {...stat} delay={index * 0.1} />
            ))}
          </div>

          {/* RECENT ORDERS TABLE */}
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
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-xs font-bold text-[#0066B2] hover:underline text-left sm:text-right"
              >
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
                  {isOrdersLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={18} />
                          <span>Loading orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : isOrdersError ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-red-500">
                        {ordersError?.message || "Failed to load recent orders"}
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-slate-400"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, i) => {
                      const orderId =
                        order.orderNumber || order._id || `#ORD-${order.id}`;
                      const customerName =
                        order.shippingAddress?.fullName ||
                        order.user?.email ||
                        "N/A";
                      const category = order.items?.[0]?.name || "General";
                      const amount =
                        typeof order.totalAmount === "number"
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : "₹0.00";
                      const status = order.orderStatus || "placed";

                      return (
                        <tr
                          key={order._id || i}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3.5 px-4 sm:px-5 font-bold text-[#0066B2]">
                            {orderId}
                          </td>
                          <td className="py-3.5 px-4 sm:px-5 text-slate-900 whitespace-nowrap">
                            {customerName}
                          </td>
                          <td className="py-3.5 px-4 sm:px-5 text-slate-500 whitespace-nowrap">
                            {category}
                          </td>
                          <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                            {amount}
                          </td>
                          <td className="py-3.5 px-4 sm:px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block capitalize ${
                                [
                                  "placed",
                                  "completed",
                                  "shipped",
                                  "delivered",
                                ].includes(status.toLowerCase())
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : ["processing", "shipped"].includes(
                                        status.toLowerCase(),
                                      )
                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                    : "bg-amber-50 text-red-600 border border-red-200"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
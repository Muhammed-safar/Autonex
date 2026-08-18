import Order from "../models/Order.js";

export const getAdminDashboardAnalytics = async () => {
  const now = new Date();

  // ============================================
  // CURRENT MONTH
  // ============================================

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // ============================================
  // PREVIOUS MONTH - SAME PERIOD
  // ============================================

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Same day of previous month
  const currentDay = now.getDate();

  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    currentDay + 1,
  );

  // ============================================
  // VALID SALES
  // ============================================

  /*
        Razorpay:
        paymentStatus === PAID

        COD:
        We currently consider DELIVERED as successful
        because your system doesn't yet have a separate
        COD payment confirmation function.
    */

  const successfulSaleCondition = {
    $or: [
      {
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
      },
      {
        paymentMethod: "COD",
        orderStatus: "DELIVERED",
      },
    ],
  };

  // ============================================
  // OVERALL ANALYTICS
  // ============================================

  const overviewResult = await Order.aggregate([
    {
      $match: successfulSaleCondition,
    },

    {
      $facet: {
        sales: [
          {
            $count: "count",
          },
        ],

        revenue: [
          {
            $group: {
              _id: null,
              grossRevenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ],

        refunds: [
          {
            $match: {
              refundStatus: "COMPLETED",
            },
          },
          {
            $group: {
              _id: null,
              totalRefunds: {
                $sum: {
                  $ifNull: ["$refund.amount", 0],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const overview = overviewResult[0];

  const totalSales = overview.sales[0]?.count || 0;

  const grossRevenue = overview.revenue[0]?.grossRevenue || 0;

  const totalRefunds = overview.refunds[0]?.totalRefunds || 0;

  const netRevenue = grossRevenue - totalRefunds;

  // ============================================
  // CANCELLED ORDERS
  // ============================================

  const totalCancelled = await Order.countDocuments({
    orderStatus: "CANCELLED",
  });

  // ============================================
  // RETURNED ORDERS
  // ============================================

  const totalReturns = await Order.countDocuments({
    orderStatus: "RETURNED",
  });

  // ============================================
  // CURRENT MONTH
  // ============================================

  const currentMonthResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: currentMonthStart,
          $lt: currentMonthEnd,
        },

        ...successfulSaleCondition,
      },
    },

    {
      $group: {
        _id: null,

        sales: {
          $sum: 1,
        },

        grossRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const currentMonthSales = currentMonthResult[0]?.sales || 0;

  const currentMonthGrossRevenue = currentMonthResult[0]?.grossRevenue || 0;

  // ============================================
  // CURRENT MONTH REFUNDS
  // ============================================

  const currentMonthRefundResult = await Order.aggregate([
    {
      $match: {
        refundStatus: "COMPLETED",

        "refund.processedAt": {
          $gte: currentMonthStart,
          $lt: currentMonthEnd,
        },
      },
    },

    {
      $group: {
        _id: null,

        refunds: {
          $sum: {
            $ifNull: ["$refund.amount", 0],
          },
        },
      },
    },
  ]);

  const currentMonthRefunds = currentMonthRefundResult[0]?.refunds || 0;

  const currentMonthNetRevenue = currentMonthGrossRevenue - currentMonthRefunds;

  // ============================================
  // PREVIOUS MONTH
  // ============================================

  const previousMonthResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: previousMonthStart,
          $lt: previousMonthEnd,
        },

        ...successfulSaleCondition,
      },
    },

    {
      $group: {
        _id: null,

        sales: {
          $sum: 1,
        },

        grossRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const previousMonthSales = previousMonthResult[0]?.sales || 0;

  const previousMonthGrossRevenue = previousMonthResult[0]?.grossRevenue || 0;

  // ============================================
  // PREVIOUS MONTH REFUNDS
  // ============================================

  const previousMonthRefundResult = await Order.aggregate([
    {
      $match: {
        refundStatus: "COMPLETED",

        "refund.processedAt": {
          $gte: previousMonthStart,
          $lt: previousMonthEnd,
        },
      },
    },

    {
      $group: {
        _id: null,

        refunds: {
          $sum: {
            $ifNull: ["$refund.amount", 0],
          },
        },
      },
    },
  ]);

  const previousMonthRefunds = previousMonthRefundResult[0]?.refunds || 0;

  const previousMonthNetRevenue =
    previousMonthGrossRevenue - previousMonthRefunds;

  // ============================================
  // GROWTH CALCULATION
  // ============================================

  const calculateGrowth = (current, previous) => {
    if (previous === 0) {
      if (current === 0) return 0;

      return 100;
    }

    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  const salesGrowth = calculateGrowth(currentMonthSales, previousMonthSales);

  const revenueGrowth = calculateGrowth(
    currentMonthNetRevenue,
    previousMonthNetRevenue,
  );

  // ============================================
  // CURRENT MONTH REVENUE CHART
  // ============================================

  const revenueChartResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: currentMonthStart,
          $lt: currentMonthEnd,
        },

        ...successfulSaleCondition,
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },

        revenue: {
          $sum: "$totalAmount",
        },

        sales: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },

    {
      $project: {
        _id: 0,

        date: "$_id",

        revenue: 1,

        sales: 1,
      },
    },
  ]);

  // ============================================
  // RETURN RESPONSE
  // ============================================

  return {
    overview: {
      totalSales,

      grossRevenue: Number(grossRevenue.toFixed(2)),

      totalRefunds: Number(totalRefunds.toFixed(2)),

      netRevenue: Number(netRevenue.toFixed(2)),

      totalCancelled,

      totalReturns,
    },

    currentMonth: {
      sales: currentMonthSales,

      grossRevenue: Number(currentMonthGrossRevenue.toFixed(2)),

      refunds: Number(currentMonthRefunds.toFixed(2)),

      netRevenue: Number(currentMonthNetRevenue.toFixed(2)),
    },

    previousMonth: {
      sales: previousMonthSales,

      grossRevenue: Number(previousMonthGrossRevenue.toFixed(2)),

      refunds: Number(previousMonthRefunds.toFixed(2)),

      netRevenue: Number(previousMonthNetRevenue.toFixed(2)),
    },

    growth: {
      sales: salesGrowth,

      revenue: revenueGrowth,
    },

    revenueChart: revenueChartResult,
  };
};
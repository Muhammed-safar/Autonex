import Product from "../models/Product.js";
import User from "../models/User.js";
import { getAdminDashboardAnalytics } from "../services/analytics.service.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [productStats] = await Product.aggregate([
      {
        $facet: {
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: startOfMonth,
                },
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const [userStats] = await User.aggregate([
      {
        $facet: {
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: startOfMonth,
                },
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const thisMonthUsers = userStats.thisMonth[0]?.count || 0;
    const thisMonthProducts = productStats.thisMonth[0]?.count || 0;


    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeProducts,
        // totalOrders,

        thisMonthUsers,
        thisMonthProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAdminDashboardAnalyticsController = async (req, res) => {
  try {
    const analytics = await getAdminDashboardAnalytics();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
    });
  }
};
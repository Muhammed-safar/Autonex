import Product from "../models/Product";
import User from "../models/User";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }), 
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeProducts,
        // totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

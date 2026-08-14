import User from "../models/User.js";

export const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    });
  }

  next();
};


export const employeeOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    if (!["admin", "employee"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin or employee access required.",
        });
    }

    next();
};
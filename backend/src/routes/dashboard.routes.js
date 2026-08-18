import express from "express";
import { getAdminDashboardAnalyticsController, getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getDashboardStats);
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboardAnalyticsController,
);

export default router;
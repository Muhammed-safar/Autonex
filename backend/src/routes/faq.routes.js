import express from "express";
import {
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQStatus,
  reorderFAQs,
  getAdminFAQs,
  getPublicFAQs,
  getFAQById,
} from "../controllers/faq.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// -- PUBLIC ROUTES --
router.get("/", getPublicFAQs);

// -- ADMIN ROUTES --
// Apply protect and adminOnly middlewares
router.use(protect, adminOnly);

router.post("/", createFAQ);
router.get("/admin/all", getAdminFAQs);
router.get("/admin/:id", getFAQById);
router.patch("/reorder", reorderFAQs);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);
router.patch("/:id/status", updateFAQStatus);

export default router;
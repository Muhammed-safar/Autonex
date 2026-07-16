import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  toggleBrandStatus,
  permanentlyDeleteBrand,
} from "../controllers/brand.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBrand);

router.get("/", getAllBrands); // have features - brand name , isActive , isFeatured , sort by , search , pagination
router.get("/:id", getBrandById);
router.put("/:id", protect, adminOnly, updateBrand);
router.patch("/:id", protect, adminOnly, toggleBrandStatus);
router.delete("/:id", protect, adminOnly, permanentlyDeleteBrand);

export default router;

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
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { validation } from "../middlewares/validation.middleware.js";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../validators/brand.validator.js";
import { brandUpload } from "../middlewares/types.multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  brandUpload.fields([{ name: "logo", maxCount: 1 }]),
  validation(createBrandSchema),
  createBrand,
);

router.get("/", getAllBrands); // have features - brand name , isActive , isFeatured , sort by , search , pagination
router.get("/:id", validateObjectId, getBrandById);
router.put(
  "/:id",
  protect,
  adminOnly,
  validateObjectId,
  brandUpload.fields([{ name: "logo", maxCount: 1 }]),
  validation(updateBrandSchema),
  updateBrand,
);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  validateObjectId,
  toggleBrandStatus,
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  validateObjectId,
  permanentlyDeleteBrand,
);

export default router;
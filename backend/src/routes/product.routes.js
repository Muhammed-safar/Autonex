import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createProductValidation, updateProductValidation } from "../validators/product.validator.js";
import { productUpload } from "../middlewares/multer/types.multer.middleware.js";
import { searchLimiter } from "../middlewares/rateLimiter.js";
import { parseProductBody } from "../middlewares/multer/parseProductBody.js";

const router = express.Router();

router.post("/",protect , adminOnly , productUpload.array("images" , 10 ) ,parseProductBody, validate(createProductValidation) , createProduct);

router.get("/",searchLimiter, getProducts);

router.get("/:id",searchLimiter , getProductById);

router.put("/:id", protect , adminOnly,productUpload.array("images" , 10) ,parseProductBody, validate(updateProductValidation) , updateProduct);

router.delete("/:id",protect , adminOnly, deleteProduct);

export default router;

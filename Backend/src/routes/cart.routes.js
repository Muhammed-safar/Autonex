import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.patch("/item/:itemId", protect, updateCartItem);
router.delete("/item/:itemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
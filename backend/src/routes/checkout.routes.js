import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";


const router = express.Router();

router.post("/", protect, checkout);

export default router;
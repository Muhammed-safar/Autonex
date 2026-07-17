import express from "express";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getAddressByIdRepo } from "../repositories/address.repository.js";

const router = express.Router();

router.post("/", protect, createAddress);

router.get("/", protect, getAddresses);

router.get("/:id", protect, getAddressByIdRepo);

router.put("/:id", protect, updateAddress);

router.patch("/:id/default", protect, setDefaultAddress);

router.delete("/:id", protect, deleteAddress);

export default router;
import express from "express";
import { login, register , getProfile, UpdateUser, deleteUser } from "../controllers/auth.controllers.js";

import { protect} from "../middlewares/auth.middleware.js";
import { adminOrUser } from "../middlewares/AdminorUser.middleware.js";
import { validation } from "../middlewares/validation.middleware.js";


const router = express.Router();

router.post("/register",  register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/update-User", protect, adminOrUser, UpdateUser);
router.delete("/delete-User", protect, adminOrUser, deleteUser);

export default router;
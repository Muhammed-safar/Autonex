import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getAdminBlogs,
  getPublicBlogs,
  getBlogBySlug,
  getBlogById,
} from "../controllers/blog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";
import { productUpload } from "../middlewares/multer/types.multer.middleware.js";

const router = express.Router();

// -- PUBLIC ROUTES --
router.get("/", getPublicBlogs);
router.get("/:slug", getBlogBySlug);

// -- ADMIN ROUTES --
// Apply protect and adminOnly middlewares
router.use(protect, adminOnly);

router.post("/", productUpload.single("image"), createBlog);
router.get("/admin/all", getAdminBlogs);
router.get("/admin/:id", getBlogById);
router.put("/:id", productUpload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/status", updateBlogStatus);

export default router;
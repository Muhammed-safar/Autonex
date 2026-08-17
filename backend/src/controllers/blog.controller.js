import Blog from "../models/Blog.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.helper.js";

// -- ADMIN ROUTES --

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, status } = req.body;

    // Optional manual slug
    let { slug } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, and content are required",
      });
    }

    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with that slug already exists",
      });
    }

    // Handle featured image upload if present
    let featuredImage = {};
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "blogs");
      featuredImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    const publishedAt = status === "published" ? new Date() : null;

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      featuredImage,
      author: req.user.id,
      publishedAt,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, status } = req.body;
    let { slug } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (!slug && title && title !== blog.title) {
        slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (slug && slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog && existingBlog._id.toString() !== blog._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "A blog with that slug already exists",
        });
      }
      blog.slug = slug;
    }

    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;

    if (status && status !== blog.status) {
      blog.status = status;
      if (status === "published") {
        blog.publishedAt = new Date();
      }
    }

    // Handle featured image replacement
    if (req.file) {
      if (blog.featuredImage && blog.featuredImage.publicId) {
        await deleteFromCloudinary(blog.featuredImage.publicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.path, "blogs");
      blog.featuredImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete image from cloudinary if exists
    if (blog.featuredImage && blog.featuredImage.publicId) {
      await deleteFromCloudinary(blog.featuredImage.publicId);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog removed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update a blog status
// @route   PATCH /api/blogs/:id/status
// @access  Private/Admin
export const updateBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status",
        });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.status = status;
    if (status === "published") {
      blog.publishedAt = blog.publishedAt || new Date();
    }
    
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all blogs for Admin
// @route   GET /api/blogs/admin/all
// @access  Private/Admin
export const getAdminBlogs = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (status && status !== "All") {
        filter.status = status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// -- PUBLIC ROUTES --

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
export const getPublicBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = { status: "published" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate("author", "name")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get a single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "name");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get a single blog by ID (For Admin Editing)
// @route   GET /api/blogs/admin/:id
// @access  Private/Admin
export const getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }
  
      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
};
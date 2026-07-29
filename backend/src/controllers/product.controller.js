import mongoose from "mongoose";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

import fs from "fs/promises";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.helper.js";

export const createProduct = async (req, res) => {
  try {
    const { brand, category } = req.body;

    // Verify Brand
    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Verify Category
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload images to Cloudinary
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.path);

          return {
            url: result.secure_url,
            publicId: result.public_id,
            alt: file.originalname,
          };
        }),
      );
    }

    // Create Product
    const product = await Product.create({
      ...req.body,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      brand,
      featured,
      active,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const matchStage = {};

    // Search
    if (search) {
      matchStage.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Category
    if (category) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // Brand
    if (brand) {
      matchStage.brand = new mongoose.Types.ObjectId(brand);
    }

    // Featured
    if (featured !== undefined) {
      matchStage.isFeatured = featured === "true";
    }

    // Active
    if (active !== undefined) {
      matchStage.isActive = active === "true";
    }

    // Price Range
    if (minPrice || maxPrice) {
      matchStage.basePrice = {};

      if (minPrice) {
        matchStage.basePrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        matchStage.basePrice.$lte = Number(maxPrice);
      }
    }

    const sortStage = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const result = await Product.aggregate([
      {
        $match: matchStage,
      },

      // Brand Join
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },

      {
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Category Join
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $facet: {
          products: [
            {
              $sort: sortStage,
            },
            {
              $skip: (currentPage - 1) * pageLimit,
            },
            {
              $limit: pageLimit,
            },
          ],

          totalCount: [
            {
              $count: "count",
            },
          ],

          activeProducts: [
            {
              $match: {
                isActive: true,
              },
            },
            {
              $count: "count",
            },
          ],

          inactiveProducts: [
            {
              $match: {
                isActive: false,
              },
            },
            {
              $count: "count",
            },
          ],

          featuredProducts: [
            {
              $match: {
                isFeatured: true,
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const products = result[0].products;

    const total = result[0].totalCount[0]?.count || 0;

    const activeProducts = result[0].activeProducts[0]?.count || 0;

    const inactiveProducts = result[0].inactiveProducts[0]?.count || 0;

    const featuredProducts = result[0].featuredProducts[0]?.count || 0;

    res.status(200).json({
      success: true,

      stats: {
        totalProducts: total,
        activeProducts,
        inactiveProducts,
        featuredProducts,
      },

      pagination: {
        total,
        currentPage,
        totalPages: Math.ceil(total / pageLimit),
        limit: pageLimit,
      },

      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },

      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },

      {
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!product.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.existingImages);
    console.log(typeof req.body.existingImages);
    const { brand, category } = req.body;

    // Validate Brand
    if (brand) {
      const existingBrand = await Brand.findById(brand);

      if (!existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    // Validate Category
    if (category) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Find Product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Existing Images
    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : [];

    // Removed Images
    const removedImages = Array.isArray(req.body.removedImages)
      ? req.body.removedImages
      : [];

    // Delete removed images from Cloudinary
    if (removedImages.length) {
      await Promise.all(
        removedImages.map(async (publicId) => {
          await deleteImage(publicId);
        }),
      );
    }

    // Upload newly selected images
    let uploadedImages = [];

    if (req.files?.length) {
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.path);

          return {
            url: result.url,
            publicId: result.publicId,
            alt: file.originalname,
          };
        }),
      );
    }

    // Update Product Fields
    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.sku = req.body.sku ?? product.sku;
    product.price = req.body.price ?? product.price;
    product.discountPrice = req.body.discountPrice ?? product.discountPrice;
    product.stock = req.body.stock ?? product.stock;
    product.brand = req.body.brand ?? product.brand;
    product.category = req.body.category ?? product.category;
    product.variants = req.body.variants ?? product.variants;
    product.compatibleVehicles =
      req.body.compatibleVehicles ?? product.compatibleVehicles;
    product.isActive = req.body.isActive ?? product.isActive;
    product.isFeatured = req.body.isFeatured ?? product.isFeatured;

    // Save final images
    product.images = [...existingImages, ...uploadedImages];

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all images from Cloudinary
    if (product.images?.length) {
      await Promise.all(
        product.images.map(async (image) => {
          if (image.publicId) {
            await deleteFromCloudinary(image.publicId);
          }
        }),
      );
    }

    // Delete product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

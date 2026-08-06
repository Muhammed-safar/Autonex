import mongoose from "mongoose";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { convertProduct } from "../services/currency.service.js";

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
            url: result.url,
            publicId: result.publicId,
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
  const selectedCurrency = req.headers["x-currency"] || "USD";
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      featured,
      active,
      inStock,
      onSale,
      minPrice,
      maxPrice,
      sortBy = "displayPriority",
      order = "desc",
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.max(1, Number(limit) || 12);

    const matchStage = {};

    // 1. Text Search
    if (search && search.trim() !== "") {
      matchStage.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Helper function to safely cast valid Mongo ObjectIDs
    const parseValidObjectIds = (param) => {
      if (!param) return [];
      const ids = Array.isArray(param) ? param : param.split(",");
      return ids
        .map((id) => id.trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
    };

    // 2. Safe Category Filter (Single ID or Comma-Separated IDs)
    const categoryIds = parseValidObjectIds(category);
    if (categoryIds.length > 0) {
      matchStage.category =
        categoryIds.length === 1 ? categoryIds[0] : { $in: categoryIds };
    }

    // 3. Safe Brand Filter (Single ID or Comma-Separated IDs)
    const brandIds = parseValidObjectIds(brand);
    if (brandIds.length > 0) {
      matchStage.brand =
        brandIds.length === 1 ? brandIds[0] : { $in: brandIds };
    }

    // 4. Featured Flag
    if (featured !== undefined && featured !== "") {
      matchStage.isFeatured = featured === "true";
    }

    // 5. Active Flag
    if (active !== undefined && active !== "") {
      matchStage.isActive = active === "true";
    }

    // 6. In-Stock Filter (Matches product stock > 0)
    if (inStock === "true") {
      matchStage.stock = { $gt: 0 };
    }

    // 7. On-Sale Filter (Matches discountPrice > 0)
    if (onSale === "true") {
      matchStage.discountPrice = { $gt: 0 };
    }

    // 8. Safe Price Range Filter
    const minP = Number(minPrice);
    const maxP = Number(maxPrice);
    if (!isNaN(minP) || !isNaN(maxP)) {
      matchStage.price = {};
      if (!isNaN(minP) && minP >= 0) matchStage.price.$gte = minP;
      if (!isNaN(maxP) && maxP > 0) matchStage.price.$lte = maxP;
    }

    // 9. Sorting Stage
    const allowedSortFields = [
      "createdAt",
      "price",
      "rating",
      "totalSold",
      "name",
      "displayPriority",
    ];

    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "displayPriority";

    const sortStage = {
      [validSortBy]: order === "asc" ? 1 : -1,
    };

    // Fallback sort for consistent pagination
    if (validSortBy !== "createdAt") {
      sortStage.createdAt = -1;
    }

    // 10. Execute Aggregation Pipeline
    const result = await Product.aggregate([
      { $match: matchStage },
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
      {
        $facet: {
          products: [
            { $sort: sortStage },
            { $skip: (currentPage - 1) * pageLimit },
            { $limit: pageLimit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const facetData = result[0] || {};
    const products = facetData.products || [];
    const convertedProducts = products.map((product) =>
      convertProduct(product, selectedCurrency),
    );  
    const total = facetData.totalCount?.[0]?.count || 0;

    res.status(200).json({
      success: true,
      pagination: {
        total,
        currentPage,
        totalPages: Math.ceil(total / pageLimit) || 1,
        limit: pageLimit,
      },
      data: convertedProducts,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const selectedCurrency = req.headers["x-currency"] || "USD";

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

   const convertedProduct = convertProduct(
  product[0],
  selectedCurrency,
);

res.status(200).json({
  success: true,
  data: convertedProduct,
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
          await deleteFromCloudinary(publicId);
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

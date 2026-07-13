import mongoose from "mongoose";
import Product from "../models/Products.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
        },
      },
    ]);

    const products = result[0].products;
    const total = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      success: true,

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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
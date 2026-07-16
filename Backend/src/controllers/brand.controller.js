import Brand from "../models/Brand.js";
import Products from "../models/Products.js";

// Create Brand
export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Brands
export const getAllBrands = async (req, res) => {
  try {
    const {
      isActive,
      isFeatured,
      sortBy = "createdAt",
      order = "desc",
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Number(limit) || 10, 50);
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const [brands, total] = await Promise.all([
      Brand.find(filter).sort(sortOptions).skip(skip).limit(pageSize),
      Brand.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      count: brands.length,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      limit: pageSize,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Brand By ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Brand
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleBrandStatus = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const newStatus = !brand.isActive;

    brand.isActive = newStatus;
    await brand.save();

    await Products.updateMany(
      { brand: brand._id },
      { $set: { isActive: newStatus } },
    );

    res.status(200).json({
      success: true,
      message: `Brand ${brand.isActive ? "activated" : "deactivated"} successfully`,
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Brand
export const permanentlyDeleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Delete all products belonging to this brand
    const deletedProducts = await Products.deleteMany({
      brand: brand._id,
    });

    // Delete brand
    await Brand.findByIdAndDelete(brand._id);

    res.status(200).json({
      success: true,
      message: "Brand and related products deleted successfully",
      deletedProductsCount: deletedProducts.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
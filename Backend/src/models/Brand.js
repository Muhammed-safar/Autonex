import cloudinary from "../config/cloudinary.js";
import Brand from "../models/Brand.js";
import Product from "../models/Products.js";

// Create Brand
export const createBrand = async (req, res) => {
  try {
    const { name, description, website, sortOrder, isFeatured } = req.body;

    const existingBrand = await Brand.findOne({
      name,
    }).collation({
      locale: "en",
      strength: 2,
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    let logoData = {
      url: null,
      publicId: null,
    };

    const logoFile = req.files?.logo?.[0];

    if (logoFile) {
      const uploadResult = await cloudinary.uploader.upload(logoFile.path, {
        folder: "brands",
        resource_type: "image",
      });

      logoData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const brand = await Brand.create({
      name,
      description,
      website,
      sortOrder,
      isFeatured,
      logo: logoData,
      createdBy: req.user.id,
    });

    res.status(201).json({
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
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const { name, description, website, sortOrder, isFeatured, isActive } =
      req.body;

    const logoFile = req.files?.logo?.[0];

    if (logoFile) {
      // Delete old logo from Cloudinary
      if (brand.logo?.publicId) {
        await cloudinary.uploader.destroy(brand.logo.publicId);
      }

      // Upload new logo
      const uploadResult = await cloudinary.uploader.upload(logoFile.path, {
        folder: "brands",
        resource_type: "image",
      });

      brand.logo = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    if (name !== undefined) brand.name = name;

    if (description !== undefined) brand.description = description;

    if (website !== undefined) brand.website = website;

    if (sortOrder !== undefined) brand.sortOrder = sortOrder;

    if (isFeatured !== undefined) brand.isFeatured = isFeatured;

    if (isActive !== undefined) brand.isActive = isActive;

    await brand.save();

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

// toggle status
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

    await Product.updateMany(
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

// delete comolete brand Items
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
    const deletedProducts = await Product.deleteMany({
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

export default {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  toggleBrandStatus,
  permanentlyDeleteBrand,
};
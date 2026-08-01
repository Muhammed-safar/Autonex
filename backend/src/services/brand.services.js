import cloudinary from "../config/cloudinary.js";
import Brand from "../models/Brand.js";
import Product from "../models/Products.js";

export const createBrand = async (req) => {
  const { name, description, website, sortOrder, isFeatured } = req.body;

  const existingBrand = await Brand.findOne({ name }).collation({
    locale: "en",
    strength: 2,
  });

  if (existingBrand) {
    throw new Error("Brand already exists");
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

  return brand;
};


export const getAllBrands = async (query) => {
  const {
    isActive,
    isFeatured,
    sortBy = "createdAt",
    order = "desc",
    search,
    page = 1,
    limit = 10,
  } = query;

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

  return {
    total,
    count: brands.length,
    currentPage: pageNumber,
    totalPages: Math.ceil(total / pageSize),
    limit: pageSize,
    data: brands,
  };
};


export const getBrandById = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  return brand;
};



export const updateBrand = async (req) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const { name, description, website, sortOrder, isFeatured, isActive } =
    req.body;

  const logoFile = req.files?.logo?.[0];

  if (logoFile) {
    // Delete old logo
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

  return brand;
};

export const toggleBrandStatus = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const newStatus = !brand.isActive;

  brand.isActive = newStatus;

  await brand.save();

  await Product.updateMany(
    {
      brand: brand._id,
    },
    {
      $set: {
        isActive: newStatus,
      },
    }
  );

  return {
    message: `Brand ${newStatus ? "activated" : "deactivated"} successfully`,
    data: brand,
  };
};


export const permanentlyDeleteBrand = async (id) => {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const deletedProducts = await Product.deleteMany({
    brand: brand._id,
  });

  await Brand.findByIdAndDelete(brand._id);

  return {
    message: "Brand and related products deleted successfully",
    deletedProductsCount: deletedProducts.deletedCount,
  };
};
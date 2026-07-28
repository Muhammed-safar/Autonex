import {
  createCategoryService,
  getAllCategoriesService,
  getActiveCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  restoreCategoryService,
} from "../services/categoryService.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.helper.js";

export const createCategory = async (req, res) => {
  let uploadedImage = null;

  try {
    let icon = "";
    let iconPublicId = "";

    if (req.files?.icon?.[0]) {
      uploadedImage = await uploadToCloudinary(
        req.files.icon[0].path,
        "categories",
      );

      icon = uploadedImage.url;
      iconPublicId = uploadedImage.publicId;
    }

    const category = await createCategoryService({
      ...req.body,
      icon,
      iconPublicId,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    // Remove uploaded Cloudinary image if DB failed
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId);
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActiveCategories = async (req, res) => {
  try {
    const categories = await getActiveCategoriesService();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  let uploadedImage = null;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Keep old image by default
    let icon = category.icon;
    let iconPublicId = category.iconPublicId;

    // Upload new image if provided
    if (req.files?.icon?.[0]) {
      uploadedImage = await uploadToCloudinary(
        req.files.icon[0].path,
        "categories",
      );

      icon = uploadedImage.url;
      iconPublicId = uploadedImage.publicId;
    }

    // Save old public id before updating
    const oldPublicId = category.iconPublicId;

    // Update database
    const updatedCategory = await updateCategoryService(req.params.id, {
      ...req.body,
      icon,
      iconPublicId,
    });

    // DB updated successfully
    // Delete old image only now
    if (
      uploadedImage &&
      oldPublicId &&
      oldPublicId !== uploadedImage.publicId
    ) {
      await deleteFromCloudinary(oldPublicId);
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    // Database failed after uploading new image
    if (uploadedImage?.publicId) {
      await deleteFromCloudinary(uploadedImage.publicId);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreCategory = async (req, res) => {
  try {
    const category = await restoreCategoryService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category restored successfully.",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

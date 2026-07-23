import {
  createCategoryService,
  getAllCategoriesService,
  getActiveCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  restoreCategoryService,
} from "../Services/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService({
      ...req.body,
      icon: req.files?.icon?.[0]?.path,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
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
  try {
    const category = await updateCategoryService(
      req.params.id,
      {
        ...req.body,
        icon: req.files?.icon?.[0]?.path,
      }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
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
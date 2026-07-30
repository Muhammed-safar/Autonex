import slugify from "slugify";
import {
  findCategoryById,
  findCategoryByName,
  findCategoryBySlug,
  findAllCategories,
  createCategory,
  saveCategory,
} from "../repositories/category.repository.js";

export const createCategoryService = async (data) => {
  const { name, description, icon, iconPublicId } = data;

  const existingCategory = await findCategoryByName(name);

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug) {
    throw new Error("Slug already exists.");
  }

  return await createCategory({
    name,
    slug,
    description,
    icon,
    iconPublicId,
  });
};

export const getAllCategoriesService = async (filters) => {
  return await findAllCategories(filters);
};

export const getActiveCategoriesService = async () => {
  return await findAllCategories({
    isActive: true,
  });
};

export const getCategoryByIdService = async (id) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

export const updateCategoryService = async (id, data) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  // Duplicate name check
  if (data.name && data.name !== category.name) {
    const existing = await findCategoryByName(data.name);

    if (existing) {
      throw new Error("Category already exists.");
    }

    data.slug = slugify(data.name, {
      lower: true,
      strict: true,
    });
  }

  return await updateCategory(id, data);
};

export const deleteCategoryService = async (id) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isActive = false;

  await saveCategory(category);

  return category;
};

export const restoreCategoryService = async (id) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isActive = true;

  await saveCategory(category);

  return category;
};

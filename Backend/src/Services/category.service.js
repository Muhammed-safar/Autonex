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
  const { name, description, image } = data;

  // Check duplicate name
  const existingCategory = await findCategoryByName(name);

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  // Generate slug
  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  // Check duplicate slug
  const existingSlug = await findCategoryBySlug(slug);

  if (existingSlug) {
    throw new Error("Slug already exists.");
  }

  const category = await createCategory({
    name,
    slug,
    description,
    image,
  });

  return category;
};




export const getAllCategoriesService = async () => {
  return await findAllCategories();
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

  // Update name
  if (data.name && data.name !== category.name) {
    const existingCategory = await findCategoryByName(data.name);

    if (existingCategory) {
      throw new Error("Category name already exists.");
    }

    category.name = data.name;

    category.slug = slugify(data.name, {
      lower: true,
      strict: true,
    });
  }

  // Update description
  if (data.description !== undefined) {
    category.description = data.description;
  }

  // Update image
  if (data.image !== undefined) {
    category.image = data.image;
  }

  // Update status
  if (data.isActive !== undefined) {
    category.isActive = data.isActive;
  }

  await saveCategory(category);

  return category;
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
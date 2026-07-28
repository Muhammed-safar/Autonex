import Category from "../models/Category.js";

// Find category by ID
export const updateCategory = (id, data) => {
  return Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Find category by name
export const findCategoryByName = (name) => {
  return Category.findOne({ name });
};

// Find category by slug
export const findCategoryBySlug = (slug) => {
  return Category.findOne({ slug });
};

// Get all categories
export const findAllCategories = (filter = {}) => {
  return Category.find(filter);
};

// Create category
export const createCategory = (data) => {
  return Category.create(data);
};

// Save updated document
export const saveCategory = (category) => {
  return category.save();
};

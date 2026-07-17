import Joi from "joi";

export const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().allow("").max(1000).optional(),

  website: Joi.string().uri().optional(),

  isFeatured: Joi.boolean().optional(),

  isActive: Joi.boolean().optional(),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  description: Joi.string().trim().allow("").max(1000),

  website: Joi.string().uri(),

  isFeatured: Joi.boolean(),

  isActive: Joi.boolean(),
}).min(1);

export const objectIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listBrandsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  search: Joi.string().trim().max(100).optional(),

  sortBy: Joi.string()
    .valid("name", "createdAt", "updatedAt")
    .default("createdAt"),

  order: Joi.string().valid("asc", "desc").default("desc"),

  isActive: Joi.boolean(),

  isFeatured: Joi.boolean(),
});
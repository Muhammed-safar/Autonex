import Joi from "joi";

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  alt: Joi.string().allow("").optional(),
});

const variantSchema = Joi.object({
  name: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  discountPrice: Joi.number().min(0).default(0),

  stock: Joi.number().integer().min(0).default(0),

  sku: Joi.string().trim().allow("").optional(),
});

const compatibleVehicleSchema = Joi.object({
  make: Joi.string().trim().required(),

  model: Joi.string().trim().required(),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
});

export const createProductValidation = Joi.object({
  name: Joi.string().trim().min(3).max(200).required(),

  description: Joi.string().allow("").optional(),

  sku: Joi.string().trim().allow("").optional(),

  price: Joi.number().min(0).required(),

  discountPrice: Joi.number().min(0).default(0),

  stock: Joi.number().integer().min(0).default(0),

  images: Joi.array()
    .items(imageSchema)
    .min(1)
    .required(),

  variants: Joi.array()
    .items(variantSchema)
    .optional(),

  compatibleVehicles: Joi.array()
    .items(compatibleVehicleSchema)
    .optional(),

  brand: Joi.string()
    .hex()
    .length(24)
    .required(),

  category: Joi.string()
    .hex()
    .length(24)
    .required(),

  isActive: Joi.boolean().optional(),

  isFeatured: Joi.boolean().optional(),
});



export const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(3).max(200),

  description: Joi.string().allow(""),

  sku: Joi.string().trim().allow(""),

  price: Joi.number().min(0),

  discountPrice: Joi.number().min(0),

  stock: Joi.number().integer().min(0),

  images: Joi.array().items(imageSchema),

  variants: Joi.array().items(variantSchema),

  compatibleVehicles: Joi.array().items(compatibleVehicleSchema),

  brand: Joi.string().hex().length(24),

  category: Joi.string().hex().length(24),

  isActive: Joi.boolean(),

  isFeatured: Joi.boolean(),
}).min(1);
import Joi from 'joi';

export const registerValidation = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  country: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileValidation = Joi.object({
  fullName: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  country: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  password: Joi.string().min(8).max(30)
});
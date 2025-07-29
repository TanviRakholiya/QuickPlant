import Joi from 'joi';

export const addressValidation = {
  createAddress: Joi.object({
    fullName: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 50 characters',
      'any.required': 'Full name is required'
    }),
    mobileNo: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be 10 digits',
      'any.required': 'Mobile number is required'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    addressLine1: Joi.string().min(5).max(100).required().messages({
      'string.empty': 'Address line 1 is required',
      'string.min': 'Address line 1 must be at least 5 characters',
      'string.max': 'Address line 1 cannot exceed 100 characters',
      'any.required': 'Address line 1 is required'
    }),
    addressLine2: Joi.string().max(100).optional().messages({
      'string.max': 'Address line 2 cannot exceed 100 characters'
    }),
    city: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 50 characters',
      'any.required': 'City is required'
    }),
    state: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'State is required',
      'string.min': 'State must be at least 2 characters',
      'string.max': 'State cannot exceed 50 characters',
      'any.required': 'State is required'
    }),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
      'string.empty': 'Pincode is required',
      'string.pattern.base': 'Pincode must be 6 digits',
      'any.required': 'Pincode is required'
    }),
    country: Joi.string().default('India'),
    isDefault: Joi.boolean().default(false),
    addressType: Joi.string().valid('home', 'office', 'other').default('home').messages({
      'any.only': 'Address type must be one of: home, office, other'
    })
  }),

  updateAddress: Joi.object({
    fullName: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 50 characters'
    }),
    mobileNo: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
      'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please enter a valid email address'
    }),
    addressLine1: Joi.string().min(5).max(100).optional().messages({
      'string.min': 'Address line 1 must be at least 5 characters',
      'string.max': 'Address line 1 cannot exceed 100 characters'
    }),
    addressLine2: Joi.string().max(100).optional().messages({
      'string.max': 'Address line 2 cannot exceed 100 characters'
    }),
    city: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 50 characters'
    }),
    state: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'State must be at least 2 characters',
      'string.max': 'State cannot exceed 50 characters'
    }),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).optional().messages({
      'string.pattern.base': 'Pincode must be 6 digits'
    }),
    country: Joi.string().optional(),
    isDefault: Joi.boolean().optional(),
    addressType: Joi.string().valid('home', 'office', 'other').optional().messages({
      'any.only': 'Address type must be one of: home, office, other'
    })
  })
}; 
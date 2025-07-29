import Joi from 'joi';

export const cartValidation = {
  addToCart: Joi.object({
    productId: Joi.string().required().messages({
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1'
    }),
    selectedSize: Joi.object({
      label: Joi.string().required(),
      price: Joi.number().required()
    }).optional()
  }),

  updateCartItem: Joi.object({
    productId: Joi.string().required().messages({
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity cannot be negative'
    }),
    selectedSize: Joi.object({
      label: Joi.string().required(),
      price: Joi.number().required()
    }).optional(),
    isSelected: Joi.boolean().optional()
  }),

  applyCoupon: Joi.object({
    couponCode: Joi.string().required().messages({
      'string.empty': 'Coupon code is required',
      'any.required': 'Coupon code is required'
    })
  }),

  placeOrder: Joi.object({
    shippingAddressId: Joi.string().required().messages({
      'string.empty': 'Shipping address is required',
      'any.required': 'Shipping address is required'
    }),
    paymentMethod: Joi.string().valid('cod', 'online', 'upi', 'card').required().messages({
      'string.empty': 'Payment method is required',
      'any.required': 'Payment method is required',
      'any.only': 'Payment method must be one of: cod, online, upi, card'
    }),
    selectedItems: Joi.array().items(Joi.string()).optional()
  })
}; 
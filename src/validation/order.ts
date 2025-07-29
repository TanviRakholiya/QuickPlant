import Joi from 'joi';

export const orderValidation = {
  updateOrderStatus: Joi.object({
    orderStatus: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned').optional().messages({
      'any.only': 'Order status must be one of: pending, confirmed, processing, shipped, delivered, cancelled, returned'
    }),
    trackingNumber: Joi.string().optional(),
    estimatedDelivery: Joi.date().optional().messages({
      'date.base': 'Estimated delivery must be a valid date'
    })
  })
}; 
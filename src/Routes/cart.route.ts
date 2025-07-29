import { Router } from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  // applyCoupon,
  // removeCoupon,
  // getCheckoutDetails,
  // placeOrder
} from '../controllers/cart';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { cartValidation } from '../validation';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// Cart operations
router.post('/add', validate(cartValidation.addToCart), addToCart);
router.get('/', getCart);
router.put('/update', validate(cartValidation.updateCartItem), updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

// // Coupon operations
// router.post('/apply-coupon', validate(cartValidation.applyCoupon), applyCoupon);
// router.delete('/remove-coupon', removeCoupon);

// // Checkout operations
// router.get('/checkout', getCheckoutDetails);
// router.post('/place-order', validate(cartValidation.placeOrder), placeOrder);

export default router; 
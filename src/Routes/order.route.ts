import { Router } from 'express';
import {
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  getOrderSummary,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order';
import { authenticate } from '../middleware/authenticate';
import { rolewise } from '../middleware/rolewise';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// User order operations
router.get('/my-orders', getUserOrders);
router.get('/summary', getOrderSummary);
router.get('/:orderId', getOrderById);
router.post('/:orderId/cancel', cancelOrder);
router.get('/:orderId/track', trackOrder);

// Admin order operations (require admin role)
router.get('/admin/all', rolewise(['SELLER', 'GARDENER']), getAllOrders);
router.put('/admin/:orderId/status', rolewise(['SELLER', 'GARDENER']), updateOrderStatus);

export default router; 
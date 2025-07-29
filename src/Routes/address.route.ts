import { Router } from 'express';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/address';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { addressValidation } from '../validation';

const router = Router();

// All address routes require authentication
router.use(authenticate);

// Address operations
router.post('/', validate(addressValidation.createAddress), createAddress);
router.get('/', getAddresses);
router.get('/:addressId', getAddressById);
router.put('/:addressId', validate(addressValidation.updateAddress), updateAddress);
router.delete('/:addressId', deleteAddress);
router.patch('/:addressId/default', setDefaultAddress);

export default router; 
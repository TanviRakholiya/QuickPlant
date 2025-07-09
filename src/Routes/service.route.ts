import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service';

import { serviceUpload } from '../middleware/uploadFile';
import { validate } from '../middleware/validate';
import { serviceValidation } from '../helper/validation';

const serviceRouter = express.Router();

// Create a new service
serviceRouter.post('/', authenticate, validate(serviceValidation.create), serviceUpload.single('image'), createService);

// Get all active services
serviceRouter.get('/', getAllServices);

// Get a single service by ID
serviceRouter.get('/id', getServiceById);

// Update a service
serviceRouter.put('/', authenticate, validate(serviceValidation.update), serviceUpload.single('image'), updateService);

// Soft delete (deactivate) a service
serviceRouter.patch('/deactivate', authenticate, validate(serviceValidation.delete), deleteService);


export default serviceRouter; 
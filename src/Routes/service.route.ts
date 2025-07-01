import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service';

import { serviceUpload } from '../middleware/uploadFile';

const serviceRouter = express.Router();

// Create a new service
serviceRouter.post('/', serviceUpload.single('image'), createService);

// Get all active services
serviceRouter.get('/', getAllServices);

// Get a single service by ID
serviceRouter.get('/:id', getServiceById);

// Update a service
serviceRouter.put('/:id', serviceUpload.single('image'), updateService);

// Soft delete (deactivate) a service
serviceRouter.patch('/:id/deactivate', deleteService);


export default serviceRouter; 
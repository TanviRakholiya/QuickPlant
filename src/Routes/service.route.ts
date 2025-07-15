import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service';
import upload from '../middleware/uploadImage';
import { validate } from '../middleware/validate';
import { serviceValidation } from '../helper/validation';

const serviceRouter = express.Router();

serviceRouter.post('/', authenticate, validate(serviceValidation.create), upload.single('image'), createService);
serviceRouter.get('/', getAllServices);
serviceRouter.get('/id', getServiceById);
serviceRouter.put('/', authenticate, validate(serviceValidation.update), upload.single('image'), updateService);
serviceRouter.delete('/', authenticate, validate(serviceValidation.delete), deleteService);

export default serviceRouter; 
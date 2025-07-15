import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service';
import { validate } from '../middleware/validate';
import { serviceValidation } from '../helper/validation';

const serviceRouter = express.Router();

serviceRouter.post('/', authenticate, validate(serviceValidation.create),  createService);
serviceRouter.get('/', getAllServices);
serviceRouter.get('/id', getServiceById);
serviceRouter.put('/', authenticate, validate(serviceValidation.update),  updateService);
serviceRouter.delete('/', authenticate, validate(serviceValidation.delete), deleteService);

export default serviceRouter; 
import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service';
<<<<<<< HEAD
=======
import upload from '../middleware/uploadImage';
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
import { validate } from '../middleware/validate';
import { serviceValidation } from '../helper/validation';

const serviceRouter = express.Router();

<<<<<<< HEAD
serviceRouter.post('/', authenticate, validate(serviceValidation.create),  createService);
serviceRouter.get('/', getAllServices);
serviceRouter.get('/id', getServiceById);
serviceRouter.put('/', authenticate, validate(serviceValidation.update),  updateService);
=======
serviceRouter.post('/', authenticate, validate(serviceValidation.create), upload.single('image'), createService);
serviceRouter.get('/', getAllServices);
serviceRouter.get('/id', getServiceById);
serviceRouter.put('/', authenticate, validate(serviceValidation.update), upload.single('image'), updateService);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
serviceRouter.delete('/', authenticate, validate(serviceValidation.delete), deleteService);

export default serviceRouter; 
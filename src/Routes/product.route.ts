import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bestsellerProducts,
  adminFeatureProduct,
  getFeaturedProducts
} from '../controllers/product';
import upload from '../middleware/uploadImage';
import { validate } from '../middleware/validate';
import { productValidation } from '../helper/validation';
import { rolewise } from '../middleware/rolewise';

const productRouter = express.Router();

productRouter.post('/', authenticate, validate(productValidation.productCreate), createProduct); // up to 5 images
productRouter.get('/all', getAllProducts); // POST for body data
productRouter.get('/id', getProductById); // expects { id: "..." } in body
productRouter.put('/', authenticate, validate(productValidation.productUpdate), updateProduct);
productRouter.delete('/', authenticate, validate(productValidation.productDelete), deleteProduct);
productRouter.get('/bestsellers', bestsellerProducts);
productRouter.put('/:id/feature', authenticate, validate(productValidation.productFeature), adminFeatureProduct);
productRouter.get('/featured', getFeaturedProducts);

export default productRouter; 
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
import { productUpload } from '../middleware/uploadFile';
import { validate } from '../middleware/validate';
import { productValidation } from '../helper/validation';
import { rolewise } from '../middleware/rolewise';

const productRouter = express.Router();

productRouter.post('/', authenticate, validate(productValidation.productCreate), productUpload.array('images', 5), createProduct); // up to 5 images
productRouter.get('/all',authenticate,rolewise(["CUSTOMER","SELLER"]), getAllProducts); // POST for body data
productRouter.get('/id', getProductById); // expects { id: "..." } in body
productRouter.put('/', authenticate, validate(productValidation.productUpdate), productUpload.array('images', 5), updateProduct);
productRouter.delete('/', authenticate, validate(productValidation.productDelete), deleteProduct);
productRouter.get('/bestsellers', bestsellerProducts);
productRouter.put('/:id/feature', authenticate, validate(productValidation.productFeature), adminFeatureProduct);
productRouter.get('/featured', getFeaturedProducts);

export default productRouter; 
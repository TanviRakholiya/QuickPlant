import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product';
import { productUpload } from '../middleware/uploadFile';

const productRouter = express.Router();

productRouter.post('/', productUpload.array('images', 5), createProduct); // up to 5 images
productRouter.get('/all', getAllProducts); // POST for body data
productRouter.get('/id', getProductById); // expects { id: "..." } in body
productRouter.put('/:id', productUpload.array('images', 5), updateProduct);
productRouter.delete('/', deleteProduct);

export default productRouter; 
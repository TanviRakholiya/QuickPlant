import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category';
import uploadImage from '../middleware/uploadImage';
import { validate } from '../middleware/validate';
import { categoryValidation } from '../helper/validation';

const categoryRouter = express.Router();

// All routes require auth
categoryRouter.post('/', authenticate, validate(categoryValidation.create), uploadImage.single('image'), createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/', authenticate, validate(categoryValidation.update), uploadImage.single('image'), updateCategory);
categoryRouter.delete('/', authenticate, validate(categoryValidation.delete), deleteCategory);

export default categoryRouter;

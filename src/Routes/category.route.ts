import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category'
import { categoryUpload } from '../middleware/uploadFile';
import { validate } from '../middleware/validate';
import { categoryValidation } from '../helper/validation';

const categoryRouter = express.Router();

// All routes require auth
categoryRouter.post('/', authenticate, validate(categoryValidation.create), categoryUpload.single('image'), createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/:id', authenticate, validate(categoryValidation.update), categoryUpload.single('image'), updateCategory);
categoryRouter.delete('/:id', authenticate, validate(categoryValidation.delete), deleteCategory);

export default categoryRouter;

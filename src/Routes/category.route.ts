import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category';
import { validate } from '../middleware/validate';
import { categoryValidation } from '../helper/validation';

const categoryRouter = express.Router();

// All routes require auth
categoryRouter.post('/', authenticate, validate(categoryValidation.create),  createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/', authenticate, validate(categoryValidation.update),  updateCategory);
categoryRouter.delete('/', authenticate, validate(categoryValidation.delete), deleteCategory);

export default categoryRouter;

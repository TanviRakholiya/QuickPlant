import express from 'express';
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category'
import { categoryUpload } from '../middleware/uploadFile';

const categoryRouter = express.Router();

// All routes require auth
categoryRouter.post('/', categoryUpload.single('image'), createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/', categoryUpload.single('image'), updateCategory);
categoryRouter.delete('/', deleteCategory);

export default categoryRouter;

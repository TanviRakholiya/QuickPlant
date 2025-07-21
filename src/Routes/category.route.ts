import express from 'express';
import { authenticate } from '../middleware/authenticate';
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category';
<<<<<<< HEAD
=======
import upload from '../middleware/uploadImage';
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
import { validate } from '../middleware/validate';
import { categoryValidation } from '../helper/validation';

const categoryRouter = express.Router();

// All routes require auth
<<<<<<< HEAD
categoryRouter.post('/', authenticate, validate(categoryValidation.create),  createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/', authenticate, validate(categoryValidation.update),  updateCategory);
=======
categoryRouter.post('/', authenticate, validate(categoryValidation.create), upload.single('image'), createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/id', getCategoryById);
categoryRouter.put('/', authenticate, validate(categoryValidation.update), upload.single('image'), updateCategory);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
categoryRouter.delete('/', authenticate, validate(categoryValidation.delete), deleteCategory);

export default categoryRouter;

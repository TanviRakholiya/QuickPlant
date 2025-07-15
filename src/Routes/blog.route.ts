import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getHomeBlogSection,
  deleteBlog
} from '../controllers/blog';
import { authenticate } from '../middleware/authenticate';
import uploadImage from '../middleware/uploadImage';

const blogRouter = Router();

// Create a new blog (with image upload, authentication required)
blogRouter.post('/', authenticate, uploadImage.single('image'), createBlog);

// Get all blogs (with pagination, search, etc.)
blogRouter.get('/', getAllBlogs);

// Get featured + recent blogs for homepage
blogRouter.get('/home-section', getHomeBlogSection);

// Soft delete a blog (authentication required)
blogRouter.delete('/', authenticate, deleteBlog);

export default blogRouter; 
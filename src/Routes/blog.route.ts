import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getHomeBlogSection,
  deleteBlog
} from '../controllers/blog';
import { authenticate } from '../middleware/authenticate';
<<<<<<< HEAD
const blogRouter = Router();

// Create a new blog (with image upload, authentication required)
blogRouter.post('/', authenticate, createBlog);
=======
import upload from '../middleware/uploadImage';

const blogRouter = Router();

// Create a new blog (with image upload, authentication required)
blogRouter.post('/', authenticate, upload.single('image'), createBlog);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c

// Get all blogs (with pagination, search, etc.)
blogRouter.get('/', getAllBlogs);

// Get featured + recent blogs for homepage
blogRouter.get('/home-section', getHomeBlogSection);

// Soft delete a blog (authentication required)
blogRouter.delete('/', authenticate, deleteBlog);

export default blogRouter; 
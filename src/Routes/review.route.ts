import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} from '../controllers/review';
import { reviewUpload } from '../middleware/uploadFile';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { reviewValidation } from '../helper/validation';

const reviewRouter = express.Router();

// Create a new review (with photo upload)
reviewRouter.post('/', authenticate, validate(reviewValidation.create), reviewUpload.single('photo'), createReview);

// Get all reviews with pagination and filtering
reviewRouter.get('/', getAllReviews);

// Get a review by ID
reviewRouter.get('/:id', getReviewById);

// Update a review (with photo upload)
reviewRouter.put('/:id', authenticate, validate(reviewValidation.update), reviewUpload.single('photo'), updateReview);

// Delete a review
reviewRouter.delete('/:id', authenticate, validate(reviewValidation.delete), deleteReview);

export default reviewRouter;
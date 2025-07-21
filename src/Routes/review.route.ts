import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} from '../controllers/review';
<<<<<<< HEAD
=======
import upload from '../middleware/uploadImage';
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { reviewValidation } from '../helper/validation';

const reviewRouter = express.Router();

// Create a new review (with photo upload)
<<<<<<< HEAD
reviewRouter.post('/', authenticate, validate(reviewValidation.create), createReview);
=======
reviewRouter.post('/', authenticate, validate(reviewValidation.create), upload.single('photo'), createReview);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c

// Get all reviews with pagination and filtering
reviewRouter.get('/', getAllReviews);

// Get a review by ID
reviewRouter.get('/:id', getReviewById);

// Update a review (with photo upload)
<<<<<<< HEAD
reviewRouter.put('/:id', authenticate, validate(reviewValidation.update), updateReview);
=======
reviewRouter.put('/:id', authenticate, validate(reviewValidation.update), upload.single('photo'), updateReview);
>>>>>>> fbc9e08dc2f802f52f698c1548b2506ef6275f5c

// Delete a review
reviewRouter.delete('/:id', authenticate, validate(reviewValidation.delete), deleteReview);

export default reviewRouter;
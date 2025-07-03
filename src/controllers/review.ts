import { Request, Response } from 'express';
import { Review } from '../database/models/review';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// CREATE REVIEW
export const createReview = async (req: Request, res: Response) => {
  try {
    // Get photo path if uploaded
    const photo = req.file ? `/uploads/reviews/${req.file.filename}` : undefined;

    // Create new review
    const review = new Review({
      name: req.body.name,
      email: req.body.email,
      productOrService: req.body.productOrService,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
      photo,
      createdBy: req.user?._id, // If authenticated
      userType: req.user?.userType // Attach userType from JWT
    });

    await review.save();

    return res.status(201).json(new apiResponse(201, 'Review submitted successfully', { data: review }, {}));
  } catch (error: any) {       
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET ALL REVIEWS
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      productOrService,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userType // <-- Add userType from body
    } = req.body;

    const query: any = { isDeleted: false };

    if (productOrService) query.productOrService = productOrService;
    if (rating) query.rating = Number(rating);
    if (userType) query.userType = userType; // Filter by userType if present

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const reviews = await Review.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sort);

    const total = await Review.countDocuments(query);

    return res.status(200).json(new apiResponse(200, 'Reviews fetched successfully', {
      data: {
        reviews,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
      }
    }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET REVIEW BY ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, isDeleted: false });

    if (!review) {
      return res.status(404).json(new apiResponse(404, 'Review not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Review fetched successfully', { data: review }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// UPDATE REVIEW
export const updateReview = async (req: Request, res: Response) => {
  try {
    // Get photo path if uploaded
    const updateData: any = { ...req.body };
    
    if (req.file) {
      updateData.photo = `/uploads/reviews/${req.file.filename}`;
    }

    // Add updatedBy if authenticated
    if (req.user?._id) {
      updateData.updatedBy = req.user._id;
    }

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json(new apiResponse(404, 'Review not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Review updated successfully', { data: review }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// DELETE REVIEW (Soft Delete)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { 
        isDeleted: true,
        updatedBy: req.user?._id // If authenticated
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json(new apiResponse(404, 'Review not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Review deleted successfully', { data: review }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};
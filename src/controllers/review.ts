import { Request, Response } from 'express';
import { Review } from '../database/models/review';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// CREATE REVIEW
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      productOrService,
      rating,
      reviewText,
      image // coming from body, not file
    } = req.body;

    const review = new Review({
      name,
      email,
      productOrService,
      rating,
      reviewText,
      image: typeof image === "string" ? image : "",
      createdBy: req.user?._id,
      userType: req.user?.userType
    });

    await review.save();

    return res.status(201).json(
      new apiResponse(201, "Review submitted successfully", { data: review }, {})
    );
  } catch (error: any) {
    console.error("Create Review Error:", error);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
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
        totalPages: Math.ceil(total /  Number(limit)),
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
    const { id } = req.params;

    const updateData: any = {
      ...req.body,
      updatedBy: req.user?._id
    };

    // If `photo` is a valid string, assign it
    if (typeof req.body.image === "string" && req.body.image.trim() !== "") {
      updateData.image = req.body.image;
    }

    const review = await Review.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json(new apiResponse(404, "Review not found", {}, {}));
    }

    return res.status(200).json(new apiResponse(200, "Review updated successfully", { data: review }, {}));
  } catch (error: any) {
    console.error("Update Review Error:", error);
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
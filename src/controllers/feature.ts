import { Request, Response } from 'express';
import { apiResponse } from '../common';
import { Feature } from '../database/models/feature';
import { responseMessage } from '../helper';

// CREATE
export const createFeature = async (req: Request, res: Response) => {
  try {
    const imagePath = req.file ? `/uploads/features/${req.file.filename}` : null;

    const feature = new Feature({
      ...req.body,
      image: imagePath,
    });

    await feature.save();

    res.status(201).json(new apiResponse(201, 'Feature created successfully', { data: feature }, {}));
  } catch (error) {
    console.error('Feature save error:', error);
    res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET ALL
export const getFeatures = async (req: Request, res: Response) => {
  try {
    let features: any;

    if (['ABOUT', 'CUSTOMERPAGE', 'SELLERPAGE', 'GARDENERPAGE'].includes(req.body.page)) {
      features = await Feature.find({ isDeleted: false, page: req.body.page });
    } else {
      features = await Feature.find({ isDeleted: false });
    }

    res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('feature'), { data: features }, {}));
  } catch (error) {
    res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// UPDATE
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.body.id, req.body, { new: true });

    if (!feature) {
      return res.status(404).json(new apiResponse(404, 'Feature not found', {}, {}));
    }

    res.status(200).json(new apiResponse(200, 'Feature updated successfully', { data: feature }, {}));
  } catch (error) {
    res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// DELETE (soft delete)
export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.body.id, { isDeleted: true }, { new: true });

    if (!feature) {
      return res.status(404).json(new apiResponse(404, 'Feature not found', {}, {}));
    }

    res.status(200).json(new apiResponse(200, 'Feature deleted successfully', { data: feature }, {}));
  } catch (error) {
    res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

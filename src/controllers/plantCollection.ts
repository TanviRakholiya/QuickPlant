import { Request, Response } from 'express';
import { PlantCollection } from '../database/models/plantCollection';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// Admin: Upload plant image
export const adminUploadPlantImage = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.userType !== 'ADMIN') {
      return res.status(403).json(new apiResponse(403, responseMessage?.accessDenied || 'Access denied', {}, {}));
    }
    if (!req.file) {
      return res.status(400).json(new apiResponse(400, 'Image is required', {}, {}));
    }
    const imagePath = `/uploads/plant-collection/${req.file.filename}`;
    const { title } = req.body;
    const plant = new PlantCollection({
      image: imagePath,
      title,
      createdBy: req.user._id
    });
    await plant.save();
    return res.status(201).json(new apiResponse(201, 'Plant image uploaded successfully', { data: plant }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Public: Get all plant images
export const getPlantCollection = async (req: Request, res: Response) => {
  try {
    const plants = await PlantCollection.find().sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, 'Plant collection fetched successfully', { data: plants }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
}; 
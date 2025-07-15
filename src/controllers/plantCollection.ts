import { Request, Response } from 'express';
import { PlantCollection } from '../database/models/plantCollection';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// Admin: Upload plant image
export const UploadPlantImage = async (req: Request, res: Response) => {
  try {
    const image = typeof req.body.image === "string" ? req.body.image : null;

    if (!image) {
      return res.status(400).json(new apiResponse(400, "Image is required", {}, {}));
    }

    const userId = req.user?.id || req.user?._id;

    const plant = new PlantCollection({
      image,
      createdBy: userId,
      updatedBy: userId,
      uploadedBy: userId
    });

    await plant.save();

    return res.status(201).json(
      new apiResponse(201, "Plant image uploaded successfully", { data: plant }, {})
    );
  } catch (error: any) {
    console.error("UploadPlantImage error:", error);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
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
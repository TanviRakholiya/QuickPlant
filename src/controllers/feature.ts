import { Request, Response } from 'express';
import { apiResponse } from '../common';
import { Feature } from '../database/models/feature';
import { responseMessage } from '../helper';

// CREATE
export const createFeature = async (req: Request, res: Response) => {
  try {
    const { image, ...rest } = req.body;

    const feature = new Feature({
      ...rest,
      image: typeof image === "string" ? image : "",
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    });

    await feature.save();

    return res.status(201).json(
      new apiResponse(201, "Feature created successfully", { data: feature }, {})
    );
  } catch (error) {
    
    console.error("Feature save error:", error);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// GET ALL
export const getFeatures = async (req: Request, res: Response) => {
  try {
    let features: any;

    if (['ABOUTPAGE', 'CUSTOMERPAGE', 'SELLERPAGE', 'GARDENERPAGE'].includes(req.query.page)) {
      features = await Feature.find({ isDeleted: false, page: req.query.page });
    } else {
      features = await Feature.find({ isDeleted: false });
    }

    res.status(200).json(new apiResponse(200, responseMessage.getDataSuccess('feature'),  features , {}));
  } catch (error) {
    console.log(error)
    res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// UPDATE
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const { id, image, ...rest } = req.body;

    const updateData: any = {
      ...rest,
      updatedBy: req.user?.id
    };

    if (typeof image === "string" && image.trim() !== "") {
      updateData.image = image;
    }

    const feature = await Feature.findByIdAndUpdate(id, updateData, { new: true });

    if (!feature) {
      return res
        .status(404)
        .json(new apiResponse(404, "Feature not found", {}, {}));
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Feature updated successfully", { data: feature }, {}));
  } catch (error) {
    console.error("Update Feature Error:", error);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage.internalServerError, {}, error));
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

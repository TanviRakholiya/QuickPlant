import { Request, Response } from 'express';
import { Service } from '../database/models/service';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// GET all active services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json(new apiResponse(200, 'Services fetched successfully', { services }, {}));
  } catch (err) {
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};

// GET a single service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findOne({ _id: req.body.id, isActive: true });
    if (!service) return res.status(404).json(new apiResponse(404, 'Service not found', {}, 'Not found'));
    res.status(200).json(new apiResponse(200, 'Service fetched successfully', { service }, {}));
  } catch (err) {
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};

// CREATE a new service with image upload
export const createService = async (req: Request, res: Response) => {
  try {
    const imagePath = typeof req.body.image === "string" ? req.body.image : null;

    const service = new Service({
      ...req.body,
      image: imagePath,
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    });

    await service.save();

    return res.status(201).json(
      new apiResponse(201, "Service created successfully", { service }, {})
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json(
        new apiResponse(400, "Service name already exists.", {}, err)
      );
    }

    return res.status(400).json(
      new apiResponse(400, "Failed to create service", {}, err.message)
    );
  }
};
// UPDATE an existing service with image upload
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id, image, ...rest } = req.body;

    const updateData: any = {
      ...rest,
      updatedBy: req.user?.id
    };

    if (typeof image === "string" && image.trim() !== "") {
      updateData.image = image;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });

    if (!service) {
      return res.status(404).json(new apiResponse(404, "Service not found", {}, "Not found"));
    }

    return res.status(200).json( 
      new apiResponse(200, "Service updated successfully", { service }, {})
    );
  } catch (err: any) {
    console.error("Update Service Error:", err);
    return res.status(400).json(
      new apiResponse(400, "Failed to update service", {}, err.message)
    );
  }
};

// SOFT DELETE (deactivate) a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.body.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json(new apiResponse(404, 'Service not found', {}, 'Not found'));
    res.status(200).json(new apiResponse(200, 'Service deactivated', { service }, {}));
  } catch (err) {
    res.status(500).json(new apiResponse(500, 'Server error', {}, err));
  }
};


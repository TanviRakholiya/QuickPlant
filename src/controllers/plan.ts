import { Request, Response } from 'express';
import { Plan } from '../database/models/plan';
import { responseMessage } from '../helper';
import { apiResponse } from '../common';

// GET ALL ACTIVE PLANS
export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find({ isActive: true, isDeleted: false });
    return res.status(200).json(new apiResponse(200, 'Plans fetched successfully', { data: plans }, {}));
  } catch (err) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, err));
  }
};

// GET ONE PLAN
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: false });
    if (!plan) {
      return res.status(404).json(new apiResponse(404, 'Plan not found', {}, {}));
    }
    return res.status(200).json(new apiResponse(200, 'Plan fetched successfully', { data: plan }, {}));
  } catch (err) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, err));
  }
};

// CREATE PLAN
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingPlan = await Plan.findOne({ name, isDeleted: false });
    if (existingPlan) {
      return res.status(400).json(new apiResponse(400, 'Plan with this name already exists', {}, {}));
    }

    const plan = new Plan({
      ...req.body,
      createdBy: req.user && req.user.id ? req.user.id : undefined,
      updatedBy: req.user && req.user.id ? req.user.id : undefined
    });
    await plan.save();

    return res.status(201).json(new apiResponse(201, 'Plan created successfully', { data: plan }, {}));
  } catch (err) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, err));
  }
};

// UPDATE PLAN
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (req.user && req.user.id) {
      updateData.updatedBy = req.user.id;
    }
    const plan = await Plan.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!plan || plan.isDeleted) {
      return res.status(404).json(new apiResponse(404, 'Plan not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Plan updated successfully', { data: plan }, {}));
  } catch (err) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, err));
  }
};

// DEACTIVATE PLAN (Soft Disable)
export const deactivatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

    if (!plan || plan.isDeleted) {
      return res.status(404).json(new apiResponse(404, 'Plan not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Plan deactivated successfully', { data: plan }, {}));
  } catch (err) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, err));
  }
};

// DELETE PLAN (Soft Delete)
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!plan) {
      return res.status(404).json(new apiResponse(404, 'Plan not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Plan deleted successfully', { data: plan }, {}));
  } catch (error) {
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};



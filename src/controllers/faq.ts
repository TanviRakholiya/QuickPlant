import { Request, Response } from 'express';
import { Faq } from '../database/models/faq';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

export const createFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, isActive } = req.body;
    const faq = new Faq({ question, answer, isActive });
    await faq.save();
    return res.status(201).json(new apiResponse(201, 'FAQ created successfully', { data: faq }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, 'Failed to create FAQ', {}, error.message));
  }
};

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await Faq.find();
    return res.status(200).json(new apiResponse(200, 'FAQs fetched successfully', { data: faqs }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, 'Failed to fetch FAQs', {}, error.message));
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;
    const faq = await Faq.findByIdAndUpdate(id, { question, answer, isActive }, { new: true });
    if (!faq) {
      return res.status(404).json(new apiResponse(404, 'FAQ not found', {}, {}));
    }
    return res.status(200).json(new apiResponse(200, 'FAQ updated successfully', { data: faq }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, 'Failed to update FAQ', {}, error.message));
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json(new apiResponse(404, 'FAQ not found', {}, {}));
    }
    return res.status(200).json(new apiResponse(200, 'FAQ deleted successfully', { data: faq }, {}));
  } catch (error: any) {
    return res.status(500).json(new apiResponse(500, 'Failed to delete FAQ', {}, error.message));
  }
}; 
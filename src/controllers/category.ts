import { Request, Response } from 'express';
import { categoriesModel } from '../database/models/category';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';
import { error } from 'console';

// CREATE
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { type, name, image } = req.body;

    const newCategoryData: any = {
      type,
      name,
      image: typeof image === "string" ? image : "",
      createdBy: req.user?.id,
      updatedBy: req.user?.id
    };

    const newCategory = new categoriesModel(newCategoryData);
    await newCategory.save();

    return res.status(201).json(
      new apiResponse(201, "Category created", { data: newCategory }, {})
    );
  } catch (err) {
    console.error("Create Category Error:", err);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};

 
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    let categories: any;
    const type = req.query.type as string;

    if (['SERVICE', 'WORK', 'PLANT'].includes(type)) {
      categories = await categoriesModel.find({ isDeleted: false, type });
    } else {
      categories = await categoriesModel.find({ isDeleted: false });
    }

    res.status(200).json(new apiResponse(200, 'Category list fetched', { data: categories }, {}));
  } catch (err) {
    console.log(err);
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};


// GET ONE
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoriesModel.findOne({ _id: req.body.id, isDeleted: false });

    if (!category) {
      return res.status(404).json(new apiResponse(404, 'Category not found', {}, {}));
    }

    res.status(200).json(new apiResponse(200, 'Category fetched', { data: category }, {}));
  } catch (err) {
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id, name, type, image } = req.body;

    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (type) updatedData.type = type;
    if (typeof image === "string" && image.trim() !== "") {
      updatedData.image = image;
    }
    if (req.user?.id) {
      updatedData.updatedBy = req.user.id;
    }

    const updated = await categoriesModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json(new apiResponse(404, "Category not found or already deleted", {}, {}));
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Category updated", { data: updated }, {}));
  } catch (err) {
    console.error("Update Category Error:", err);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};
// DELETE (Soft Delete)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await categoriesModel.findOneAndUpdate(
      { _id: req.body.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json(new apiResponse(404, 'Category not found or already deleted', {}, {}));
    }

    res.status(200).json(new apiResponse(200, 'Category deleted successfully', { data: deleted }, {}));
  } catch (err) {
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, err));
  }
};

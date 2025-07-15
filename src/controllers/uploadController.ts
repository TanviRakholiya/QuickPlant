import { Request, Response } from "express";
import { apiResponse } from "../common";
import { responseMessage } from "../helper";
import type { Express } from "express";

export const upload_image = async (req: Request, res: Response) => {
  try {
    const allowedSubfolders = [
      "auth",
      "plant-category",
      "service",
      "feature-icon",
      "review",
      "plant-collection",
      "blog"
    ];

    const file = req.file;
    const subfolder = req.query.subfolder as string;


    if (!subfolder || !allowedSubfolders.includes(subfolder)) {
      return res
        .status(400)
        .json(new apiResponse(400, "Invalid or missing subfolder", {}, {}));
    }

    if (!file) {
      return res
        .status(400)
        .json(new apiResponse(400, "No file uploaded. Please try again.", {}, {}));
    }

    const imageUrl = `/Image/${subfolder}/${file.filename}`;

    return res.status(200).json(
      new apiResponse(200, "Image has been uploaded successfully!", { imageUrl }, {})
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
  }
};


export const upload_multiple_images = async (req: Request, res: Response) => {
  try {
    const allowedSubfolders = [
      "product",
    ];

    const subfolder = req.query.subfolder as string;
    const files = req.files as Express.Multer.File[];

    if (!subfolder || !allowedSubfolders.includes(subfolder)) {
      return res.status(400).json(new apiResponse(400, "Invalid or missing subfolder", {}, {}));
    }

    if (!files || files.length === 0) {
      return res.status(400).json(new apiResponse(400, "No files uploaded", {}, {}));
    }

    const imageUrls = files.map(file => `/Image/${subfolder}/${file.filename}`);

    return res.status(200).json(
      new apiResponse(200, "Images uploaded successfully!", { imageUrls }, {})
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

import { Request, Response } from "express";
import { apiResponse } from "../common";
import { responseMessage } from "../helper";

export const upload_image = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (file) {
      const imageUrl = `/Image/uploads/${file.filename}`;
      return res.status(200).json(new apiResponse(200, "Image has been uploaded successfully!", { imageUrl }, {}));
    } else {
      return res.status(400).json(new apiResponse(400, "No file uploaded. Please try again.", {}, {}));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
  }
}; 
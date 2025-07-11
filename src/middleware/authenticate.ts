import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiResponse } from "../common";
import { responseMessage } from "../helper";
import { userModel } from "../database";

const secretKey = process.env.JWT_TOKEN_SECRET;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json(new apiResponse(401, responseMessage?.tokenNotFound, {}, {})); 
    }

    const decoded: any = jwt.verify(token, secretKey);

    const user = await userModel.findById(decoded.id);
    if (!user || user.isDeleted) {
      return res.status(404).json(new apiResponse(404, responseMessage?.userNotFound, {}, {}));
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json(new apiResponse(401, responseMessage?.unauthorized, {}, error));
  }
};

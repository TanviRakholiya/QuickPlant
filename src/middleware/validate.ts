import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../common';

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false
        });

        if (error) {
            const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
            return res.status(400).json(new apiResponse(400, errorMessage, {}, {}));
        }

        next();
    };
};  
import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../common';

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Robustly handle typeofPlant as array before validation
        if (req.body && req.body.typeofPlant && typeof req.body.typeofPlant === 'string') {
            try {
                const parsed = JSON.parse(req.body.typeofPlant);
                req.body.typeofPlant = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                req.body.typeofPlant = [req.body.typeofPlant];
            }
        }

        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
            return res.status(400).json(new apiResponse(400, errorMessage, {}, {}));
        }

        next();
    };
}; 
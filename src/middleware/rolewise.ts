import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../common';

export function rolewise(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.userType)) {
      return res.status(403).json(new apiResponse(
        403,
        `Access denied: only [${allowedRoles.join(', ')}] can access this route. Your userType: ${req.user?.userType ?? 'unknown'}`,
        {},
        {}
      ));
    }
    next();
  };
} 
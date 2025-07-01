declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email?: string;
      mobileNo?: string;
      userType: number;
    };
  }
} 
import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authValidation } from '../helper/validation';
import {
  otpSent,
  otp_verification,
  register,
  login,  
  forgot_password,
  reset_password,
  adminSignUp,
  adminLogin
} from '../controllers/auth';
import { authenticate } from '../middleware/authenticate';

const authrouter = Router();

authrouter.post('/sent-otp', validate(authValidation.otpSent), otpSent);
authrouter.post('/otp-verification', validate(authValidation.otpVerification), otp_verification);
authrouter.post('/register', authenticate,validate(authValidation.register), register);
authrouter.post('/login', validate(authValidation.login), login);
authrouter.post('/forgot-password', validate(authValidation.forgotPassword), forgot_password);
authrouter.post('/reset-password', validate(authValidation.resetPassword), reset_password);
authrouter.post('/admin/signup', validate(authValidation.adminSignUp), adminSignUp);
authrouter.post('/admin/login', validate(authValidation.adminLogin), adminLogin);


export default authrouter; 
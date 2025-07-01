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
} from '../controllers/Auth/auth'
import { authenticate } from '../middleware/authenticate';
import upload from '../middleware/uploadFile';
import { authUpload } from '../middleware/uploadFile';

const authrouter = Router();

authrouter.post('/sent-otp', validate(authValidation.otpSent), otpSent);
authrouter.post('/otp-verification', validate(authValidation.otpVerification), otp_verification);
authrouter.post('/register', authenticate, authUpload.single('photo'), validate(authValidation.register), register);
authrouter.post('/login', validate(authValidation.login), login);
authrouter.post('/forgot-password', validate(authValidation.forgotPassword), forgot_password);
authrouter.post('/reset-password', validate(authValidation.resetPassword), reset_password);
authrouter.post('/admin/signup', validate(authValidation.adminSignUp), adminSignUp);
authrouter.post('/admin/login', validate(authValidation.adminLogin), adminLogin);


export default authrouter;
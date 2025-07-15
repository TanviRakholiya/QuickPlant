"use strict"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { userModel } from '../database'
import { apiResponse } from '../common'
import {
    email_verification_mail,
    otp_verification_sms, // Commented out Twilio SMS
    responseMessage,
} from '../helper'
import { config } from '../../config'
import { sendSMS } from '../helper/aws_sns'
import mongoose from 'mongoose'; // Ensure this is at the top

const ObjectId = require('mongoose').Types.ObjectId
const jwt_token_secret = config.JWT_TOKEN_SECRET

const secretKey = process.env.JWT_TOKEN_SECRET;

export const otpSent = async (req: Request, res: Response) => {
    try {
        const { fullName, email, mobileNo, userType } = req.body;

        if (!fullName || !userType || (!email && !mobileNo)) {
            return res.status(400).json(new apiResponse(400, "Missing required fields", {}, {}));
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        let user;
        if (email) user = await userModel.findOne({ email });
        else if (mobileNo) user = await userModel.findOne({ mobileNo });

        if (user) {
            if (user?.isVerified && user?.password) {
                return res.status(409).json(new apiResponse(409, responseMessage?.alreadyRegister, {}, {}));
            }

            user.otp = otp;
            user.otpExpireTime = otpExpireTime;
            user.fullName = fullName || user.fullName;
            user.userType = userType || user.userType;

            // Do NOT assign anything from req.body directly
            await user.save();
        } else {
            // Create only with safe fields
            const userData: any = {
                fullName,
                userType,
                otp,
                otpExpireTime,
                isVerified: false,
            };
            if (email) userData.email = email;
            if (mobileNo) userData.mobileNo = mobileNo;

            user = await userModel.create(userData);
        }

        const payload = {
            email: user.email,
            mobileNo: user.mobileNo,
            userType: user.userType,
            otp: user.otp,
            otpExpireTime: user.otpExpireTime
        };

        const token = jwt.sign(payload, secretKey, { expiresIn: "10m" });

        let result;
        if (mobileNo) {
            // result = await sendSMS('91', mobileNo, otp.toString(), fullName);
        } else if (email) {
            result = await email_verification_mail({ email, fullName }, otp);
        }

        // if (!result) {
        //     return res.status(501).json(new apiResponse(501, responseMessage.errorMail, {}, `${result}`));
        // }

        return res.status(200).json(new apiResponse(200, responseMessage?.otpSentSuccessfully, { token }, {}));
    } catch (error) {
        console.error('OTP sent error:', error);
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};


export const otp_verification = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json(new apiResponse(401, responseMessage?.tokenNotFound, {}, {}));

        const decoded: any = jwt.verify(token, secretKey);
        const { email, mobileNo } = decoded;

        // Check for user by email if present, otherwise by mobileNo
        let user;
        if (email) {
            user = await userModel.findOne({ email });
        } else if (mobileNo) {
            user = await userModel.findOne({ mobileNo });
        }
        if (!user) return res.status(404).json(new apiResponse(404, responseMessage?.userNotFound, {}, {}));

        if (user?.isVerified && user?.password) {
            return res.status(200).json(new apiResponse(200, responseMessage?.alreadyRegister, {}, {}));
        }

        // Developer override: allow 123456 as valid OTP
        const isDevOtp = otp === 123456;

        if (!isDevOtp && user.otp !== otp) { 
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP, {}, {}));
        }

        if (!isDevOtp && new Date() > user.otpExpireTime) {
            return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}));
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpireTime = undefined;
        await user.save();

        const payload: any = {
            id: user._id,
            userType: user.userType
        };

        const verifiedToken = jwt.sign(payload, secretKey);
        return res.status(200).json(new apiResponse(200, responseMessage?.OTPverified, { token: verifiedToken }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { id, userType } = req.user;

    const existingUser = await userModel.findById(id);
    if (!existingUser || !existingUser.isVerified) {
      return res
        .status(403)
        .json(new apiResponse(403, "OTP verification required", {}, {}));
    }

    // ✅ Use image URL from req.body.image (uploaded separately)
    const uploadedPhoto = typeof req.body.image === "string" ? req.body.image : null;
    console.log("Uploaded photo URL:", uploadedPhoto);

    // ✅ Hash the password
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    // ✅ Build update data
    const updateData: any = {
      ...req.body,
      password: hashedPassword,
      createdBy: existingUser._id,
      updatedBy: existingUser._id,
      isVerified: true,
    };

    // ❌ Remove image from body (we’re controlling it via uploadedPhoto)
    delete updateData.image;

    // ✅ Handle typeofPlant for SELLER only
    if (existingUser.userType === "SELLER" && req.body.typeofPlant) {
      try {
        let tp = req.body.typeofPlant;
        if (typeof tp === "string") tp = JSON.parse(tp);
        updateData.typeofPlant = Array.isArray(tp)
          ? tp.map((id: any) => new mongoose.Types.ObjectId(id))
          : [new mongoose.Types.ObjectId(tp)];
      } catch (err) {
        console.warn("Invalid typeofPlant format. Skipping typeofPlant field.");
      }
    } else {
      delete updateData.typeofPlant;
    }

    // ✅ Handle workCategory for GARDENER only
    if (existingUser.userType === "GARDENER" && req.body.workCategory) {
      try {
        let wc = req.body.workCategory;
        if (typeof wc === "string") wc = JSON.parse(wc);
        updateData.workCategory = Array.isArray(wc)
          ? wc.map((id: any) => new mongoose.Types.ObjectId(id))
          : [new mongoose.Types.ObjectId(wc)];
      } catch (err) {
        console.warn("Invalid workCategory format. Skipping workCategory field.");
      }
    } else {
      delete updateData.workCategory;
    }

    // ✅ Attach uploaded image URL
    if (uploadedPhoto) {
      updateData.image = uploadedPhoto;
    }

    // ✅ Save updated user
    existingUser.set(updateData);
    await existingUser.save();

    // ✅ Generate token
    const payload = { id: existingUser._id, userType };
    const finalToken = jwt.sign(payload, secretKey);

    const userObj = existingUser.toObject();
    if (userObj.userType !== "SELLER") {
      delete userObj.typeofPlant;
    }

    return res.status(200).json(
      new apiResponse(
        200,
        responseMessage?.registerSuccess,
        { token: finalToken, user: userObj },
        {}
      )
    );
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json(
      new apiResponse(500, responseMessage.internalServerError, {}, error)
    );
  }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, mobileNo, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ email }, { mobileNo }]
        });

        if (!user || !user.isVerified || !user.password) {
            return res.status(404).json(new apiResponse(404, responseMessage?.userNotFound, {}, {}));
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(new apiResponse(401, responseMessage?.invalidpassword, {}, {}));
        }

        const payload = {
            id: user._id,
            userType: user.userType
        };

        const token = jwt.sign(payload, secretKey);

        return res.status(200).json(new apiResponse(200, responseMessage.loginSuccess, { token, user }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
};

export const forgot_password = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(new apiResponse(400, "Email is required", {}, {}));
        }

        let user = await userModel.findOne({ email, isActive: true });

        if (!user) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidEmail, {}, {}));
        }

        if (user.isBlock === true) {
            return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
        }

        // Generate consistent 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Send password reset email
        try {
            const emailResult = await email_verification_mail({ email: user.email, fullName: user.fullName }, otp);

            // Update user with OTP
            await userModel.findOneAndUpdate(
                { _id: user._id },
                { otp, otpExpireTime }
            );

            return res.status(200).json(new apiResponse(200, emailResult, {}, {}));
        } catch (emailError) {
            console.error('Password reset email failed:', emailError);
            return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, {}));
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};


export const reset_password = async (req: Request, res: Response) => {
    try {
        const { email, otp, password } = req.body;

        // Step 1: Find user with matching email, otp, and active status
        let user = await userModel.findOne({ email, isActive: true });
        if (!user) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP || "Invalid OTP or user not found", {}, {}));
        }
        // Developer override: allow 123456 as valid OTP
        const isDevOtp = otp === 123456;
        if (!isDevOtp && user.otp !== otp) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP || "Invalid OTP or user not found", {}, {}));
        }
        // Step 2: Check if OTP is expired
            if (!isDevOtp && new Date(user.otpExpireTime).getTime() < Date.now()) {
            return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP || "OTP has expired", {}, {}));
        }

        // Step 3: Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Step 4: Update user fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpireTime = null;
        user.isEmailVerified = true;
        user.isLoggedIn = true;

        const updatedUser = await user.save();

        return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess || "Password reset successful", updatedUser, {}));
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError || "Internal server error", {}, error));
    }
};


export const adminSignUp = async (req: Request, res: Response) => {
    try {
        const { fullName, email, mobileNo, password } = req.body;

        // Validate required fields
        if (!fullName || !email || !mobileNo || !password) {
            return res.status(400).json(new apiResponse(400, "Missing required fields", {}, {}));
        }

        // Check if user already exists
        let isAlready = await userModel.findOne({ email, isActive: true });
        if (isAlready) {
            return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}));
        }

        isAlready = await userModel.findOne({ mobileNo, isActive: true });
        if (isAlready) {
            return res.status(409).json(new apiResponse(409, "Mobile number already exists", {}, {}));
        }

        if (isAlready?.isBlock === true) {
            return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Handle uploaded image
        let imagePath = null;
        if (req.file && req.file.filename) {
            imagePath = `/Image/uploads/${req.file.filename}`;
        }

        // Create user
        const userData: any = {
            fullName,
            email,
            mobileNo,
            password: hashPassword,
            userType: "ADMIN",
            isActive: true
        };
        if (imagePath) {
            userData.image = imagePath;
        }

        let response = await new userModel(userData).save();

        // Generate OTP for email verification
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpireTime = new Date(Date.now() + 10 * 60 * 1000);

        // Send verification email
        try {
            const emailResult = await email_verification_mail({ email: response.email, fullName: response.fullName }, otp);

            // Update user with OTP
            await userModel.findOneAndUpdate(
                { _id: response._id },
                { otp, otpExpireTime }
            );

            const userResponse = {
                userType: response?.userType,
                isEmailVerified: response?.isEmailVerified,
                _id: response?._id,
                email: response?.email,
                fullName: response?.fullName,
                image: response?.image,
            };

            return res.status(200).json(new apiResponse(200, emailResult, userResponse, {}));
        } catch (emailError) {
            console.error('Admin signup email failed:', emailError);
            return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, {}));
        }
    } catch (error) {
        console.error('Admin signup error:', error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new apiResponse(400, "Email and password are required", {}, {}));
        }

        const response = await userModel.findOneAndUpdate(
            { email, isActive: true, isEmailVerified: true },
            { isLoggedIn: true }
        ).select('-__v -createdAt -updatedAt');

        if (!response) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}));
        }

        if (response?.isBlock === true) {
            return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
        }

        const passwordMatch = await bcryptjs.compare(password, response.password);
        if (!passwordMatch) {
            return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}));
        }

        const token = jwt.sign({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret);

        const userResponse = {
            isEmailVerified: response?.isEmailVerified,
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
            token,
        };

        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, userResponse, {}));
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};


import { Request, Response } from 'express';
import { Address, userModel } from '../database';
import { apiResponse } from '../common';
import { responseMessage } from '../helper';

// Create new address
export const createAddress = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      mobileNo,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country = 'India',
      isDefault = false,
      addressType = 'home'
    } = req.body;
    const userId = req.user?.id;
    
    // Validate required fields
    if (!fullName || !mobileNo || !email || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json(new apiResponse(400, 'All required fields must be provided', {}, {}));
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId,
      fullName,
      mobileNo,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
      addressType,
      createdBy: userId,
      updatedBy: userId
    });

    await address.save();

    return res.status(201).json(new apiResponse(201, 'Address created successfully', { address }, {}));
  } catch (error) {
    console.error('Create address error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Get all addresses for user
export const getAddresses = async (req: Request, res: Response) => {
  try { 
    const userId = req.user?.id;

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    return res.status(200).json(new apiResponse(200, 'Addresses retrieved successfully', { addresses }, {}));
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Get address by ID
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json(new apiResponse(404, 'Address not found', {}, {}));
    }

    return res.status(200).json(new apiResponse(200, 'Address retrieved successfully', { address }, {}));
  } catch (error) {
    console.error('Get address by ID error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Update address
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const {
      fullName,
      mobileNo,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
      addressType
    } = req.body;
    const userId = req.user?.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json(new apiResponse(404, 'Address not found', {}, {}));
    }

    // If setting as default, unset other default addresses
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Update fields
    if (fullName) address.fullName = fullName;
    if (mobileNo) address.mobileNo = mobileNo;
    if (email) address.email = email;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;
    if (addressType) address.addressType = addressType;

    address.updatedBy = userId;
    await address.save();

    return res.status(200).json(new apiResponse(200, 'Address updated successfully', { address }, {}));
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Delete address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json(new apiResponse(404, 'Address not found', {}, {}));
    }

    await Address.findByIdAndDelete(addressId);

    return res.status(200).json(new apiResponse(200, 'Address deleted successfully', {}, {}));
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

// Set default address
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json(new apiResponse(404, 'Address not found', {}, {}));
    }

    // Unset all default addresses
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    address.updatedBy = userId;
    await address.save();

    return res.status(200).json(new apiResponse(200, 'Default address set successfully', { address }, {}));
  } catch (error) {
    console.error('Set default address error:', error);
    return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Make sure you have authentication middleware
    const {
      name,
      mobileNo,
      pinCode,
      address,
      locality,
      city,
      state,
      addressType,
      isDefault
    } = req.body;

    if (!name || !mobileNo || !pinCode || !address || !locality || !city || !state || !addressType) {
      return res.status(400).json(new apiResponse(400, "All fields are required", {}, {}));
    }

    const addressObj = {
      name,
      mobileNo,
      pinCode,
      address,
      locality,
      city,
      state,
      addressType,
      isDefault: !!isDefault
    };

    // Push address to user's addresses array
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: addressObj } },
      { new: true }
    );

    return res.status(200).json(new apiResponse(200, "Address added successfully", { addresses: user.addresses }, {}));
  } catch (error) {
    return res.status(500).json(new apiResponse(500, "Internal server error", {}, error));
  }
};
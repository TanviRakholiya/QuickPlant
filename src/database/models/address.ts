import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
    addressType: { type: String, enum: ['home', 'office'], default: 'home' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Address = mongoose.model('Address', AddressSchema);
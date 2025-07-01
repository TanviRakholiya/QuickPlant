import mongoose, { Schema, Document } from 'mongoose';

const planSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  place: { type: String },
  frequency: { type: String, required: true },
  features: [{ type: String, required: true }],
  isPopular: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export const Plan = mongoose.model('Plan', planSchema); 
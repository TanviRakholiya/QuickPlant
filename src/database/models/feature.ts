import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  image: { type: String, required: true },         
  name: { type: String, required: true },         
  description: { type: String, required: true },   
  page: {
    type: String,
    enum: ['ABOUTPAGE', 'CUSTOMERPAGE', 'SELLERPAGE', 'GARDENERPAGE'],
    required: true
  },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Feature = mongoose.model('Feature', featureSchema); 
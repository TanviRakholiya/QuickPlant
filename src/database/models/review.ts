import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  productOrService: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  image: { 
    type: String 
  },
  reviewText: { 
    type: String, 
    required: true 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  userType: {
    type: String,
    required: true
  },
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
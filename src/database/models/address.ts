import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  mobileNo: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  addressLine1: { 
    type: String, 
    required: true 
  },
  addressLine2: { 
    type: String 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  pincode: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    default: 'India' 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  addressType: { 
    type: String, 
    enum: ['home', 'office', 'other'], 
    default: 'home' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

// Index for faster queries
addressSchema.index({ userId: 1 });

export const Address = mongoose.model('Address', addressSchema); 
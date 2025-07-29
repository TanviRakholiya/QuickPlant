import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  selectedSize: {
    label: { type: String },
    price: { type: Number }
  }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [cartItemSchema],
  // appliedCoupon: {
  //   code: { type: String },
  //   discount: { type: Number },
  //   discountType: { type: String, enum: ['percentage', 'fixed'] }
  // },
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
cartSchema.index({ userId: 1 });

export const Cart = mongoose.model('Cart', cartSchema); 
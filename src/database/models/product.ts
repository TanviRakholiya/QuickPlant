import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  images: [{ type: String, required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  store: { type: String },

  variants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant'
  }],

  isDeleted: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


export const Product = mongoose.model('Product', productSchema); 
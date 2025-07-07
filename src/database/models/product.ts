import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Product name
  description: { type: String, required: true }, // Product description
  highlights: [{ type: String }], // Array of highlight strings
  images: [{ type: String, required: true }], // Array of image URLs/paths
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Category reference
  store: { type: String }, // Store name (e.g., QuickPlant)
  price: { type: Number, required: true }, // Current price
  originalPrice: { type: Number }, // Original price (for discount display)
  discountPercent: { type: Number }, // Discount percentage
  sizes: [
    {
      label: { type: String, required: true }, // e.g., Small, Medium
      price: { type: Number, required: true }
    }


  ],
  isDeleted: { type: Boolean, default: false }, // Soft delete flag
  isFeatured: { type: Boolean, default: false }, // Featured product flag
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } , 
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the product
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // User who last updated the product
  
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema); 
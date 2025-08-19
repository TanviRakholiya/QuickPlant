import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  variantTypes: [{ type: Schema.Types.ObjectId, ref: 'VariantType' }],
  // You can also reference combinations if needed
  highlights: [{ type: String }],
  store: { type: String },
  basePrice: { type: Number },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = mongoose.model('Product', ProductSchema);
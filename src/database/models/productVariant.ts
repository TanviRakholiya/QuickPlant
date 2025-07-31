import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  size: { type: String, required: true }, // e.g., "Small", "Medium"
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercent: { type: Number }
}, { timestamps: true });

export const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
    
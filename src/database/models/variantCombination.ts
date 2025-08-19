import mongoose, { Schema } from 'mongoose';

const VariantCombinationSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantValues: [{ type: Schema.Types.ObjectId, ref: 'VariantValue', required: true }],
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }]
});

export const VariantCombination = mongoose.model('VariantCombination', VariantCombinationSchema);
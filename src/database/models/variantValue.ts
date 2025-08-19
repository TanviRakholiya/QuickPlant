import mongoose, { Schema } from 'mongoose';

const VariantValueSchema = new Schema({
  variantType: { type: Schema.Types.ObjectId, ref: 'VariantType', required: true },
  value: { type: String, required: true }, // e.g., "Small", "Green"
  slug: { type: String, required: true }   // e.g., "small", "green"
});

export const VariantValue = mongoose.model('VariantValue', VariantValueSchema);
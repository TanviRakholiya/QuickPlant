import mongoose, { Schema } from 'mongoose';

const VariantTypeSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Size"
  slug: { type: String, required: true, unique: true } // e.g., "size"
});

export const VariantType = mongoose.model('VariantType', VariantTypeSchema);
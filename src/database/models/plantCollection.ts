import mongoose from 'mongoose';

const plantCollectionSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const PlantCollection = mongoose.model('PlantCollection', plantCollectionSchema); 
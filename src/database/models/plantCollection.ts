import mongoose from 'mongoose';



const plantCollectionSchema = new mongoose.Schema({
  image: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const PlantCollection = mongoose.model('PlantCollection', plantCollectionSchema); 
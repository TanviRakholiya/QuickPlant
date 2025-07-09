import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Service name
  description: { type: String, required: true }, // Service description
  price: { type: Number, required: true }, // Total price
  unitPrice: { type: Number }, // Price per unit (e.g., per plant)
  duration: { type: String, required: true }, // Duration (e.g., '45 min')
  plantsCount: { type: String }, // Number of plants covered (e.g., '5-7')
  image: { type: String }, // Image URL/path
  isActive: { type: Boolean, default: true }, // Service active status
  isDeleted:{type:Boolean,default:false},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Creator reference
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Updater reference
}, { timestamps: true });    

export const Service = mongoose.model('Service', serviceSchema); 
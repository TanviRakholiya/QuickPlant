import mongoose, { Document, Schema } from 'mongoose';


const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Faq = mongoose.model('Faq', faqSchema); 
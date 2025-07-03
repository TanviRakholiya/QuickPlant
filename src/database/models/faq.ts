import mongoose, { Document, Schema } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: Date;
}

const faqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Faq = mongoose.model<IFaq>('Faq', faqSchema); 
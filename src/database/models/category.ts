import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: undefined },
    type: { type: String, enum: ['PLANT', 'WORK', "SERVICE"], required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const categoriesModel = mongoose.model('Category', categorySchema);
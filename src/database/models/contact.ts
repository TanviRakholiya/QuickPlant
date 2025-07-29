import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    emailOrMobile: {
        type: String,
        required: true,
        trim: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    message: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

 export const contactModel = mongoose.model('Inquiry', inquirySchema);

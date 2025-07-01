const mongoose = require('mongoose')

const userSchema: any = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    mobileNo: {
        type: String
    },
    password: {
        type: String
    },
    interest: {
        type: String
    },
    location: {
        type: String
    },
    preferredWorkLocation: {
        type: String
    },
    storeName: {
        type: String
    },
    nurseryName: {
        type: String
    },
    ownerName: {
        type: String
    },
    typeofPlant: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        required: false,
    },
    experience: {
        type: String
    },
    workCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    image: {
        type: String
    },
    userType: {
        type: String,
        enum: ["CUSTOMER", "SELLER", "GARDENER"],
        required: true
    },
    otp: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const userModel = mongoose.model('User', userSchema);
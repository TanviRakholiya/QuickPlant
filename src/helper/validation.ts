import Joi from 'joi';

export const authValidation = {
    otpSent: Joi.object({
        fullName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().optional(),
        mobileNo: Joi.string().pattern(/^[0-9]{10}$/).optional(),
        userType: Joi.string().valid("CUSTOMER","SELLER","GARDENER").required()
    }).or('email', 'mobileNo'),

    otpVerification: Joi.object({
        otp: Joi.number().integer().min(100000).max(999999).required()
    })  ,

    register: Joi.object({
        password: Joi.string()
            .min(6)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                'string.min': 'Password must be at least 6 characters long'
            }),
        // Optional fields based on user model
        interest: Joi.string().optional(),
        location: Joi.string().optional(),
        preferredWorkLocation: Joi.string().optional(),
        storeName: Joi.string().optional(),
        nurseryName: Joi.string().optional(),
        ownerName: Joi.string().optional(),
        typeofPlant: Joi.array().items(Joi.string().hex().length(24)).optional(), // ObjectId validation
        experience: Joi.string().optional(),
        workCategory: Joi.string().hex().length(24).optional(), // ObjectId validation
        image: Joi.string().optional()
    }),

    login: Joi.object({
        email: Joi.string().email().optional(),
        mobileNo: Joi.string().pattern(/^[0-9]{10}$/).optional(),
        password: Joi.string().required()
    }).or('email', 'mobileNo'),

    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),

    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().integer().min(100000).max(999999).required(),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                'string.min': 'Password must be at least 8 characters long'
            }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                'any.only': 'Passwords do not match'
            })
    }),

    adminSignUp: Joi.object({
        fullName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                'string.min': 'Password must be at least 8 characters long'
            })
    }),

    adminLogin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}; 
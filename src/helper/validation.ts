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
        typeofPlant: Joi.array().items(Joi.string().hex().length(24)).optional(),
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

export const productValidation = {
    productFeature: Joi.object({
        isFeatured: Joi.boolean().required()
    }),
    productCreate: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        highlights: Joi.array().items(Joi.string()),
        images: Joi.array().items(Joi.string()),
        category: Joi.string().hex().length(24).required(),
        store: Joi.string().optional(),
        price: Joi.number().required(),
        originalPrice: Joi.number().optional(),
        discountPercent: Joi.number().optional(),
        sizes: Joi.array().items(
            Joi.object({
                label: Joi.string().required(),
                price: Joi.number().required()
            })
        ).optional(),
        isFeatured: Joi.boolean().optional()
    }),
    productUpdate: Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        highlights: Joi.array().items(Joi.string()).optional(),
        images: Joi.array().items(Joi.string()).optional(),
        category: Joi.string().hex().length(24).optional(),
        store: Joi.string().optional(),
        price: Joi.number().optional(),
        originalPrice: Joi.number().optional(),
        discountPercent: Joi.number().optional(),
        sizes: Joi.array().items(
            Joi.object({
                label: Joi.string().required(),
                price: Joi.number().required()
            })
        ).optional(),
        isFeatured: Joi.boolean().optional()
    }),
    productDelete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

export const categoryValidation = {
    create: Joi.object({
        type: Joi.string().required(),
        name: Joi.string().required(),
    }),
    update: Joi.object({
        id: Joi.string().hex().length(24).required(),
        type: Joi.string().optional(),
        name: Joi.string().optional(),
    }),
    delete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

export const featureValidation = {
    create: Joi.object({
        name: Joi.string().required(),
    }),
    update: Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().optional(),
    }),
    delete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

export const planValidation = {
    create: Joi.object({
        name: Joi.string().required(),
    }),
    update: Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().optional(),
    }),
    delete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

export const serviceValidation = {
    create: Joi.object({
        name: Joi.string().required(),
    }),
    update: Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().optional(),
    }),
    delete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

export const reviewValidation = {
    create: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        productOrService: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        reviewText: Joi.string().required(),
    }),
    update: Joi.object({
        id: Joi.string().hex().length(24).required(),
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        productOrService: Joi.string().optional(),
        rating: Joi.number().min(1).max(5).optional(),
        reviewText: Joi.string().optional(),
    }),
    delete: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
}; 
import Joi from "joi";
// Reusable fields
const fields = {
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 30 characters long",
        "any.required": "Name is required",
    }),

    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(30).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 30 characters long",
        "any.required": "Password is required",
    }),

    passwordConfirm: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Password confirmation is required",
            "string.empty": "Password confirmation is required",
        }),

    phone: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.base": "Phone number must be a string",
            "string.empty": "Phone number is required",
            "string.length": "Phone number must be exactly 11 digits",
            "string.pattern.base": "Phone number must contain only digits",
            "any.required": "Phone number is required",
        }),
};


export const registerValidationSchema = Joi.object({
    name: fields.name,
    email: fields.email,
    password: fields.password,
    passwordConfirm: fields.passwordConfirm,
    phone: fields.phone,
});

export const loginValidationSchema = Joi.object({
    email: fields.email,
    password: fields.password,
});

export const resetPasswordValidationSchema = Joi.object({
    password: fields.password,
    passwordConfirm: fields.passwordConfirm,
});

export const updatePasswordValidationSchema = Joi.object({
    currentPassword: fields.password,
    password: fields.password,
    passwordConfirm: fields.passwordConfirm,
});

export const updateProfileValidationSchema = Joi.object({
    name: fields.name.optional(),
    phone: fields.phone.optional(),
    address: Joi.object({
        city: Joi.string().required().messages({
            "string.base": "City must be a string",
            "string.empty": "City is required",
            "any.required": "City is required",
        }),
        street: Joi.string().required().messages({
            "string.base": "Street must be a string",
            "string.empty": "Street is required",
            "any.required": "Street is required",
        }),
        building_number: Joi.number().positive().required().messages({
            "number.base": "Building number must be a number",
            "number.empty": "Building number is required",
            "number.positive": "Building number must be a positive number",
            "any.required": "Building number is required",
        }),
    })
});

export const cartValidationSchema = Joi.object({
    cart_info: Joi.array().items(
        Joi.object({
            productId:  Joi.string().required().messages({
                "string.base": "Product ID must be a string",
                "string.empty": "Product ID is required",
                "any.required": "Product ID is required",
            }),
            
            quantity: Joi.number().positive().messages({
                "number.base": "Quantity must be a number",
                "number.positive": "Quantity must be a positive number"
            })
        })
    )

});
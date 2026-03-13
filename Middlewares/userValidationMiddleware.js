import {
    registerValidationSchema,
    loginValidationSchema,
    updatePasswordValidationSchema, 
    resetPasswordValidationSchema,
    updateProfileValidationSchema
} from "../Utils/Validations/userValidaion.js";
import AppErrors from "../Utils/appErrors.js";
export const registerValidation = (req, res, next) => {

    const { error } = registerValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(new AppErrors(error.details[0].message, 400));
    }
    next();
};

export const loginValidation = (req, res, next) => {
    const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(new AppErrors(error.details[0].message, 400));
    }
    next();
};

export const updatePasswordValidation = (req, res, next) => {
    const { error } = updatePasswordValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(new AppErrors(error.details[0].message, 400));
    }
    next();
};

export const resetPasswordValidation = (req, res, next) => {
    const { error } = resetPasswordValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(new AppErrors(error.details[0].message, 400));
    }
    next();
};

export const updateProfileValidation = (req, res, next) => {
    const { error } = updateProfileValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next(new AppErrors(error.details[0].message, 400));
    }
    next();
};


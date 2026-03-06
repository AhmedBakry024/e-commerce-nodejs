import { registerValidationSchema, loginValidationSchema } from "../Utils/Validations/userValidaion.js";

export const registerValidation = (req, res, next) => {

    const { error } = registerValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details[0].message});
    }
    next();
};

export const loginValidation = (req, res, next) => {
    const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details[0].message});
    }
    next();
};
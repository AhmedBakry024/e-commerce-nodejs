import { Router } from "express";
import * as authController from "../Controllers/auth.controller.js";
import checkEmail from "../Middlewares/checkEmail.js";
import { registerValidation, loginValidation, updatePasswordValidation, resetPasswordValidation } from "../Middlewares/userValidationMiddleware.js";
import { protect } from "../Middlewares/protect.js";

const router = Router();

router.post("/register", registerValidation, checkEmail, authController.register);
router.get("/verify/:email", loginValidation, authController.verifyAccount);
router.post("/login", checkEmail, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token",resetPasswordValidation, authController.resetPassword);

router.use(protect);
router.post("/logout", authController.logout);
router.post("/update-password",updatePasswordValidation, authController.updatePassword);
router.put("/update-profile", authController.editProfile);

export default router; 
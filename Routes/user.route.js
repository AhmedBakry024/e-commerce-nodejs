import { Router } from "express";
import * as authController from "../Controllers/auth.controller.js";
import checkEmail from "../Middlewares/checkEmail.js";
import { registerValidation, loginValidation, updatePasswordValidation, resetPasswordValidation, updateProfileValidation } from "../Middlewares/userValidationMiddleware.js";
import { isUser, protect } from "../Middlewares/protect.js";
import { updateProfile, getMyProfile, getMyWishlist , addToWishlist , removeFromWishlist} from "../Controllers/user.controller.js";
const router = Router();

router.post("/register", registerValidation, checkEmail, authController.register);
router.get("/verify/:email", loginValidation, authController.verifyAccount);
router.post("/login", checkEmail, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token",resetPasswordValidation, authController.resetPassword);

router.use(protect);
router.post("/logout", authController.logout);
router.patch("/update-password",updatePasswordValidation, authController.updatePassword);
router.patch("/update-profile", updateProfileValidation, updateProfile);
router.get("/me", getMyProfile);

router.use(isUser);
router.get("/wishlist", getMyWishlist);
router.route("/wishlist/:productId")
    .post(addToWishlist)
    .delete(removeFromWishlist);

export default router; 
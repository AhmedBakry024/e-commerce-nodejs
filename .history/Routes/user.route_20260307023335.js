// import { Router } from "express";

// import * as authController from "../Controllers/auth.controller.js";
// import checkEmail from "../Middlewares/checkEmail.js";
// import { registerValidation, loginValidation } from "../Middlewares/userValidationMiddleware.js";

// const router = Router();

// router.post("/register", registerValidation, checkEmail, authController.register);
// router.get("/verify/:email", loginValidation, authController.verifyAccount);
// router.post("/login", checkEmail, authController.login);
// router.post("/logout", authController.logout);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
// router.post("/update-password", authController.updatePassword);

// export default router; 
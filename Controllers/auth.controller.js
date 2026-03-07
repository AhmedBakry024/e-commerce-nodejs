import jwt from "jsonwebtoken";

import { sendEmail } from "../Utils/Email/sendEmail.js";
import User from "../Models/user.model.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET);
};

export const register = catchAsyncError(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone
    });
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify`;
    await sendEmail(newUser.email, url);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
});

export const login = catchAsyncError(async (req, res, next) => {
  let foundUser = req.foundUser;
  if (!await foundUser.correctPassword(req.body.password, foundUser.password)) {
    return next(new AppErrors("Incorrect Email or Password", 401));
  }
  const token = signToken(foundUser._id, foundUser.role, foundUser.email);
  foundUser.password = undefined;
  return res.json({ message: "Welcome", data: foundUser, token: token });
});


export const logout = catchAsyncError(async (req, res, next) => {

});


export const forgotPassword = catchAsyncError(async (req, res, next) => {

});

export const resetPassword = catchAsyncError(async (req, res, next) => {

});

export const updatePassword = catchAsyncError(async (req, res, next) => {

});






export const verifyAccount = (req, res) => {
  let verifyEmail = req.params.email;
  jwt.verify(verifyEmail, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" })
    }
    await User.findOneAndUpdate({ email: decoded }, { is_verified: true })
    res.status(200).json({ message: "Account Verified" })
  })
}
import jwt from "jsonwebtoken";

import { sendEmail } from "../Utils/Email/sendEmail.js";
import User from "../Models/user.model.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";
import crypto from "crypto";

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET);
};

const generateRestToken = () => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return crypto
    .createHash('sha256')
    .update(randomBytes)
    .digest('hex');
}

export const register = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone
  });
  newUser.password = undefined;
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
  res.send("Logout");
});


export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppErrors("User not found", 404));
  }
  const restToken = generateRestToken();

  const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${restToken}`;
  user.passwordResetToken = restToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(user.email, url);
    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppErrors("Email could not be sent to user", 500));
  }

});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;
  res.send({
    token
  });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  res.send({
    message: "Password updated successfully"
  })
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
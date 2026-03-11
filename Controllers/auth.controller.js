import jwt from "jsonwebtoken";
import crypto from "crypto";

import { sendEmail } from "../Utils/Email/sendEmail.js";
import User from "../Models/user.model.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET);
};

const sendResWithToken = (user, status, message, res) => {
  const token = signToken(user._id, user.role, user.email);
  user.password = undefined;

  res.cookie('jwt', token, {
    httpOnly: true,
  });
  
  res.status(status).json({
    success: true,
    message,
    token,
    data: user
  });
}

export const register = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone
  });
  newUser.password = undefined;
  const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify`;
  // await sendEmail(newUser.email, url);
  res.status(201).json({  
    success: true,
    message: "User created successfully",
    data: newUser
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  let foundUser = await User.findOne({ email: req.body.email }).select('+password');
  if (!await foundUser.correctPassword(req.body.password, foundUser.password)) {
    return next(new AppErrors("Incorrect Email or Password", 401));
  }
  if (!foundUser.is_verified) {
    return next(new AppErrors("Your account is not verified", 401));
  }
  sendResWithToken(foundUser, 200,"Login successful", res);
});


export const logout = catchAsyncError(async (req, res, next) => {
    res.clearCookie('jwt',{
      httpOnly: true
    })
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppErrors("User not found", 404));
  }
  const restToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${restToken}`;
  try {
    await sendEmail(user.email, url, true);
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
  if (!token) {
    return next(new AppErrors("Invalid Token", 400));
  }  
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppErrors('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendResWithToken(user, 200, "Password updated successfully", res);
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppErrors("Incorrect Password", 401));
  }
  user.password = req.body.password;
  await user.save();

  sendResWithToken(user, 200, "Password updated successfully", res);
});


export const verifyAccount = (req, res) => {
  let verifyEmail = req.params.email;
  jwt.verify(verifyEmail, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new AppErrors("Invalid Token", 400));
    }
    await User.findOneAndUpdate({ email: decoded }, { is_verified: true })
    res.send("Account Verified");
  })
}
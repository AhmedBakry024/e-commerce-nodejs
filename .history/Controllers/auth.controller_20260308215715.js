import { sendEmail } from "../Utils/Email/sendEmail.js";
import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET);
};

export const register = async (req, res) => {
  try {
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
    console.log(req.body)
    console.log(req.body[ob])

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

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

export const login = async (req, res) => {
  let foundUser = req.foundUser;
  if (!await foundUser.correctPassword(req.body.password, foundUser.password)) {
    return res.status(422).json({ message: "Invalid Password or Email" });
  }
  const token = signToken(foundUser._id, foundUser.role, foundUser.email);
  foundUser.password = undefined;
  return res.json({ message: "Welcome", data: foundUser, token: token });
}

export const logout = (req, res) => {
  res.send("Logout");
}

export const forgotPassword = (req, res) => {
  res.send("Forgot Password");
}

export const resetPassword = (req, res) => {
  res.send("Reset Password");
}

export const updatePassword = (req, res) => {
  res.send("Update Password");
}
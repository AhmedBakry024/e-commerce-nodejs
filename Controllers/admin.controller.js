import User from "../Models/user.model.js";
import catchAsyncError from '../Utils/catchAsyncError.js';
import AppErrors from '../Utils/appErrors.js';
import Voucher from "../Models/voucher.model.js";

// get all users => /admin/users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find().select('-password');
    res.json(users);
});

export const createAdmin = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new AppErrors('Name, email and password are required', 400));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppErrors('Email already exists', 400));
    }
    const newAdmin = new User({
        name,
        email,
        password,
        role: 'admin',
        is_verified: true
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
});

export const banUser = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        return next(new AppErrors('User ID is required', 400));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppErrors('User not found', 404));
    }
    user.is_active = false;
    await user.save();
    res.json({ message: 'User banned successfully' });
});

export const unbanUser = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        return next(new AppErrors('User ID is required', 400));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppErrors('User not found', 404));
    }
    user.is_active = true;
    await user.save();
    res.json({ message: 'User unbanned successfully' });
});

export const addVoucher = catchAsyncError(async (req, res, next) => {
    const { code, discount, expiration_date } = req.body;
    if (!code || !discount) {
        return next(new AppErrors('Code and discount are required', 400));
    }

    const newVoucher = new Voucher({
        code,
        discount_percentage: discount,
        expiration_date: expiration_date ? new Date(expiration_date) : undefined
    });
    await newVoucher.save();
    res.status(201).json({ message: 'Voucher added successfully' });
});

export const getAllVouchers = catchAsyncError(async (req, res, next) => {
    const vouchers = await Voucher.find();
    res.json(vouchers);
});
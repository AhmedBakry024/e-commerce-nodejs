import AppErrors from "../Utils/appErrors.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

// protect middleware => protect routes that only logged in users can access
export const protect = catchAsyncError(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt_token) {
        token = req.cookies.jwt_token;
    }
    if (!token) {
        return next(new AppErrors('You are not logged in, Please log in!', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppErrors('The user belonging to this token does no longer exist', 401));
    }

    if (currentUser.passwordChangedAfter(decoded.iat)) {
        return next(new AppErrors('User recently changed password! Please log in again', 401));
    }

    req.user = currentUser;
    next();
});

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};

export const isUser = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({ error: 'This action is allowed only for users' });
    }
    next();
};
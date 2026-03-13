
import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";
import User from "../Models/user.model.js";

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppErrors("User not found", 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
})


export const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppErrors("User not found", 404));
  }
  if(user.role !== "user") {
    return next(new AppErrors("This action is allowed only for users", 403));
  }
  if (req.body.email) {
    return next(new AppErrors("You cannot update email right now", 403));
  }
  if (req.body.password || req.body.passwordConfirm || req.body.currentPassword) {
    return next(new AppErrors("You cannot update password here", 400));
  }
  if (req.body.role) {
    return next(new AppErrors("you do not have permission to update role", 403));
  }

  const allowedFields = ["name", "phone"];
  
  allowedFields.forEach(field => {
    if (req.body[field]) user[field] = req.body[field];
  });

  const addr = req.body.address;
  if (addr) {
    user.address = {
      city: addr.city,
      street: addr.street,
      building_number: addr.building_number
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user
  });
});
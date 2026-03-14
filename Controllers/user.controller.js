
import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";
import Product from "../Models/product.model.js";

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
})


export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  if (user.role !== "user") {
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


export const addToWishlist = catchAsyncError(async (req, res, next) => {
  const { user } = req;

  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppErrors("Product not found", 404));
  }
  const isExists = user.wishlist.some(item => item.toString() === productId );
  if (isExists) {
    return next(new AppErrors("Product already in wishlist", 400));
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.name} added to your wishlist successfully`,
  });
});

export const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  
  const { user } = req;
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppErrors("Product not found", 404));
  }
  if(user.wishlist.length === 0) {
    return next(new AppErrors("Your wishlist is empty", 400));
  }
  const sizeBefore = user.wishlist.length;
  user.wishlist = user.wishlist.filter(prod => prod.toString() !== productId);

  if (user.wishlist.length === sizeBefore) {
    return next(new AppErrors("Product not found in your wishlist", 400));
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.name} removed from your wishlist successfully`,
  });
});

export const getMyWishlist = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const wishlist = await Product.find({ _id: { $in: user.wishlist } });
  res.status(200).json({
    success: true,
    data: wishlist,
  });
});
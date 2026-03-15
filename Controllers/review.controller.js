import catchAsyncError from "../Utils/catchAsyncError.js";
import AppErrors from "../Utils/appErrors.js";
import Review from "../Models/review.model.js";
import Order from "../Models/order.model.js";

export const createReview = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.product_id;
    const purchasedProduct = await Order.findOne({
        user_id: userId,
        products: { $elemMatch: { product_id: productId } }
    });

    if (!purchasedProduct) {
        return next(new AppErrors("Buy the product first, then write a review", 400));
    }
    const review = await Review.create({
        user_id: userId,
        product_id: productId,
        review_content: req.body.review_content,
        rating: req.body.rating
    })

    res.status(201).json({ success: true, data: review });
});


export const getAllProductReviews = catchAsyncError(async (req, res, next) => {
    
    const reviews = await Review.find({ product_id: req.params.product_id });
    res.status(200).json({ success: true, data: reviews });
});


export const deleteReview = catchAsyncError(async (req, res, next) => {
    await req.review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
});


export const updateReview = catchAsyncError(async (req, res, next) => {
    req.review.review_content = req.body.review_content;
    req.review.rating = req.body.rating;
    await req.review.save();
    res.status(200).json({ success: true, data: req.review });
});
import AppErrors from "../Utils/appErrors.js";
import Review from "../Models/review.model.js";

export const chekcReviewExistAndOwnership = async (req, res, next) => {
    const review = await Review.findById(req.params.review_id);
    console.log(review);
    if (!review) {
        return next(new AppErrors("There is no review with this id", 404));w
    }
    if (review.user_id.toString() !== req.user.id) {
        return next(new AppErrors("You are not allowed to delete this review", 401));
    }
    req.review = review;
    next();
}
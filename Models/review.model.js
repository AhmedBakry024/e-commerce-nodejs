import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    review_content: {
        type: String,
        maxlength: 1000 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { 
    timestamps: true,
    versionKey: false
});

// avoid the same user to review the same product twice
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
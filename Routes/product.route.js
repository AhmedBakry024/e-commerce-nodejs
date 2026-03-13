import express from "express";

import {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from "../Controllers/product.controller.js";

import {
    createReview,
    getAllProductReviews,
    deleteReview,
    updateReview
} from "../Controllers/review.controller.js";

import { protect } from "../Middlewares/protect.js";
import { chekcReviewExistAndOwnership } from "../Middlewares/reviewMiddleware.js";
const router = express.Router();

router.use(protect);

router.post("/", addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.route("/:product_id/reviews")
        .post(createReview)    
        .get(getAllProductReviews);

router.route("/:product_id/reviews/:review_id")
        .delete(chekcReviewExistAndOwnership,deleteReview)
        .put(chekcReviewExistAndOwnership, updateReview);


export default router;
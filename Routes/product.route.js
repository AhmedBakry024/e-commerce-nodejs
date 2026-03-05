import express from "express";

import {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from "../Controllers/product.controller.js";

const router = express.Router();

router.post("/", addProduct);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
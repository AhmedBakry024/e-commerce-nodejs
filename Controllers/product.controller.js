import { Product } from "../Models/product.model.js";


// Add Product
export const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json({ message: "Product added", product });
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Get All Products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("cat_id");
        res.json(products);
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Get Single Product
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("cat_id");
        res.json(product);
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Update Product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({ message: "Product updated", product });
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.json({ message: "Error", error });
    }
};
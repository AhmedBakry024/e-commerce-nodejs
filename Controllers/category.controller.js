import { categoryModel } from "../Models/category.model.js";


// Add Category
export const addCategory = async (req, res) => {
    try {
        const category = await categoryModel.create(req.body);
        res.json({ message: "Category added", category });
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.json(categories);
    } catch (error) {
        res.json({ message: "Error", error });
    }
};


// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted", category });
    } catch (error) {
        res.json({ message: "Error", error });
    }
};
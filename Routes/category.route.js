import express from "express";
import { addCategory, getCategories, deleteCategory } from "../Controllers/category.controller.js";
import { protect ,isAdmin } from "../Middlewares/protect.js";

const router = express.Router();

router.post("/", protect, isAdmin, addCategory);

router.get("/", getCategories);

router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
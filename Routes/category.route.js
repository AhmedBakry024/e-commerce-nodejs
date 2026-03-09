import express from "express";
import { addCategory, getCategories, deleteCategory } from "../Controllers/category.controller.js";

const router = express.Router();

router.post("/", addCategory);

router.get("/", getCategories);

router.delete("/:id", deleteCategory);

export default router;
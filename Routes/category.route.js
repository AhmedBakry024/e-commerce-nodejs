import express from "express";
import { addCategory, getCategories, deleteCategory } from "../Controllers/category.controller.js";
import {  isAdmin } from "../Middlewares/protect.js";

const router = express.Router();

router.post("/", isAdmin, addCategory);

router.get("/", getCategories);

router.delete("/:id", isAdmin, deleteCategory);

export default router;
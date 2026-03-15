import express from "express";

import {checkout, getTestCards} from "../Controllers/payment.controller.js";

import { protect , isUser} from "../Middlewares/protect.js";

const router = express.Router();
router.use(protect);

router.post("/pay", isUser, checkout);
router.get("/get-cards", getTestCards);


export default router;
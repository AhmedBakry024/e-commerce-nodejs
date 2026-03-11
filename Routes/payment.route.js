import express from "express";

import {createPaymentIntent, getTestCards} from "../Controllers/payment.controller.js";

import { protect } from "../Middlewares/protect.js";

const router = express.Router();
// router.use(protect);

router.post("/pay", createPaymentIntent);
router.get("/get-cards", getTestCards);


export default router;
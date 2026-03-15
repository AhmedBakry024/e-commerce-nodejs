import { Router } from "express";
import { getMyOrders } from "../Controllers/order.controller.js";
import { protect } from "../Middlewares/protect.js";

const router = Router();
router.use(protect);
router.get("/myorders", getMyOrders);

export default router;